import { getCurrentUser } from "@/core/current-user";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { UsersTable } from "./_components/users-table";

export default async function UsersPage() {
  const currentUser = await getCurrentUser({
    redirectIfNotFound: true,
  });

  // Only allow admins to access this page
  if (currentUser.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch users from the database
  const users = await db.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      role: true,
      disabled: true,
      createdAt: true,
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Gestion des utilisateurs
        </h1>
        <p className="text-muted-foreground">
          Gérez les utilisateurs de la plateforme, leurs rôles et leurs accès.
        </p>
      </div>
      <UsersTable users={users} />
    </div>
  );
}
