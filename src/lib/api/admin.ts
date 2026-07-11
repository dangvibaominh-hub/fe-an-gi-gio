import {
  authorizedPaginatedRequest,
  authorizedRequest,
} from "@/lib/auth/authorizedRequest";
import type {
  AdminAuditFilters,
  AdminAuditLog,
  AdminRecipe,
  AdminRecipeDetail,
  AdminRecipeFilters,
  AdminRecipeWriteInput,
  AdminUser,
  AdminUserFilters,
  ModerationStatus,
} from "@/lib/types/admin";
import type { PaginationMeta } from "@/lib/types/api";
import type { UserStatus } from "@/lib/types/auth";

export interface AdminPage<T> {
  items: T[];
  meta: PaginationMeta;
}

export async function listAdminRecipes(
  filters: AdminRecipeFilters = {},
): Promise<AdminPage<AdminRecipe>> {
  return toPage(
    await authorizedPaginatedRequest<AdminRecipe[]>({
      method: "GET",
      path: `/api/v1/admin/recipes${toQuery(filters)}`,
    }),
  );
}

export function getAdminRecipe(id: string) {
  return authorizedRequest<AdminRecipeDetail>({
    method: "GET",
    path: `/api/v1/admin/recipes/${encodeURIComponent(id)}`,
  });
}

export function createAdminRecipe(input: AdminRecipeWriteInput, image?: File | null) {
  return authorizedRequest<AdminRecipeDetail>({
    body: toRecipeFormData(input, image),
    method: "POST",
    path: "/api/v1/admin/recipes",
  });
}

export function updateAdminRecipe(
  id: string,
  input: Partial<AdminRecipeWriteInput>,
  image?: File | null,
) {
  return authorizedRequest<AdminRecipeDetail>({
    body: toRecipeFormData(input, image),
    method: "PATCH",
    path: `/api/v1/admin/recipes/${encodeURIComponent(id)}`,
  });
}

function toRecipeFormData(
  input: Partial<AdminRecipeWriteInput>,
  image?: File | null,
) {
  const body = new FormData();
  const { image: _storedImageUrl, ...recipe } = input;
  void _storedImageUrl;
  body.append("recipe", JSON.stringify(recipe));
  if (image) body.append("image", image);
  return body;
}

export function hideAdminRecipe(id: string) {
  return authorizedRequest<void>({
    method: "DELETE",
    path: `/api/v1/admin/recipes/${encodeURIComponent(id)}`,
  });
}

export function moderateAdminRecipe(
  id: string,
  moderationStatus: Extract<ModerationStatus, "APPROVED" | "REJECTED">,
) {
  return authorizedRequest<AdminRecipeDetail>({
    body: { moderationStatus },
    method: "PATCH",
    path: `/api/v1/admin/recipes/${encodeURIComponent(id)}/moderation`,
  });
}

export async function listAdminUsers(
  filters: AdminUserFilters = {},
): Promise<AdminPage<AdminUser>> {
  return toPage(
    await authorizedPaginatedRequest<AdminUser[]>({
      method: "GET",
      path: `/api/v1/admin/users${toQuery(filters)}`,
    }),
  );
}

export function updateAdminUserStatus(id: string, status: UserStatus) {
  return authorizedRequest<AdminUser>({
    body: { status },
    method: "PATCH",
    path: `/api/v1/admin/users/${encodeURIComponent(id)}/status`,
  });
}

export async function listAdminAuditLogs(
  filters: AdminAuditFilters = {},
): Promise<AdminPage<AdminAuditLog>> {
  return toPage(
    await authorizedPaginatedRequest<AdminAuditLog[]>({
      method: "GET",
      path: `/api/v1/admin/audit-logs${toQuery(filters)}`,
    }),
  );
}

function toPage<T>({
  data,
  meta,
}: {
  data: T[];
  meta: PaginationMeta;
}): AdminPage<T> {
  return { items: data, meta };
}

function toQuery(values: object) {
  const params = new URLSearchParams();

  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  return query ? `?${query}` : "";
}
