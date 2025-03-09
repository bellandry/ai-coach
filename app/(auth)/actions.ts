"use server";

import { getOAuthClient } from "@/core/oauth/base";
import { db } from "@/lib/db";
import { signInSchema, signUpSchema } from "@/lib/definitions";
import { OAuthProvider } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  comparePasswords,
  generateSalt,
  hashPassword,
} from "../../core/passwordHasher";
import { createUserSession, removeUserFromSession } from "../../core/session";

export async function signIn(unsafeData: z.infer<typeof signInSchema>) {
  const { success, data } = signInSchema.safeParse(unsafeData);

  if (!success) return "Veuillez bien remplir tous les champs";

  const user = await db.user.findFirst({
    where: { email: data.email },
  });

  if (user == null || user.password == null || user.salt == null) {
    return "Utilisateur inexistant";
  }

  const isCorrectPassword = await comparePasswords({
    hashedPassword: user.password,
    password: data.password,
    salt: user.salt,
  });

  if (!isCorrectPassword) return "Mot de passe incorrect!";

  await createUserSession(user, await cookies());

  redirect("/dashboard");
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
