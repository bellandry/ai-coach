"use server";

import { getCurrentUser } from "@/core/current-user";
import { db } from "@/lib/db";
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
  const currentUser = await getCurrentUser({ redirectIfNotFound: true });

  if (!currentUser) {
    throw new Error("Utilisateur non authentifié");
  }

  const { success } = profileSchema.safeParse(data);

  if (!success) {
    throw new Error("Données de profil invalides");
  }

  await db.user.update({
    where: { id: currentUser.id },
    data: {
      name: data.name,
      email: data.email,
      profile: data.profile || null,
    },
  });

  return { success: true };
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

  // Ici, vous devriez implémenter la logique d'upload vers un service comme AWS S3, Cloudinary, etc.
  // Pour cet exemple, nous allons simuler un upload et retourner une URL fictive

  // Exemple avec Cloudinary (à adapter selon votre service d'upload)
  // const formData = new FormData();
  // formData.append("file", file);
  // formData.append("upload_preset", "your_preset");
  // const response = await fetch("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", {
  //   method: "POST",
  //   body: formData,
  // });
  // const data = await response.json();
  // return data.secure_url;

  // URL fictive pour l'exemple
  const mockUrl = `https://images.unsplash.com/photo-${Date.now()}?user=${
    currentUser.id
  }`;

  // Mise à jour du profil utilisateur avec la nouvelle URL
  await db.user.update({
    where: { id: currentUser.id },
    data: { profile: mockUrl },
  });

  return mockUrl;
}

export async function connectProvider(provider: OAuthProvider) {
  // Rediriger vers la page d'authentification OAuth
  const cookieStore = await cookies();
  cookieStore.set("oauth_redirect_after", "/profile", { path: "/" });

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
    throw new Error("Vous devez conserver au moins une méthode de connexion");
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
