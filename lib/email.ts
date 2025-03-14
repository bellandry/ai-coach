import MagicLinkEmail from "@/emails/magic-link-email";
import ResetPasswordEmail from "@/emails/reset-password-email";
import VerificationEmail from "@/emails/verification-email";
import { render } from "@react-email/render";
import { createTransport } from "nodemailer";

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function sendVerificationEmail({
  to,
  name,
  otp,
}: {
  to: string;
  name: string;
  otp: string;
}) {
  const html = await render(
    VerificationEmail({
      name,
      otp,
    })
  );

  const options = {
    from: `"AI Coach" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Vérifiez votre adresse email",
    html,
  };
  console.log("voici le otp du mail ", otp);

  return transporter.sendMail(options);
}

const baseUrl = process.env.NEXT_BASE_URL ?? "https://ai-coach.laclass.dev";

export async function sendPasswordResetEmail({
  to,
  name,
  resetToken,
}: {
  to: string;
  name: string;
  resetToken: string;
}) {
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

  const html = await render(
    ResetPasswordEmail({
      name,
      resetUrl,
    })
  );

  const options = {
    from: `"AI Coach" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Réinitialisation de votre mot de passe",
    html,
  };

  return transporter.sendMail(options);
}

export async function sendMagicLinkEmail({
  to,
  name,
  magicLinkToken,
}: {
  to: string;
  name: string;
  magicLinkToken: string;
}) {
  const magicLinkUrl = `${baseUrl}/magic-link?token=${magicLinkToken}`;

  const html = await render(
    MagicLinkEmail({
      name,
      magicLinkUrl,
    })
  );

  const options = {
    from: `"AI Coach" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Connexion à AI Coach",
    html,
  };

  return transporter.sendMail(options);
}

// Fonction de test pour vérifier la configuration des emails
export async function testEmailConfiguration() {
  try {
    await sendVerificationEmail({
      to: process.env.GMAIL_USER!, // Envoi à vous-même pour tester
      name: "Test User",
      otp: "123456",
    });
    return { success: true, message: "Email envoyé avec succès" };
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de test:", error);
    return {
      success: false,
      message: "Échec de l'envoi de l'email",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
