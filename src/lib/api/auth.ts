import { apiGet, apiPost } from "@/lib/api/client";
import { getApiBaseUrl } from "@/lib/config";
import type {
  AuthSession,
  GoogleLoginRequest,
  LoginRequest,
  RegisterRequest,
  User,
} from "@/lib/types/auth";

export async function register(
  request: RegisterRequest,
): Promise<AuthSession> {
  const response = await apiPost<AuthSession, RegisterRequest>(
    "/api/v1/auth/register",
    request,
  );

  return response.data;
}

export async function login(request: LoginRequest): Promise<AuthSession> {
  const response = await apiPost<AuthSession, LoginRequest>(
    "/api/v1/auth/login",
    request,
  );

  return response.data;
}

export async function loginWithGoogle(
  request: GoogleLoginRequest,
): Promise<AuthSession> {
  const response = await apiPost<AuthSession, GoogleLoginRequest>(
    "/api/v1/auth/google",
    request,
  );

  return response.data;
}

export async function refreshAuthSession(
  refreshToken: string,
): Promise<AuthSession> {
  const response = await apiPost<AuthSession, { refreshToken: string }>(
    "/api/v1/auth/refresh",
    { refreshToken },
  );

  return response.data;
}

export async function logout(refreshToken: string): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/api/v1/auth/logout`, {
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
  });

  if (!response.ok && response.status !== 204) {
    const payload: unknown = await response.json().catch(() => null);

    if (
      typeof payload === "object" &&
      payload !== null &&
      "error" in payload &&
      typeof (payload as { error?: { message?: string } }).error?.message ===
        "string"
    ) {
      throw new Error(
        (payload as { error: { message: string } }).error.message,
      );
    }
  }
}

export async function getCurrentUser(
  accessToken: string,
): Promise<User> {
  const response = await apiGet<User>("/api/v1/me", {
    accessToken,
    revalidate: false,
  });

  return response.data;
}
