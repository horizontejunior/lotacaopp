// No arquivo SessionLayout.tsx (Client Component)
"use client";  // Aqui é necessário para indicar que esse é um Client Component

import { SessionProvider } from "next-auth/react";

export default function SessionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
