import { env } from "@/data/env/server";
import { z } from "zod";
import { OAuthClient } from "./base";

export function createGoogleOAuthClient() {
  return new OAuthClient({
    provider: "google",
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    scopes: ["openid", "profile", "email"],
    urls: {
      auth: "https://accounts.google.com/o/oauth2/auth",
      token: "https://oauth2.googleapis.com/token",
      user: "https://www.googleapis.com/oauth2/v2/userinfo",
    },
    userInfo: {
      schema: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string().email(),
        picture: z.string().url().optional(),
      }),
      parser: (user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
      }),
    },
  });
}
