"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import {
  AdminEmpty,
  AdminError,
  AdminPagination,
} from "@/components/admin/AdminPageState";
import { hideAdminRecipe, listAdminRecipes } from "@/lib/api/admin";
import { Toast } from "@/components/ui/Toast";
import type {
  AdminRecipe,
  RecipeSource,
  RecipeStatus,
} from "@/lib/types/admin";
import type { PaginationMeta } from "@/lib/types/api";

export function AdminRecipeList() {
  const [items, setItems] = useState<AdminRecipe[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<RecipeStatus | "">("");
  const [source, setSource] = useState<RecipeSource | "">("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const message = sessionStorage.getItem("admin-recipe-toast");
    if (!message) return;
    sessionStorage.removeItem("admin-recipe-toast");
    const showTimeout = window.setTimeout(() => setToast(message), 0);
    const hideTimeout = window.setTimeout(() => setToast(null), 3500);
    return () => {
      window.clearTimeout(showTimeout);
      window.clearTimeout(hideTimeout);
    };
  }, []);

  const fetchRecipes = useCallback(() => {
    return listAdminRecipes({
      page,
      ...(source ? { source } : {}),
      ...(status ? { status } : {}),
    });
  }, [page, source, status]);

  const load = useCallback(async () => {
    try {
      const result = await fetchRecipes();
      setItems(result.items);
      setMeta(result.meta);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [fetchRecipes]);

  useEffect(() => {
    let cancelled = false;
    void fetchRecipes()
      .then((result) => {
        if (!cancelled) {
          setItems(result.items);
          setMeta(result.meta);
        }
      })
      .catch((requestError: unknown) => {
        if (!cancelled) setError(getErrorMessage(requestError));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchRecipes]);

  async function hideRecipe(recipe: AdminRecipe) {
    if (!window.confirm(`Ẩn công thức “${recipe.title}”?`)) {
      return;
    }

    setBusyId(recipe.id);
    setError(null);
    try {
      await hideAdminRecipe(recipe.id);
      await load();
      setToast("Ẩn công thức thành công.");
      window.setTimeout(() => setToast(null), 3500);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Công thức</h2>
          <p className="mt-1 text-sm text-charcoal/60">
            Tạo, chỉnh sửa, xuất bản hoặc ẩn công thức.
          </p>
        </div>
        <Link
          href="/admin/cong-thuc/moi"
          className="rounded-xl bg-terracotta px-5 py-3 font-semibold text-white"
        >
          Thêm công thức
        </Link>
      </div>

      <div className="mt-5 flex flex-wrap gap-3 rounded-2xl bg-white p-4">
        <FilterSelect
          label="Trạng thái"
          value={status}
          onChange={(value) => {
            setStatus(value as RecipeStatus | "");
            setPage(1);
          }}
          options={[
            ["", "Tất cả trạng thái"],
            ["DRAFT", "Bản nháp"],
            ["PUBLISHED", "Đã xuất bản"],
            ["HIDDEN", "Đã ẩn"],
          ]}
        />
        <FilterSelect
          label="Nguồn"
          value={source}
          onChange={(value) => {
            setSource(value as RecipeSource | "");
            setPage(1);
          }}
          options={[
            ["", "Tất cả nguồn"],
            ["ADMIN", "Quản trị viên"],
            ["SEED", "Dữ liệu gốc"],
            ["GEMINI", "Gemini"],
          ]}
        />
      </div>

      {error ? <div className="mt-4"><AdminError message={error} /></div> : null}

      <div className="mt-5 overflow-hidden rounded-3xl border border-terracotta/15 bg-white">
        {loading ? (
          <div className="p-8 text-center text-charcoal/55">Đang tải...</div>
        ) : items.length === 0 ? (
          <AdminEmpty title="Không có công thức phù hợp." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-charcoal/[0.04] text-charcoal/60">
                <tr>
                  <th className="px-5 py-4 font-semibold">Công thức</th>
                  <th className="px-5 py-4 font-semibold">Danh mục</th>
                  <th className="px-5 py-4 font-semibold">Nguồn</th>
                  <th className="px-5 py-4 font-semibold">Trạng thái</th>
                  <th className="px-5 py-4 font-semibold">Cập nhật</th>
                  <th className="px-5 py-4 text-right font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-terracotta/10">
                {items.map((recipe) => (
                  <tr key={recipe.id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold">{recipe.title}</p>
                      <p className="mt-1 text-xs text-charcoal/50">{recipe.slug}</p>
                    </td>
                    <td className="px-5 py-4">{recipe.category.name}</td>
                    <td className="px-5 py-4">{sourceLabel(recipe.source)}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={recipe.status} />
                    </td>
                    <td className="px-5 py-4">
                      {formatDate(recipe.updatedAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/cong-thuc/${recipe.id}`}
                          className="rounded-lg border border-terracotta/25 px-3 py-2 font-semibold text-terracotta"
                        >
                          Xem
                        </Link>
                        <Link
                          href={`/admin/cong-thuc/${recipe.id}/chinh-sua`}
                          className="rounded-lg border border-mustard/40 px-3 py-2 font-semibold text-charcoal"
                        >
                          Sửa
                        </Link>
                        {recipe.status !== "HIDDEN" ? (
                          <button
                            type="button"
                            disabled={busyId === recipe.id}
                            onClick={() => void hideRecipe(recipe)}
                            className="rounded-lg border border-red-200 px-3 py-2 font-semibold text-red-600 disabled:opacity-50"
                          >
                            Ẩn
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {meta ? (
        <AdminPagination
          page={meta.page}
          totalPages={meta.totalPages}
          onPageChange={setPage}
        />
      ) : null}
      {toast ? <Toast message={toast} /> : null}
    </section>
  );
}

function FilterSelect({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: ReadonlyArray<readonly [string, string]>;
  value: string;
}) {
  return (
    <label className="text-sm font-medium">
      <span className="mr-2 text-charcoal/60">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border border-terracotta/20 bg-white px-3 py-2 outline-none focus:border-terracotta"
      >
        {options.map(([optionValue, text]) => (
          <option key={optionValue} value={optionValue}>{text}</option>
        ))}
      </select>
    </label>
  );
}

function StatusBadge({ status }: { status: RecipeStatus }) {
  const labels = {
    DRAFT: "Bản nháp",
    HIDDEN: "Đã ẩn",
    PUBLISHED: "Đã xuất bản",
  };
  const colors = {
    DRAFT: "bg-mustard/20 text-charcoal",
    HIDDEN: "bg-charcoal/10 text-charcoal/70",
    PUBLISHED: "bg-sage/25 text-charcoal",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${colors[status]}`}>
      {labels[status]}
    </span>
  );
}

function sourceLabel(source: RecipeSource) {
  return { ADMIN: "Quản trị", GEMINI: "Gemini", SEED: "Dữ liệu gốc" }[source];
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Không thể tải công thức.";
}
