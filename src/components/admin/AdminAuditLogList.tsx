"use client";

import { useCallback, useEffect, useState } from "react";

import {
  AdminEmpty,
  AdminError,
  AdminPagination,
} from "@/components/admin/AdminPageState";
import { listAdminAuditLogs } from "@/lib/api/admin";
import type { AdminAuditLog } from "@/lib/types/admin";
import type { PaginationMeta } from "@/lib/types/api";

const actionLabels: Record<string, string> = {
  RECIPE_APPROVED: "Duyệt công thức",
  RECIPE_CREATED: "Tạo công thức",
  RECIPE_HIDDEN: "Ẩn công thức",
  RECIPE_REJECTED: "Từ chối công thức",
  RECIPE_UPDATED: "Cập nhật công thức",
  USER_STATUS_UPDATED: "Cập nhật tài khoản",
};

export function AdminAuditLogList() {
  const [items, setItems] = useState<AdminAuditLog[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [entityType, setEntityType] = useState<"recipe" | "user" | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(() => {
    return listAdminAuditLogs({
      page,
      ...(entityType ? { entityType } : {}),
    });
  }, [entityType, page]);

  useEffect(() => {
    let cancelled = false;
    void fetchLogs()
      .then((result) => {
        if (!cancelled) {
          setItems(result.items);
          setMeta(result.meta);
        }
      })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Không thể tải nhật ký.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchLogs]);

  return (
    <section>
      <h2 className="text-2xl font-bold">Nhật ký quản trị</h2>
      <p className="mt-1 text-sm text-charcoal/60">
        Theo dõi các thay đổi quan trọng đối với công thức và tài khoản.
      </p>
      <div className="mt-5 rounded-2xl bg-white p-4">
        <select
          value={entityType}
          onChange={(event) => {
            setEntityType(event.target.value as typeof entityType);
            setPage(1);
          }}
          aria-label="Lọc loại đối tượng"
          className="rounded-xl border border-terracotta/20 bg-white px-3 py-2 text-sm"
        >
          <option value="">Tất cả đối tượng</option>
          <option value="recipe">Công thức</option>
          <option value="user">Tài khoản</option>
        </select>
      </div>
      {error ? <div className="mt-4"><AdminError message={error} /></div> : null}

      <div className="mt-5 overflow-hidden rounded-3xl border border-terracotta/15 bg-white">
        {loading ? (
          <div className="p-8 text-center text-charcoal/55">Đang tải...</div>
        ) : items.length === 0 ? (
          <AdminEmpty title="Chưa có bản ghi nhật ký." />
        ) : (
          <ul className="divide-y divide-terracotta/10">
            {items.map((log) => (
              <li key={log.id} className="grid gap-3 px-5 py-4 md:grid-cols-[1fr_1fr_1.5fr] md:items-center">
                <div>
                  <p className="font-semibold">{actionLabels[log.action] ?? log.action}</p>
                  <p className="mt-1 text-xs text-charcoal/50">
                    {formatDate(log.createdAt)}
                  </p>
                </div>
                <div className="text-sm text-charcoal/65">
                  <p>{log.entityType === "recipe" ? "Công thức" : "Tài khoản"}</p>
                  <p className="mt-1 break-all text-xs">{log.entityId ?? "—"}</p>
                </div>
                <details className="text-sm">
                  <summary className="cursor-pointer font-semibold text-terracotta">
                    Chi tiết thay đổi
                  </summary>
                  <pre className="mt-2 max-h-48 overflow-auto rounded-xl bg-charcoal p-3 text-xs text-white">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </details>
              </li>
            ))}
          </ul>
        )}
      </div>
      {meta ? <AdminPagination page={meta.page} totalPages={meta.totalPages} onPageChange={setPage} /> : null}
    </section>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
