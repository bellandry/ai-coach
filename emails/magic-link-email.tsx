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

interface MagicLinkEmailProps {
  name: string;
  magicLinkUrl: string;
}

export default function MagicLinkEmail({
  name,
  magicLinkUrl,
}: MagicLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Connexion à AI Coach</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Connexion à AI Coach</Heading>
          <Text style={text}>Bonjour {name},</Text>
          <Text style={text}>
            Cliquez sur le bouton ci-dessous pour vous connecter à votre compte
            AI Coach. Aucun mot de passe n&apos;est nécessaire.
          </Text>
          <Section style={buttonContainer}>
            <Button
              style={{ ...button, padding: "20px 12px" }}
              href={magicLinkUrl}
            >
              Se connecter
            </Button>
          </Section>
          <Text style={text}>
            Ce lien expirera dans 15 minutes. Si vous n&apos;avez pas demandé
            cette connexion, vous pouvez ignorer cet email.
          </Text>
          <Text style={text}>Merci,</Text>
          <Text style={text}>L&apos;équipe AI-Coach</Text>
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
