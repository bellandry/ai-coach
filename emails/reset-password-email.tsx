import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  name: string;
  resetUrl: string;
}

export default function ResetPasswordEmail({
  name,
  resetUrl,
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Réinitialisation de votre mot de passe</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Réinitialisation de mot de passe</Heading>
          <Text style={text}>Bonjour {name},</Text>
          <Text style={text}>
            Vous avez demandé la réinitialisation de votre mot de passe. Cliquez
            sur le bouton ci-dessous pour créer un nouveau mot de passe:
          </Text>
          <Section style={buttonContainer}>
            <Button style={{ ...button, padding: "20px 12px" }} href={resetUrl}>
              Réinitialiser mon mot de passe
            </Button>
          </Section>
          <Text style={text}>
            Ce lien expirera dans 1 heure. Si vous n'avez pas demandé cette
            réinitialisation, vous pouvez ignorer cet email.
          </Text>
          <Text style={text}>Merci,</Text>
          <Text style={text}>L'équipe AI-Coach</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px",
  maxWidth: "600px",
  borderRadius: "4px",
  border: "1px solid #eee",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "30px 0",
  padding: "0",
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const button = {
  backgroundColor: "#000",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "14px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
};
