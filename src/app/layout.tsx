import SessionLayout from "./SessionLayout";
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

export const metadata: Metadata = {
  title: "Intenção de vaga PPSC 2025",
  description: "Desenvolvido para auxiliar a escolha das vagas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Envolva o children com o SessionProvider */}
        
        <SessionLayout>{children}</SessionLayout> {/* Envolva com o SessionProvider */}
        
      </body>
    </html>
  );
}
