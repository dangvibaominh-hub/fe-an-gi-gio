"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { PhuBepWidget } from "@/components/phu-bep/PhuBepWidget";
import { Navbar } from "@/components/layout/Navbar";
import { PostCookingToast } from "@/components/layout/PostCookingToast";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isCookingMode = /\/nau$/.test(pathname);

  if (isCookingMode) {
    return (
      <>
        {children}
        <PostCookingToast key={pathname} />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col pt-20">{children}</main>
      <PostCookingToast key={pathname} />
      <PhuBepWidget />
    </>
  );
}
