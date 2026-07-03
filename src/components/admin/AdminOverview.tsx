"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AdminError } from "@/components/admin/AdminPageState";
import {
  listAdminAuditLogs,
  listAdminRecipes,
  listAdminUsers,
} from "@/lib/api/admin";

interface OverviewData {
  auditLogs: number;
  pendingRecipes: number;
  recipes: number;
  users: number;
}

export function AdminOverview() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void Promise.all([
      listAdminRecipes({ limit: 1 }),
      listAdminRecipes({ limit: 1, moderationStatus: "PENDING" }),
      listAdminUsers({ limit: 1 }),
      listAdminAuditLogs({ limit: 1 }),
    ])
      .then(([recipes, pending, users, logs]) => {
        if (!cancelled) {
          setData({
            auditLogs: logs.meta.total,
            pendingRecipes: pending.meta.total,
            recipes: recipes.meta.total,
            users: users.meta.total,
          });
        }
      })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          setError(getErrorMessage(requestError));
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <AdminError message={error} />;
  }

  if (!data) {
    return <OverviewSkeleton />;
  }

  const cards = [
    {
      href: "/admin/cong-thuc",
      label: "Tổng công thức",
      value: data.recipes,
    },
    {
      href: "/admin/kiem-duyet",
      label: "Chờ kiểm duyệt",
      value: data.pendingRecipes,
    },
    {
      href: "/admin/tai-khoan",
      label: "Tài khoản",
      value: data.users,
    },
    {
      href: "/admin/nhat-ky",
      label: "Bản ghi thao tác",
      value: data.auditLogs,
    },
  ];

  return (
    <section>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-3xl border border-terracotta/15 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-warm"
          >
            <p className="text-sm font-medium text-charcoal/60">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-charcoal">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 rounded-3xl bg-charcoal p-7 text-white">
        <h2 className="text-xl font-bold">Công việc ưu tiên</h2>
        <p className="mt-2 text-white/70">
          Có {data.pendingRecipes} công thức Gemini đang chờ quyết định.
        </p>
        <Link
          href="/admin/kiem-duyet"
          className="mt-5 inline-flex rounded-xl bg-white px-5 py-3 font-semibold text-charcoal"
        >
          Mở hàng chờ kiểm duyệt
        </Link>
      </div>
    </section>
  );
}

function OverviewSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Đang tải">
      {[0, 1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-32 animate-pulse rounded-3xl bg-terracotta/10"
        />
      ))}
    </div>
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Không thể tải dữ liệu quản trị.";
}
