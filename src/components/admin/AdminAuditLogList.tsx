"use client";

import { useCallback, useEffect, useState } from "react";
import { EyeOff, Pencil, Plus, type LucideIcon } from "lucide-react";

import {
  AdminEmpty,
  AdminError,
  AdminPagination,
} from "@/components/admin/AdminPageState";
import { getAdminRecipe, listAdminAuditLogs } from "@/lib/api/admin";
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

const recipeFieldLabels: Record<string, string> = {
  baseServings: "Khẩu phần",
  categorySlug: "Danh mục",
  cookTimeMinutes: "Thời gian nấu",
  description: "Mô tả",
  difficulty: "Độ khó",
  image: "Ảnh",
  imageAlt: "Mô tả ảnh",
  ingredients: "Nguyên liệu",
  moderationStatus: "Trạng thái kiểm duyệt",
  slug: "Slug",
  status: "Trạng thái",
  steps: "Các bước nấu",
  title: "Tên công thức",
};

type ActionIndicator = {
  Icon: LucideIcon;
  nodeClassName: string;
};

const actionIndicators: Record<string, ActionIndicator> = {
  RECIPE_CREATED: {
    Icon: Plus,
    nodeClassName: "border-terracotta/20 bg-terracotta/10 text-terracotta",
  },
  RECIPE_UPDATED: {
    Icon: Pencil,
    nodeClassName: "border-terracotta/20 bg-terracotta/10 text-terracotta",
  },
  RECIPE_HIDDEN: {
    Icon: EyeOff,
    nodeClassName: "border-terracotta/20 bg-terracotta/10 text-terracotta",
  },
};

export function AdminAuditLogList() {
  const [items, setItems] = useState<AdminAuditLog[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [entityType, setEntityType] = useState<"recipe" | "user" | "">("");
  const [recipeTitles, setRecipeTitles] = useState<Record<string, string>>({});
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
      .then(async (result) => {
        const titles = await getRecipeTitles(result.items);

        if (!cancelled) {
          setItems(result.items);
          setMeta(result.meta);
          setRecipeTitles(titles);
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
          <ul className="relative py-2 before:absolute before:bottom-8 before:left-7 before:top-8 before:w-px before:bg-terracotta/20">
            {items.map((log) => {
              const recipeId = getRecipeId(log);
              const recipeTitle = recipeId ? recipeTitles[recipeId] : null;
              const changedFields =
                log.entityType === "recipe"
                  ? getChangedFields(log.details)
                  : [];
              const actionIndicator = actionIndicators[log.action];

              return (
                <li
                  key={log.id}
                  className="relative py-4 pl-16 pr-5"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute left-3 top-5 z-10 flex size-8 items-center justify-center rounded-full border-2 ${actionIndicator?.nodeClassName ??
                      "border-terracotta/25 bg-white text-terracotta"
                      }`}
                  >
                    {actionIndicator ? (
                      <actionIndicator.Icon className="size-4" strokeWidth={2.5} />
                    ) : (
                      <span className="size-2 rounded-full bg-current" />
                    )}
                  </span>

                  <div className="grid gap-3 rounded-2xl border border-terracotta/10 bg-cream/30 p-4 md:grid-cols-[1fr_1fr_1.5fr] md:items-center">
                    <div>
                      <p className="font-semibold">
                        {actionLabels[log.action] ?? log.action}
                      </p>
                      <p className="mt-1 text-xs text-charcoal/50">
                        {formatDate(log.createdAt)}
                      </p>
                    </div>
                    <div className="text-sm text-charcoal/65">
                      <p>
                        {log.entityType === "recipe"
                          ? "Công thức"
                          : "Tài khoản"}
                      </p>
                      {recipeTitle ? (
                        <p className="mt-1 break-words font-semibold text-charcoal">
                          {recipeTitle}
                        </p>
                      ) : null}
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold text-charcoal">Nội dung thay đổi</p>
                      {changedFields.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {changedFields.map((field) => (
                            <span
                              key={field}
                              className="rounded-full bg-terracotta/10 px-2.5 py-1 text-xs font-medium text-terracotta"
                            >
                              {recipeFieldLabels[field] ?? field}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-1 text-charcoal/55">
                          {getActionChangeLabel(log.action)}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
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

function getDetailString(
  details: Record<string, unknown>,
  ...keys: string[]
) {
  for (const key of keys) {
    const value = details[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return null;
}

function getEntityId(log: AdminAuditLog) {
  return getRecipeId(log) ?? log.entityId ?? "—";
}

function getRecipeId(log: AdminAuditLog) {
  if (log.entityType !== "recipe") return null;

  return getDetailString(log.details, "recipeId") ?? log.entityId;
}

async function getRecipeTitles(logs: AdminAuditLog[]) {
  const recipeIds = [
    ...new Set(
      logs
        .map(getRecipeId)
        .filter((recipeId): recipeId is string => recipeId !== null),
    ),
  ];
  const recipes = await Promise.all(
    recipeIds.map(async (recipeId) => {
      try {
        const recipe = await getAdminRecipe(recipeId);
        return [recipeId, recipe.title] as const;
      } catch {
        return null;
      }
    }),
  );

  return Object.fromEntries(
    recipes.filter(
      (recipe): recipe is readonly [string, string] => recipe !== null,
    ),
  );
}

function getChangedFields(details: Record<string, unknown>) {
  const fieldListKeys = ["changedFields", "updatedFields", "fields"];

  for (const key of fieldListKeys) {
    const value = details[key];
    if (Array.isArray(value)) {
      return value.filter(
        (field): field is string =>
          typeof field === "string" && field.trim().length > 0,
      );
    }
  }

  const changes = details.changes;
  if (isRecord(changes)) {
    return Object.keys(changes);
  }

  return [];
}

function getActionChangeLabel(action: string) {
  const labels: Record<string, string> = {
    RECIPE_APPROVED: "Trạng thái kiểm duyệt: Đã duyệt",
    RECIPE_CREATED: "Tạo mới công thức",
    RECIPE_HIDDEN: "Trạng thái hiển thị: Bị ẩn",
    RECIPE_REJECTED: "Trạng thái kiểm duyệt: Đã từ chối",
    USER_STATUS_UPDATED: "Trạng thái tài khoản",
  };

  return labels[action] ?? "Không có thông tin trường thay đổi";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
