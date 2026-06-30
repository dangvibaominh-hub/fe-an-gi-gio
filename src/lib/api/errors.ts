import type { ApiErrorResponse } from "@/lib/types/api";

export class ApiRequestError extends Error {
  readonly code: string;
  readonly details: unknown;
  readonly status: number;

  constructor(
    message: string,
    status: number,
    code = "API_ERROR",
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
    this.details = details;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }
}

export function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    record.success === false &&
    typeof record.error === "object" &&
    record.error !== null
  );
}
