import { authenticator } from "otplib";

export function generateSecret() {
  return authenticator.generateSecret();
}

export function verifyToken({
  token,
  secret,
}: {
  token: string;
  secret: string;
}) {
  try {
    return authenticator.verify({ token, secret });
  } catch (error) {
    console.error("Erreur lors de la vérification du token TOTP:", error);
    return false;
  }
}

export function generateToken(secret: string) {
  return authenticator.generate(secret);
}
