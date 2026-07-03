"use client";

import { useCallback, useEffect, useState } from "react";

import {
  AdminEmpty,
  AdminError,
  AdminPagination,
} from "@/components/admin/AdminPageState";
import {
  listAdminUsers,
  updateAdminUserStatus,
} from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/AuthProvider";
import type { AdminUser } from "@/lib/types/admin";
import type { PaginationMeta } from "@/lib/types/api";
import type { UserRole, UserStatus } from "@/lib/types/auth";

export function AdminUserList() {
  const { user: currentUser } = useAuth();
  const [items, setItems] = useState<AdminUser[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [role, setRole] = useState<UserRole | "">("");
  const [status, setStatus] = useState<UserStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(() => {
    return listAdminUsers({
      page,
      ...(role ? { role } : {}),
      ...(status ? { status } : {}),
    });
  }, [page, role, status]);

  useEffect(() => {
    let cancelled = false;
    void fetchUsers()
      .then((result) => {
        if (!cancelled) {
          setItems(result.items);
          setMeta(result.meta);
        }
      })
      .catch((requestError: unknown) => {
        if (!cancelled) setError(messageOf(requestError));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchUsers]);

  async function toggleStatus(target: AdminUser) {
    const nextStatus = target.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    const action = nextStatus === "ACTIVE" ? "mở khóa" : "tạm khóa";
    if (!window.confirm(`${action} tài khoản ${target.email}?`)) return;

    setBusyId(target.id);
    setError(null);
    try {
      const updated = await updateAdminUserStatus(target.id, nextStatus);
      setItems((current) =>
        current.map((item) => item.id === updated.id ? updated : item),
      );
    } catch (requestError) {
      setError(messageOf(requestError));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section>
      <h2 className="text-2xl font-bold">Tài khoản</h2>
      <p className="mt-1 text-sm text-charcoal/60">
        Xem vai trò và tạm khóa hoặc mở lại tài khoản người dùng.
      </p>
      <div className="mt-5 flex flex-wrap gap-3 rounded-2xl bg-white p-4">
        <select value={role} onChange={(event) => { setRole(event.target.value as UserRole | ""); setPage(1); }}
          aria-label="Lọc theo vai trò" className={selectClass}>
          <option value="">Tất cả vai trò</option>
          <option value="USER">Người dùng</option>
          <option value="ADMIN">Quản trị viên</option>
        </select>
        <select value={status} onChange={(event) => { setStatus(event.target.value as UserStatus | ""); setPage(1); }}
          aria-label="Lọc theo trạng thái" className={selectClass}>
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVE">Đang hoạt động</option>
          <option value="SUSPENDED">Tạm khóa</option>
        </select>
      </div>
      {error ? <div className="mt-4"><AdminError message={error} /></div> : null}

      <div className="mt-5 overflow-hidden rounded-3xl border border-terracotta/15 bg-white">
        {loading ? (
          <div className="p-8 text-center text-charcoal/55">Đang tải...</div>
        ) : items.length === 0 ? (
          <AdminEmpty title="Không có tài khoản phù hợp." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-charcoal/[0.04] text-charcoal/60">
                <tr>
                  <th className="px-5 py-4">Tài khoản</th>
                  <th className="px-5 py-4">Vai trò</th>
                  <th className="px-5 py-4">Đăng nhập</th>
                  <th className="px-5 py-4">Trạng thái</th>
                  <th className="px-5 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-terracotta/10">
                {items.map((account) => (
                  <tr key={account.id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold">{account.displayName}</p>
                      <p className="mt-1 text-xs text-charcoal/50">{account.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      {account.role === "ADMIN" ? "Quản trị viên" : "Người dùng"}
                    </td>
                    <td className="px-5 py-4">
                      {account.provider === "GOOGLE" ? "Google" : "Mật khẩu"}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        account.status === "ACTIVE"
                          ? "bg-sage/15 text-charcoal"
                          : "bg-red-50 text-red-700"
                      }`}>
                        {account.status === "ACTIVE" ? "Hoạt động" : "Tạm khóa"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        disabled={busyId === account.id || currentUser?.id === account.id}
                        title={currentUser?.id === account.id ? "Không thể tự khóa tài khoản" : undefined}
                        onClick={() => void toggleStatus(account)}
                        className="rounded-lg border border-terracotta/25 px-3 py-2 font-semibold text-terracotta disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {account.status === "ACTIVE" ? "Tạm khóa" : "Mở khóa"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {meta ? <AdminPagination page={meta.page} totalPages={meta.totalPages} onPageChange={setPage} /> : null}
    </section>
  );
}

const selectClass =
  "rounded-xl border border-terracotta/20 bg-white px-3 py-2 text-sm outline-none focus:border-terracotta";

function messageOf(error: unknown) {
  return error instanceof Error ? error.message : "Không thể tải tài khoản.";
}
