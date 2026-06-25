import {
  authorizedPaginatedRequest,
  authorizedRequest,
} from "@/lib/auth/authorizedRequest";
import { normalizeCookingSession } from "@/lib/cooking/normalize";
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
  const session = await authorizedRequest<CookingSession>({
    body: request,
    method: "POST",
    path: "/api/v1/cooking-sessions",
  });

  return normalizeCookingSession(session);
}

export async function updateCookingSession(
  sessionId: string,
  request: UpdateCookingSessionRequest,
): Promise<CookingSession> {
  const session = await authorizedRequest<CookingSession>({
    body: request,
    method: "PATCH",
    path: `/api/v1/cooking-sessions/${encodeURIComponent(sessionId)}`,
  });

  return normalizeCookingSession(session);
}

export async function completeCookingSession(
  sessionId: string,
): Promise<CookingSession> {
  const session = await authorizedRequest<CookingSession>({
    method: "POST",
    path: `/api/v1/cooking-sessions/${encodeURIComponent(sessionId)}/complete`,
  });

  return normalizeCookingSession(session);
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

  return { items: data.map(normalizeCookingSession), meta };
}
