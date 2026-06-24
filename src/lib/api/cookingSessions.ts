import {
  authorizedPaginatedRequest,
  authorizedRequest,
} from "@/lib/auth/authorizedRequest";
import type { PaginationMeta } from "@/lib/types/api";
import type {
  CookingHistorySort,
  CookingSession,
  StartCookingSessionRequest,
  UpdateCookingSessionRequest,
} from "@/lib/types/cookingSession";

interface CookingHistoryResult {
  items: CookingSession[];
  meta: PaginationMeta;
}

export async function startCookingSession(
  request: StartCookingSessionRequest,
): Promise<CookingSession> {
  return authorizedRequest<CookingSession>({
    body: request,
    method: "POST",
    path: "/api/v1/cooking-sessions",
  });
}

export async function updateCookingSession(
  sessionId: string,
  request: UpdateCookingSessionRequest,
): Promise<CookingSession> {
  return authorizedRequest<CookingSession>({
    body: request,
    method: "PATCH",
    path: `/api/v1/cooking-sessions/${encodeURIComponent(sessionId)}`,
  });
}

export async function completeCookingSession(
  sessionId: string,
): Promise<CookingSession> {
  return authorizedRequest<CookingSession>({
    method: "POST",
    path: `/api/v1/cooking-sessions/${encodeURIComponent(sessionId)}/complete`,
  });
}

export async function getCookingHistory(options?: {
  limit?: number;
  page?: number;
  sort?: CookingHistorySort;
}): Promise<CookingHistoryResult> {
  const params = new URLSearchParams();

  if (options?.page) {
    params.set("page", String(options.page));
  }

  if (options?.limit) {
    params.set("limit", String(options.limit));
  }

  if (options?.sort) {
    params.set("sort", options.sort);
  }

  const query = params.toString();
  const path = query
    ? `/api/v1/me/cooking-history?${query}`
    : "/api/v1/me/cooking-history";

  const { data, meta } = await authorizedPaginatedRequest<CookingSession[]>({
    method: "GET",
    path,
  });

  return { items: data, meta };
}
