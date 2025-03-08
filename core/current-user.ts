import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getUserFromSession } from "./session";

type FullUser = Exclude<
  Awaited<ReturnType<typeof getUserFromDb>>,
  undefined | null
>;

type User = Exclude<
  Awaited<ReturnType<typeof getUserFromSession>>,
  undefined | null
>;

function _getCurrentUser(options: {
  withFullUser: true;
  redirectIfNotFound: true;
}): Promise<FullUser>;
function _getCurrentUser(options: {
  withFullUser: true;
  redirectIfNotFound?: false;
}): Promise<FullUser | null>;
function _getCurrentUser(options: {
  withFullUser?: false;
  redirectIfNotFound: true;
}): Promise<User>;
function _getCurrentUser(options?: {
  withFullUser?: false;
  redirectIfNotFound?: false;
}): Promise<User | null>;
async function _getCurrentUser({
  withFullUser = false,
  redirectIfNotFound = false,
} = {}) {
  const cookieStore = await cookies();
  const sessionUser = await getUserFromSession(cookieStore);

  if (sessionUser == null) {
    if (redirectIfNotFound) return redirect("/sign-in");
    return null;
  }

  if (withFullUser) {
    const fullUser = await getUserFromDb(sessionUser.id);
    // This should never happen
    if (fullUser == null) throw new Error("User not found in database");
    return fullUser;
  }

  return sessionUser;
}

export const getCurrentUser = cache(_getCurrentUser);

function getUserFromDb(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
    include: {
      oAuthAccounts: {
        select: {
          provider: true,
        },
      },
    },
  });
}
