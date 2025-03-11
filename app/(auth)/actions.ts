"use server";

import { getOAuthClient } from "@/core/oauth/base";
import { db } from "@/lib/db";
import { signUpSchema } from "@/lib/definitions";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/email";
import { generateOTP } from "@/lib/otp";
import { verifyToken } from "@/lib/totp";
import { OAuthProvider } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  comparePasswords,
  generateSalt,
  hashPassword,
} from "../../core/passwordHasher";
import {
  createTempSession,
  createUserSession,
  getUserIdFromTempSession,
  removeUserFromSession,
} from "../../core/session";

export async function signIn(data: { email: string; password: string }) {
  const user = await db.user.findUnique({
    where: { email: data.email },
    select: {
      id: true,
      password: true,
      salt: true,
      role: true,
      twoFactorEnabled: true,
      twoFactorSecret: true,
      emailVerified: true,
    },
  });

  if (!user || !user.password || !user.salt) {
    return { success: false, error: "Identifiants invalides" };
  }

  const isCorrectPassword = await comparePasswords({
    hashedPassword: user.password,
    password: data.password,
    salt: user.salt,
  });

  if (!isCorrectPassword) {
    return { success: false, error: "Identifiants invalides" };
  }

  const hasProvider = await db.userOAuthAccount.findFirst({
    where: { userId: user.id },
  });

  if (!user.emailVerified && !hasProvider) {
    // Générer un nouveau code OTP et l'envoyer
    await resendVerificationEmail(data.email);
    return {
      success: false,
      requiresVerification: true,
      error:
        "Veuillez vérifier votre adresse mail, un code vous a été envoyé par mail",
    };
  }

  if (user.twoFactorEnabled && user.twoFactorSecret) {
    // Créer une session temporaire pour la vérification 2FA
    const tempSession = await createTempSession(user.id);
    const Cookie = await cookies();
    Cookie.set("temp_session", tempSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10, // 10 minutes
      path: "/",
    });

    return { success: false, requires2FA: true };
  }

  // Créer une session pour l'utilisateur
  // const session = await createSession(user.id);
  // const Cookie = await cookies();
  // Cookie.set("session", session, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   maxAge: 60 * 60 * 24 * 7, // 1 semaine
  //   path: "/",
  // });
  const userSession = {
    id: user.id,
    role: user.role,
  };
  await createUserSession(userSession, await cookies());

  return { success: true };
}

export async function signUp(unsafeData: z.infer<typeof signUpSchema>) {
  const { success, data } = signUpSchema.safeParse(unsafeData);

  if (!success) return "Veuillez bien remplir tous les champs";

  const existingUser = await db.user.findFirst({
    where: { email: data.email },
  });

  if (existingUser != null)
    return "Un compte est déja associé à cette adresse mail";

  try {
    const salt = generateSalt();
    const hashedPassword = await hashPassword(data.password, salt);

    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        salt,
      },
      select: {
        id: true,
        role: true,
        name: true,
        email: true,
      },
    });

    if (user == null)
      return "Impossible de créer le compte, veuillez réessayer plus tard";
    await createUserSession(user, await cookies());
  } catch {
    return "Une erreur s'est produite, veuillez réessayer plus tard";
  }

  redirect("/dashboard");
}

export async function logOut() {
  await removeUserFromSession(await cookies());
  redirect("/");
}

export async function oAuthSignIn(provider: OAuthProvider) {
  const oAuthClient = getOAuthClient(provider);
  redirect(oAuthClient.createAuthUrl(await cookies()));
}

