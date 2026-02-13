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
  title: "FR Inmobiliaria - Gestión Inmobiliaria",
  description: "Portal de gestión y escaparate de FR Inmobiliaria",
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
