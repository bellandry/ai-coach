"use server";

import { resendVerificationEmail } from "@/app/(auth)/actions";
import { getCurrentUser } from "@/core/current-user";
import {
  comparePasswords,
  generateSalt,
  hashPassword,
} from "@/core/passwordHasher";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { db } from "@/lib/db";
import { generateQRCode } from "@/lib/qrcode";
import { generateSecret, verifyToken } from "@/lib/totp";
import { OAuthProvider } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  profile: z.string().optional(),
});

export async function updateUserProfile(data: z.infer<typeof profileSchema>) {
  const currentUser = await getCurrentUser({
    redirectIfNotFound: true,
    withFullUser: true,
  });

  if (!currentUser) {
    throw new Error("Utilisateur non authentifié");
  }

  const { success } = profileSchema.safeParse(data);

  if (!success) {
    throw new Error("Données de profil invalides");
  }

  // Check if email has changed
  const emailChanged = currentUser.email !== data.email;

  // If email hasn't changed, update profile normally
  if (!emailChanged) {
    await db.user.update({
      where: { id: currentUser.id },
      data: {
        name: data.name,
        profile: data.profile || null,
      },
    });
    return { success: true };
  }

  // If email has changed, store the new email temporarily and send verification code
  await db.user.update({
    where: { id: currentUser.id },
    data: {
      name: data.name,
      profile: data.profile || null,
      pendingEmail: data.email,
      emailVerified: false,
    },
  });

  // Send verification email to the new address
  await resendVerificationEmail(data.email);

  return {
    success: true,
    emailVerificationRequired: true,
    newEmail: data.email,
  };
}

export async function uploadProfileImage(formData: FormData) {
  const currentUser = await getCurrentUser({ redirectIfNotFound: true });

  if (!currentUser) {
    throw new Error("Utilisateur non authentifié");
  }

  const file = formData.get("file") as File;

  if (!file) {
    throw new Error("Aucun fichier fourni");
  }

  // Convertir le fichier en base64 pour Cloudinary
  const fileBuffer = await file.arrayBuffer();
  const fileBase64 = Buffer.from(fileBuffer).toString("base64");
  const fileUri = `data:${file.type};base64,${fileBase64}`;

  // Générer un nom de fichier unique
  const fileName = `profile_${currentUser.id}_${Date.now()}`;

  try {
    // Upload vers Cloudinary
    const uploadResponse = await uploadToCloudinary(fileUri, fileName);

    if (!uploadResponse.success) {
      throw new Error("Échec de l'upload vers Cloudinary");
    }

    const imageUrl = uploadResponse.result?.secure_url;

    if (!imageUrl) {
      throw new Error("URL d'image non disponible");
    }

    // Mise à jour du profil utilisateur avec la nouvelle URL
    await db.user.update({
      where: { id: currentUser.id },
      data: { profile: imageUrl },
    });

    return imageUrl;
  } catch (error) {
    console.error("Erreur lors de l'upload de l'image:", error);
    throw new Error("Échec de l'upload de l'image");
  }
}

export async function connectProvider(provider: OAuthProvider) {
  // Rediriger vers la page d'authentification OAuth
  const cookieStore = await cookies();
  cookieStore.set("oauth_redirect_after", "/dashboard/profile", { path: "/" });

  redirect(`/api/oauth/${provider}`);
}

export async function disconnectProvider(provider: OAuthProvider) {
  const currentUser = await getCurrentUser({ redirectIfNotFound: true });

  if (!currentUser) {
    throw new Error("Utilisateur non authentifié");
  }

  // Vérifier si l'utilisateur a au moins une autre méthode de connexion
  const oAuthAccounts = await db.userOAuthAccount.findMany({
    where: { userId: currentUser.id },
  });

  const hasPassword = await db.user.findUnique({
    where: { id: currentUser.id },
    select: { password: true },
  });

  // Si c'est le seul moyen de connexion, empêcher la déconnexion
  if (oAuthAccounts.length <= 1 && !hasPassword?.password) {
    return { success: false };
  }

  // Supprimer le compte OAuth
  await db.userOAuthAccount.deleteMany({
    where: {
      userId: currentUser.id,
      provider,
    },
  });

  return { success: true };
}

export async function updateUserPassword(data: {
  currentPassword?: string;
  newPassword: string;
}) {
  const currentUser = await getCurrentUser({ redirectIfNotFound: true });

  if (!currentUser) {
    return { success: false, error: "Utilisateur non authentifié" };
  }

  // Vérifier si l'utilisateur a déjà un mot de passe
  const user = await db.user.findUnique({
    where: { id: currentUser.id },
    select: { password: true, salt: true },
  });

  // Si l'utilisateur a déjà un mot de passe, vérifier l'ancien mot de passe
  if (user?.password && user?.salt) {
    if (!data.currentPassword) {
      return { success: false, error: "Mot de passe actuel requis" };
    }

    const isCorrectPassword = await comparePasswords({
      hashedPassword: user.password,
      password: data.currentPassword,
      salt: user.salt,
    });

    if (!isCorrectPassword) {
      return { success: false, error: "Mot de passe actuel incorrect" };
    }
  }

  // Générer un nouveau sel et hacher le nouveau mot de passe
  const salt = await generateSalt();
  const hashedPassword = await hashPassword(data.newPassword, salt);

  // Mettre à jour le mot de passe de l'utilisateur
  await db.user.update({
    where: { id: currentUser.id },
    data: {
      password: hashedPassword,
      salt,
    },
  });

  return { success: true };
}

export async function enableTwoFactorAuth() {
  const currentUser = await getCurrentUser({
    redirectIfNotFound: true,
    withFullUser: true,
  });

  if (!currentUser) {
    return { success: false, error: "Utilisateur non authentifié" };
  }

  // Générer un secret TOTP
  const secret = generateSecret();

  // Générer un QR code pour l'application d'authentification
  const otpauth = `otpauth://totp/${encodeURIComponent(currentUser.email)}?secret=${secret}&issuer=Ai-Coach`;
  const qrCodeUrl = await generateQRCode(otpauth);

  // Stocker temporairement le secret (non activé)
  await db.user.update({
    where: { id: currentUser.id },
    data: {
      twoFactorSecret: secret,
      twoFactorEnabled: false,
    },
  });

  return {
    success: true,
    secret,
    qrCodeUrl,
  };
}

export async function verifyTwoFactorCode({
  secret,
  token,
}: {
  secret: string;
  token: string;
}) {
  const currentUser = await getCurrentUser({ redirectIfNotFound: true });

  if (!currentUser) {
    return { success: false, error: "Utilisateur non authentifié" };
  }

  // Vérifier le code TOTP
  const isValid = verifyToken({ token, secret });

  if (!isValid) {
    return { success: false, error: "Code invalide" };
  }

  // Activer l'authentification à deux facteurs
  await db.user.update({
    where: { id: currentUser.id },
    data: {
      twoFactorEnabled: true,
    },
  });

  return { success: true };
}

export async function disableTwoFactorAuth() {
  const currentUser = await getCurrentUser({ redirectIfNotFound: true });

  if (!currentUser) {
    return { success: false, error: "Utilisateur non authentifié" };
  }

  // Désactiver l'authentification à deux facteurs
  await db.user.update({
    where: { id: currentUser.id },
    data: {
      twoFactorEnabled: false,
      twoFactorSecret: null,
    },
  });

  return { success: true };
}
