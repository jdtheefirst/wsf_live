// app/layout.tsx
import "./globals.css";
import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { SuggestionDialog } from "@/components/suggestion-dialog";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "World Samma Federation - Live Training Portal",
  description:
    "Stream live Samma events and training sessions, connecting martial artists worldwide through the World Samma Federation.",
  keywords:
    "Samma, martial arts, live training, WSF, World Samma Federation, streaming",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Basic favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />

        {/* Modern browsers */}
        <link
          rel="icon"
          href="/favicon-32x32.png"
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="icon"
          href="/favicon-16x16.png"
          type="image/png"
          sizes="16x16"
        />

        {/* Apple Touch Icon */}
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          type="image/png"
          sizes="180x180"
        />

        {/* Android Chrome */}
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
          <SuggestionDialog />
        </AuthProvider>
      </body>
    </html>
  );
}
