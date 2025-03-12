"use server";

import { getCurrentUser } from "@/core/current-user";
import { generateSalt, hashPassword } from "@/core/passwordHasher";
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

type CreateUserData = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export async function createUser(
  data: CreateUserData
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

    // Check if user with this email already exists
    const existingUser = await db.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return {
        success: false,
        error: "Un utilisateur avec cet email existe déjà",
      };
    }

    // Hash the password
    const salt = generateSalt();
    const hashedPassword = await hashPassword(data.password, salt);

    // Create the user
    await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la création de l'utilisateur",
    };
  }
}
