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
    <html lang="en" suppressHydrationWarning>
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
