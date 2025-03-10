import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  name: string;
  otp: string;
}

export default function VerificationEmail({
  name,
  otp,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Vérifiez votre adresse email</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Vérifiez votre adresse email</Heading>
          <Text style={text}>Bonjour {name},</Text>
          <Text style={text}>
            Merci de vous être inscrit. Veuillez utiliser le code suivant pour
            vérifier votre adresse email:
          </Text>
          <Section style={codeContainer}>
            <Text style={code}>{otp}</Text>
          </Section>
          <Text style={text}>
            Ce code expirera dans 15 minutes. Si vous n'avez pas demandé ce
            code, vous pouvez ignorer cet email.
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

const codeContainer = {
  background: "#f4f4f4",
  borderRadius: "4px",
  margin: "16px 0",
  padding: "16px",
  textAlign: "center" as const,
};

const code = {
  color: "#333",
  display: "inline-block",
  fontFamily: "monospace",
  fontSize: "32px",
  fontWeight: "bold",
  letterSpacing: "8px",
  margin: "0",
};
