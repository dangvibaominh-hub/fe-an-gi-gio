import type { AuthSession, User } from "@/lib/types/auth";

const ACCESS_TOKEN_KEY = "an-gi-gio-access-token";
const REFRESH_TOKEN_KEY = "an-gi-gio-refresh-token";
const USER_KEY = "an-gi-gio-user";

export interface StoredAuthSession {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export function readStoredAuthSession(): StoredAuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const userRaw = localStorage.getItem(USER_KEY);

    if (!accessToken || !refreshToken || !userRaw) {
      return null;
    }

    const user: unknown = JSON.parse(userRaw);

    if (
      typeof user !== "object" ||
      user === null ||
      typeof (user as User).id !== "string"
    ) {
      return null;
    }

    return {
      accessToken,
      refreshToken,
      user: user as User,
    };
  } catch {
    return null;
  }
}

export function writeStoredAuthSession(session: AuthSession): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, session.tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, session.tokens.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
}

export function clearStoredAuthSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredRefreshToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(REFRESH_TOKEN_KEY);
}
