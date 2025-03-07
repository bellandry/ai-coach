import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_BASE_URL ?? "https://ai-coach.laclass.dev";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Ai-Coach | Votre allié intelligent pour booster votre carrière",
  description:
    "Ai-Coach évalue vos CV, vous assiste dans la rédaction de vos lettres de motivation, et préparer des entretiens d'embauche.",
  keywords:
    "Evaluation de CV, rédaction de lettres de motivation, préparation d'entretiens, IA, Landry Bella, développeur fullstack, TypeScript, Laclass dev",
  authors: {
    name: "Landry Bella",
    url: "https://laclass.dev",
  },
  openGraph: {
    title: "Ai-Coach | Votre allié intelligent pour booster votre carrière",
    description:
      "Ai-Coach évalue vos CV, vous assiste dans la rédaction de vos lettres de motivation, et préparer des entretiens d'embauche.",
    type: "website",
    locale: "fr_FR",
    url: baseUrl,
    siteName: "Ai-Coach",
    images: [
      {
        url: "/og-image.png",
        width: 256,
        height: 256,
        alt: "image bannière Ai-Coach",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
