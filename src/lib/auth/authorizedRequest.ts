import { getApiBaseUrl } from "@/lib/config";
import { ApiRequestError, isApiErrorResponse } from "@/lib/api/errors";
import {
  getStoredAccessToken,
  getStoredRefreshToken,
  writeStoredAuthSession,
} from "@/lib/auth/tokenStore";
import { refreshAuthSession } from "@/lib/api/auth";
import type { ApiSuccessResponse, PaginationMeta } from "@/lib/types/api";

type HttpMethod = "DELETE" | "GET" | "PATCH" | "POST";

interface AuthorizedRequestOptions {
  body?: unknown;
  method: HttpMethod;
  path: string;
}

export async function authorizedRequest<T>(
  options: AuthorizedRequestOptions,
): Promise<T> {
  const accessToken = getStoredAccessToken();
  const refreshToken = getStoredRefreshToken();

  if (!accessToken || !refreshToken) {
    throw new ApiRequestError(
      "Bạn cần đăng nhập để thực hiện thao tác này.",
      401,
      "UNAUTHORIZED",
    );
  }

  try {
    return await sendAuthorizedRequest<T>({
      ...options,
      accessToken,
    });
  } catch (error) {
    if (!(error instanceof ApiRequestError) || error.status !== 401) {
      throw error;
    }

    const refreshedSession = await refreshAuthSession(refreshToken);
    writeStoredAuthSession(refreshedSession);

    return sendAuthorizedRequest<T>({
      ...options,
      accessToken: refreshedSession.tokens.accessToken,
    });
  }
}

async function sendAuthorizedRequest<T>({
  accessToken,
  body,
  method,
  path,
}: AuthorizedRequestOptions & {
  accessToken: string;
}): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    method,
  });

  if (method === "DELETE" && response.ok) {
    return undefined as T;
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    if (isApiErrorResponse(payload)) {
      throw new ApiRequestError(
        payload.error.message,
        response.status,
        payload.error.code,
        payload.error.details,
      );
    }

    throw new ApiRequestError(
      "Không thể kết nối tới máy chủ. Vui lòng thử lại sau.",
      response.status,
    );
  }

  if (
    typeof payload !== "object" ||
    payload === null ||
    (payload as ApiSuccessResponse<T>).success !== true
  ) {
    throw new ApiRequestError(
      "Phản hồi API không hợp lệ.",
      response.status,
      "INVALID_API_RESPONSE",
      payload,
    );
  }

  return (payload as ApiSuccessResponse<T>).data;
}

export async function authorizedPaginatedRequest<T>(
  options: AuthorizedRequestOptions,
): Promise<{ data: T; meta: PaginationMeta }> {
  const accessToken = getStoredAccessToken();
  const refreshToken = getStoredRefreshToken();

  if (!accessToken || !refreshToken) {
    throw new ApiRequestError(
      "Bạn cần đăng nhập để thực hiện thao tác này.",
      401,
      "UNAUTHORIZED",
    );
  }

  try {
    return await sendAuthorizedPaginatedRequest<T>({
      ...options,
      accessToken,
    });
  } catch (error) {
    if (!(error instanceof ApiRequestError) || error.status !== 401) {
      throw error;
    }

    const refreshedSession = await refreshAuthSession(refreshToken);
    writeStoredAuthSession(refreshedSession);

    return sendAuthorizedPaginatedRequest<T>({
      ...options,
      accessToken: refreshedSession.tokens.accessToken,
    });
  }
}

async function sendAuthorizedPaginatedRequest<T>({
  accessToken,
  body,
  method,
  path,
}: AuthorizedRequestOptions & {
  accessToken: string;
}): Promise<{ data: T; meta: PaginationMeta }> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    method,
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    if (isApiErrorResponse(payload)) {
      throw new ApiRequestError(
        payload.error.message,
        response.status,
        payload.error.code,
        payload.error.details,
      );
    }

    throw new ApiRequestError(
      "Không thể kết nối tới máy chủ. Vui lòng thử lại sau.",
      response.status,
    );
  }

  if (
    typeof payload !== "object" ||
    payload === null ||
    (payload as ApiSuccessResponse<T>).success !== true
  ) {
    throw new ApiRequestError(
      "Phản hồi API không hợp lệ.",
      response.status,
      "INVALID_API_RESPONSE",
      payload,
    );
  }

  const successPayload = payload as ApiSuccessResponse<T>;

  if (!successPayload.meta) {
    throw new ApiRequestError(
      "Phản hồi API không hợp lệ.",
      response.status,
      "INVALID_API_RESPONSE",
      payload,
    );
  }

  return {
    data: successPayload.data,
    meta: successPayload.meta,
  };
}
