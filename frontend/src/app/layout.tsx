import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/context/auth-context";
import { OfflineBanner } from "@/components/common/OfflineBanner";
import { Toaster } from "@/components/ui/Toaster";

export const metadata: Metadata = {
  title: {
    default: "FR Inmobiliaria | Tu Inmobiliaria de Confianza en Andújar y Córdoba",
    template: "%s | FR Inmobiliaria"
  },
  description: "Expertos en gestión inmobiliaria. Encuentra pisos, casas y locales en venta o alquiler en Andújar y Córdoba con el mejor servicio personalizado.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://frinmobiliaria.es",
    siteName: "FR Inmobiliaria",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "FR Inmobiliaria"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "FR Inmobiliaria",
    description: "Expertos en gestión inmobiliaria en Andújar y Córdoba.",
    images: ["/og-image.png"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="fr-theme"
        >
          <AuthProvider>
            <OfflineBanner />
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
