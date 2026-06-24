"use client";

import type { ReactNode } from "react";

import { AuthProvider } from "@/lib/auth/AuthProvider";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
