"use client";

import type { AuthSession } from "@/lib/types";

const SESSION_STORAGE_KEY = "an-gi-gio-auth-session";
export const AUTH_SESSION_CHANGED_EVENT = "auth-session-changed";

export function getStoredSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawSession = window.localStorage.getItem(SESSION_STORAGE_KEY);

    if (!rawSession) {
      return null;
    }

    const parsedSession = JSON.parse(rawSession) as Partial<AuthSession>;

    if (
      typeof parsedSession.user?.id !== "string" ||
      typeof parsedSession.tokens?.accessToken !== "string" ||
      typeof parsedSession.tokens?.refreshToken !== "string"
    ) {
      return null;
    }

    return parsedSession as AuthSession;
  } catch {
    return null;
  }
}

export function getAccessToken() {
  return getStoredSession()?.tokens.accessToken ?? null;
}

export function storeSession(session: AuthSession) {
  window.localStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify(session),
  );
  window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT));
}

export function clearStoredSession() {
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
  window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT));
}
