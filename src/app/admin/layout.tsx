import type { ReactNode } from "react";

import { AdminGate } from "@/components/admin/AdminGate";
import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#fff8ec] px-4 py-8 sm:px-6">
      <AdminGate>
        <div className="mx-auto max-w-7xl">
          <header className="mb-6">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-terracotta">
              Ăn Gì Giờ?
            </p>
            <h1 className="mt-1 text-3xl font-bold text-charcoal">
              Admin Dashboard
            </h1>
          </header>
          <AdminNav />
          <div className="mt-6">{children}</div>
        </div>
      </AdminGate>
    </div>
  );
}
