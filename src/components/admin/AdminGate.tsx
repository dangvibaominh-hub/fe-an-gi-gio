"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { LoadingState } from "@/components/ui/LoadingState";
import { useAuth } from "@/lib/auth/AuthProvider";

export function AdminGate({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitializing, openAuthModal, user } = useAuth();

  if (isInitializing) {
    return <LoadingState message="Đang xác minh quyền quản trị..." />;
  }

  if (!isAuthenticated) {
    return (
      <AccessCard
        title="Bạn cần đăng nhập"
        description="Khu vực quản trị chỉ dành cho tài khoản quản trị viên."
      >
        <button
          type="button"
          onClick={openAuthModal}
          className="rounded-xl bg-terracotta px-5 py-3 font-semibold text-white transition hover:brightness-105"
        >
          Đăng nhập
        </button>
      </AccessCard>
    );
  }

  if (user?.role !== "ADMIN") {
    return (
      <AccessCard
        title="Không có quyền truy cập"
        description="Tài khoản hiện tại không có vai trò quản trị viên."
      >
        <Link
          href="/"
          className="inline-flex rounded-xl border border-terracotta/30 px-5 py-3 font-semibold text-terracotta"
        >
          Về trang chủ
        </Link>
      </AccessCard>
    );
  }

  return children;
}

function AccessCard({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <section className="mx-auto max-w-xl rounded-3xl border border-terracotta/15 bg-white p-8 text-center shadow-warm">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-terracotta">
        Quản trị
      </p>
      <h1 className="mt-3 text-2xl font-bold text-charcoal">{title}</h1>
      <p className="mt-3 text-charcoal/65">{description}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}
