import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FRACTALMA — Despertar · Liberar · Reconectar",
  description:
    "Acompañamiento profundo para comprender y transformar los patrones que se repiten en tu vida. No gestionas lo que sientes. Lo atraviesas.",
  keywords: [
    "patrones repetitivos",
    "bloqueo emocional",
    "autoconocimiento",
    "acompañamiento personal",
    "transformación personal",
    "breathwork",
    "integración emocional",
    "desarrollo personal",
    "inconsciente",
    "reprogramación consciente",
  ],
  authors: [{ name: "FRACTALMA" }],
  openGraph: {
    title: "FRACTALMA — Despertar · Liberar · Reconectar",
    description:
      "Si se repite, no es casualidad. Es información. Un proceso de acompañamiento profundo para transformar desde la raíz los patrones que no cambian.",
    type: "website",
    locale: "es_ES",
    siteName: "FRACTALMA",
  },
  twitter: {
    card: "summary_large_image",
    title: "FRACTALMA — Despertar · Liberar · Reconectar",
    description:
      "Si se repite, no es casualidad. Es información. Acompañamiento profundo para transformar los patrones que se repiten en tu vida.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
