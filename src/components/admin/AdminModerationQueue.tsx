"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import {
  AdminEmpty,
  AdminError,
  AdminPagination,
} from "@/components/admin/AdminPageState";
import {
  listAdminRecipes,
  moderateAdminRecipe,
} from "@/lib/api/admin";
import type { AdminRecipe } from "@/lib/types/admin";
import type { PaginationMeta } from "@/lib/types/api";

export function AdminModerationQueue() {
  const [items, setItems] = useState<AdminRecipe[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = useCallback(() => {
    return listAdminRecipes({
      moderationStatus: "PENDING",
      page,
      source: "GEMINI",
    });
  }, [page]);

  const load = useCallback(async () => {
    try {
      const result = await fetchRecipes();
      setItems(result.items);
      setMeta(result.meta);
    } catch (requestError) {
      setError(messageOf(requestError));
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
        if (!cancelled) setError(messageOf(requestError));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchRecipes]);

  async function decide(recipe: AdminRecipe, approved: boolean) {
    const action = approved ? "duyệt" : "từ chối";
    if (!window.confirm(`${action[0]?.toLocaleUpperCase("vi")}${action.slice(1)} “${recipe.title}”?`)) {
      return;
    }

    setBusyId(recipe.id);
    setError(null);
    try {
      await moderateAdminRecipe(
        recipe.id,
        approved ? "APPROVED" : "REJECTED",
      );
      await load();
    } catch (requestError) {
      setError(messageOf(requestError));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section>
      <h2 className="text-2xl font-bold">Hàng chờ kiểm duyệt AI</h2>
      <p className="mt-1 text-sm text-charcoal/60">
        Kiểm tra công thức do Gemini tạo trước khi xuất hiện trong catalog.
      </p>
      {error ? <div className="mt-5"><AdminError message={error} /></div> : null}

      <div className="mt-5 space-y-4">
        {loading ? (
          <div className="py-12 text-center text-charcoal/55">Đang tải...</div>
        ) : items.length === 0 ? (
          <AdminEmpty title="Không có công thức nào đang chờ duyệt." />
        ) : (
          items.map((recipe) => (
            <article
              key={recipe.id}
              className="rounded-3xl border border-terracotta/15 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-col justify-between gap-5 lg:flex-row">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-mustard/15 px-3 py-1 text-xs font-bold text-charcoal">
                      Gemini
                    </span>
                    <span className="text-xs text-charcoal/50">
                      {recipe.aiModel ?? "Không rõ model"}
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-bold">{recipe.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-charcoal/65">
                    {recipe.description}
                  </p>
                  <p className="mt-3 text-sm text-charcoal/55">
                    {recipe.category.name} · {recipe.cookTimeMinutes} phút ·{" "}
                    {recipe.baseServings} phần
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-start gap-2">
                  <Link
                    href={`/admin/cong-thuc/${recipe.id}`}
                    className="rounded-xl border border-terracotta/25 px-4 py-2.5 font-semibold text-terracotta"
                  >
                    Xem và sửa
                  </Link>
                  <button
                    type="button"
                    disabled={busyId === recipe.id}
                    onClick={() => void decide(recipe, false)}
                    className="rounded-xl border border-red-200 px-4 py-2.5 font-semibold text-red-600 disabled:opacity-50"
                  >
                    Từ chối
                  </button>
                  <button
                    type="button"
                    disabled={busyId === recipe.id}
                    onClick={() => void decide(recipe, true)}
                    className="rounded-xl bg-sage px-4 py-2.5 font-semibold text-white disabled:opacity-50"
                  >
                    Duyệt
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {meta ? (
        <AdminPagination
          page={meta.page}
          totalPages={meta.totalPages}
          onPageChange={setPage}
        />
      ) : null}
    </section>
  );
}

function messageOf(error: unknown) {
  return error instanceof Error ? error.message : "Không thể tải hàng chờ.";
}
