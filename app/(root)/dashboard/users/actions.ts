"use server";

import { getCurrentUser } from "@/core/current-user";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

type ActionResponse = {
  success: boolean;
  error?: string;
};

export async function updateUserRole(
  userId: string,
  role: UserRole
): Promise<ActionResponse> {
  try {
    const currentUser = await getCurrentUser({
      redirectIfNotFound: true,
    });

    // Check if the current user is an admin
    if (currentUser.role !== "ADMIN") {
      return {
        success: false,
        error: "Vous n'avez pas les permissions nécessaires",
      };
    }

    // Check if the user exists
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return {
        success: false,
        error: "Utilisateur non trouvé",
      };
    }

    // Update the user role
    await db.user.update({
      where: { id: userId },
      data: { role },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la mise à jour du rôle",
    };
  }
}

export async function updateUserStatus(
  userId: string,
  disabled: boolean
): Promise<ActionResponse> {
  try {
    const currentUser = await getCurrentUser({
      redirectIfNotFound: true,
    });

    // Check if the current user is an admin
    if (currentUser.role !== "ADMIN") {
      return {
        success: false,
        error: "Vous n'avez pas les permissions nécessaires",
      };
    }

    // Check if the user exists
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return {
        success: false,
        error: "Utilisateur non trouvé",
      };
    }

    // Prevent disabling your own account
    if (userId === currentUser.id) {
      return {
        success: false,
        error: "Vous ne pouvez pas désactiver votre propre compte",
      };
    }

    // Update the user status
    await db.user.update({
      where: { id: userId },
      data: { disabled },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating user status:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la mise à jour du statut",
    };
  }
}