import { db } from "@/lib/db";
import { redisClient } from "@/redis/redis";
import { z } from "zod";

// Seven days in seconds
const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7;
const COOKIE_SESSION_KEY = "session-id";

const sessionSchema = z.object({
  id: z.string(),
  role: z.enum(["ADMIN", "USER"] as const),
});

type UserSession = z.infer<typeof sessionSchema>;
export type Cookies = {
  set: (
    key: string,
    value: string,
    options: {
      secure?: boolean;
      httpOnly?: boolean;
      sameSite?: "strict" | "lax";
      expires?: number;
    }
  ) => void;
  get: (key: string) => { name: string; value: string } | undefined;
  delete: (key: string) => void;
};

export function getUserFromSession(cookies: Pick<Cookies, "get">) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;

  return getUserSessionById(sessionId);
}

export async function updateUserSessionData(
  user: UserSession,
  cookies: Pick<Cookies, "get">
) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;

  await redisClient.set(`session:${sessionId}`, sessionSchema.parse(user), {
    ex: SESSION_EXPIRATION_SECONDS,
  });
}

export async function createUserSession(
  user: UserSession,
  cookies: Pick<Cookies, "set">
) {
  const sessionId = await generateSecureToken();

  await redisClient.set(`session:${sessionId}`, sessionSchema.parse(user), {
    ex: SESSION_EXPIRATION_SECONDS,
  });

  setCookie(sessionId, cookies);
}

export async function updateUserSessionExpiration(
  cookies: Pick<Cookies, "get" | "set">
) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;

  const user = await getUserSessionById(sessionId);
  if (user == null) return;

  await redisClient.set(`session:${sessionId}`, user, {
    ex: SESSION_EXPIRATION_SECONDS,
  });
  setCookie(sessionId, cookies);
}

export async function removeUserFromSession(
  cookies: Pick<Cookies, "get" | "delete">
) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;

  await redisClient.del(`session:${sessionId}`);
  cookies.delete(COOKIE_SESSION_KEY);
}

function setCookie(sessionId: string, cookies: Pick<Cookies, "set">) {
  cookies.set(COOKIE_SESSION_KEY, sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000,
  });
}

async function getUserSessionById(sessionId: string) {
  const rawUser = await redisClient.get(`session:${sessionId}`);

  const { success, data: user } = sessionSchema.safeParse(rawUser);

  return success ? user : null;
}

// Fonction utilitaire pour générer un token hexadécimal compatible Edge
async function generateSecureToken(length = 32): Promise<string> {
  const buffer = new Uint8Array(length);
  // Utilisation de l'API Web Crypto au lieu de Node.js crypto
  crypto.getRandomValues(buffer);
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createTempSession(userId: string): Promise<string> {
  // Générer un token temporaire pour la session 2FA
  const token = await generateSecureToken();

  // Stocker le token temporaire dans la base de données
  await db.tempSession.create({
    data: {
      token,
      userId,
      expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    },
  });

  return token;
}

export async function getUserIdFromTempSession(
  token: string
): Promise<string | null> {
  const session = await db.tempSession.findUnique({
    where: { token },
  });

  if (!session || session.expires < new Date()) {
    // Session expirée ou invalide
    return null;
  }

  return session.userId;
}

// Ajouter cette fonction pour créer une session complète
export async function createSession(userId: string): Promise<string> {
  // Similaire à createUserSession mais retourne juste le token
  const token = await generateSecureToken();

  // Stocker le token dans la base de données
  await db.session.create({
    data: {
      token,
      userId,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
    },
  });

  return token;
}

// Ajouter cette fonction pour récupérer les sessions actives
export async function getActiveSessions(): Promise<UserSession[]> {
  const sessions = await db.session.findMany();
  const activeUsers: UserSession[] = [];

  for (const session of sessions) {
    const userSession = await getUserSessionById(session.token);
    if (userSession) {
      activeUsers.push(userSession);
    }
  }

  return activeUsers;
}
