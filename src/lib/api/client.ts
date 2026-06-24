import { getApiBaseUrl } from "@/lib/config";
import { ApiRequestError, isApiErrorResponse } from "@/lib/api/errors";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@/lib/types/api";

const DEFAULT_REVALIDATE_SECONDS = 60;

interface ApiGetOptions {
  revalidate?: number | false;
}

export async function apiGet<T>(
  path: string,
  options: ApiGetOptions = {},
): Promise<ApiSuccessResponse<T>> {
  const revalidate =
    options.revalidate === undefined
      ? DEFAULT_REVALIDATE_SECONDS
      : options.revalidate;

  const url = `${getApiBaseUrl()}${path}`;
  const response =
    revalidate === false
      ? await fetch(url, { cache: "no-store" })
      : await fetch(url, { next: { revalidate } });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw createApiRequestError(response.status, payload);
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

  return payload as ApiSuccessResponse<T>;
}

export async function apiPost<T, B>(
  path: string,
  body: B,
): Promise<ApiSuccessResponse<T>> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    body: JSON.stringify(body),
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw createApiRequestError(response.status, payload);
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

  return payload as ApiSuccessResponse<T>;
}

function createApiRequestError(
  status: number,
  payload: unknown,
): ApiRequestError {
  if (isApiErrorResponse(payload)) {
    return new ApiRequestError(
      payload.error.message,
      status,
      payload.error.code,
      payload.error.details,
    );
  }

  return new ApiRequestError(
    "Không thể kết nối tới máy chủ. Vui lòng thử lại sau.",
    status,
  );
}

export type { ApiErrorResponse };
