import { getOAuthClient } from "@/core/oauth/base";
import { createUserSession } from "@/core/session";
import { db } from "@/lib/db";
import { OAuthProvider } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider: rawProvider } = await params;
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const provider = z.nativeEnum(OAuthProvider).parse(rawProvider);

  if (!code || !state) {
    redirect(
      `/sign-in?oauthError=${encodeURIComponent(
        "Failed to connect. Please try again."
      )}`
    );
  }

  const oAuthClient = getOAuthClient(provider as OAuthProvider);
  try {
    const oAuthUser = await oAuthClient.fetchUser(code, state, await cookies());
    const user = await connectUserToAccount(oAuthUser, provider);
    await createUserSession(user, await cookies());
  } catch (error) {
    console.error(error);
    redirect(
      `/sign-in?oauthError=${encodeURIComponent(
        "Failed to connect. Please try again."
      )}`
    );
  }

  redirect("/");
}

function connectUserToAccount(
  { id, email, name }: { id: string; email: string; name: string },
  provider: OAuthProvider
) {
  return db.$transaction(async (tx) => {
    let user = await tx.user.findFirst({
      where: { email: email },
      select: { id: true, role: true },
    });

    if (user == null) {
      const newUser = await tx.user.create({
        data: {
          email,
          name,
        },
        select: {
          id: true,
          role: true,
        },
      });
      user = newUser;
    }

    await tx.userOAuthAccount.create({
      data: {
        provider,
        userId: user.id,
        providerAccountId: id,
      },
    });

    return user;
  });
}