export async function verifyEmail(otp: string, email: string) {
  // Récupérer l'utilisateur avec le code de vérification
  const user = await db.user.findUnique({
    where: { email },
    select: {
      emailVerificationCode: true,
      emailVerificationExpires: true,
      emailVerified: true,
    },
  });

  if (!user) {
    return { success: false, error: "Utilisateur non trouvé" };
  }

  if (user.emailVerified) {
    return { success: true }; // Déjà vérifié
  }

  if (
    !user.emailVerificationCode ||
    !user.emailVerificationExpires ||
    user.emailVerificationExpires < new Date()
  ) {
    return { success: false, error: "Code expiré ou invalide" };
  }

  if (user.emailVerificationCode !== otp) {
    return { success: false, error: "Code incorrect" };
  }

  // Marquer l'email comme vérifié
  await db.user.update({
    where: { email },
    data: {
      emailVerified: true,
      emailVerificationCode: null,
      emailVerificationExpires: null,
    },
  });

  return { success: true };
}

export async function resendVerificationEmail(email: string) {
  // Vérifier si l'email est déjà vérifié
  const user = await db.user.findUnique({
    where: { email },
    select: { emailVerified: true, email: true, name: true },
  });

  if (!user) {
    return { success: false, error: "Utilisateur non trouvé" };
  }

  if (user.emailVerified) {
    return { success: true }; // Déjà vérifié
  }

  // Générer un nouveau OTP
  const otp = generateOTP();
  const otpExpires = new Date();
  otpExpires.setMinutes(otpExpires.getMinutes() + 15); // Expire dans 15 minutes

  // Mettre à jour l'OTP dans la base de données
  await db.user.update({
    where: { email },
    data: {
      emailVerificationCode: otp,
      emailVerificationExpires: otpExpires,
    },
  });

  // Envoyer l'email de vérification
  await sendVerificationEmail({
    to: user.email,
    name: user.name,
    otp,
  });

  return { success: true };
}

export async function verify2FA(token: string) {
  // Récupérer l'utilisateur à partir de la session temporaire
  const Cookie = await cookies();
  const tempSession = Cookie.get("temp_session")?.value;
  if (!tempSession) {
    return { success: false, error: "Session expirée" };
  }

  const userId = await getUserIdFromTempSession(tempSession);
  if (!userId) {
    return { success: false, error: "Session invalide" };
  }

  // Récupérer le secret 2FA de l'utilisateur
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { twoFactorSecret: true, id: true, role: true },
  });

  if (!user?.twoFactorSecret) {
    return { success: false, error: "Configuration 2FA invalide" };
  }

  // Vérifier le code TOTP
  const isValid = verifyToken({
    token,
    secret: user.twoFactorSecret,
  });

  if (!isValid) {
    return { success: false, error: "Code invalide" };
  }

  // Supprimer la session temporaire
  Cookie.delete("temp_session");

  // Créer une session complète
  // const session = await createSession(userId);
  // Cookie.set("session", session, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   maxAge: 60 * 60 * 24 * 7, // 1 semaine
  //   path: "/",
  // });

  await createUserSession(user, await cookies());

  return { success: true };
}

export async function forgotPassword(email: string) {
  // Vérifier si l'utilisateur existe
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true },
  });

  if (!user) {
    // Pour des raisons de sécurité, ne pas indiquer si l'email existe ou non
    return { success: true };
  }

  // Générer un token de réinitialisation
  const resetToken = generateOTP(32);
  const resetTokenExpires = new Date();
  resetTokenExpires.setHours(resetTokenExpires.getHours() + 1); // Expire dans 1 heure

  // Stocker le token dans la base de données
  await db.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpires,
    },
  });

  // Envoyer l'email de réinitialisation
  await sendPasswordResetEmail({
    to: user.email,
    name: user.name,
    resetToken,
  });

  return { success: true };
}

export async function resetPassword(data: { token: string; password: string }) {
  // Vérifier si le token est valide
  const user = await db.user.findFirst({
    where: {
      resetPasswordToken: data.token,
      resetPasswordExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    return { success: false, error: "Lien invalide ou expiré" };
  }

  // Générer un nouveau sel et hacher le nouveau mot de passe
  const salt = await generateSalt();
  const hashedPassword = await hashPassword(data.password, salt);

  // Mettre à jour le mot de passe de l'utilisateur
  await db.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      salt,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    },
  });

  return { success: true };
}
