"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUser,
  login as loginRequest,
  loginWithGoogle,
  logout as logoutRequest,
  refreshAuthSession,
  register as registerRequest,
} from "@/lib/api/auth";
import { ApiRequestError } from "@/lib/api/errors";
import {
  AUTH_STATE_CHANGED_EVENT,
  notifyAuthStateChanged,
  notifySavedRecipesChanged,
} from "@/lib/auth/events";
import { authorizedRequest } from "@/lib/auth/authorizedRequest";
import {
  clearStoredAuthSession,
  readStoredAuthSession,
  writeStoredAuthSession,
} from "@/lib/auth/tokenStore";
import type { User } from "@/lib/types/auth";
import type { SavedRecipe } from "@/lib/types/savedRecipe";

interface AuthContextValue {
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  isAuthenticated: boolean;
  isInitializing: boolean;
  isRecipeSaved: (recipeSlug: string) => boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogleToken: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  openAuthModal: () => void;
  refreshSavedRecipes: () => Promise<void>;
  register: (
    email: string,
    password: string,
    displayName?: string,
  ) => Promise<void>;
  requireAuth: (action?: () => void) => boolean;
  savedRecipes: SavedRecipe[];
  toggleSavedRecipe: (recipeSlug: string) => Promise<boolean>;
  user: User | null;
}

interface SessionState {
  savedRecipes: SavedRecipe[];
  user: User | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchSavedRecipes(): Promise<SavedRecipe[]> {
  if (!readStoredAuthSession()) {
    return [];
  }

  try {
    return await authorizedRequest<SavedRecipe[]>({
      method: "GET",
      path: "/api/v1/me/saved-recipes",
    });
  } catch {
    return [];
  }
}

async function resolveSessionState(
  options: { refreshSaved?: boolean } = {},
): Promise<SessionState> {
  const refreshSaved = options.refreshSaved !== false;
  const storedSession = readStoredAuthSession();

  if (!storedSession) {
    return { savedRecipes: [], user: null };
  }

  try {
    const currentUser = await getCurrentUser(storedSession.accessToken);

    return {
      savedRecipes: refreshSaved ? await fetchSavedRecipes() : [],
      user: currentUser,
    };
  } catch {
    try {
      const refreshedSession = await refreshAuthSession(
        storedSession.refreshToken,
      );
      writeStoredAuthSession(refreshedSession);

      return {
        savedRecipes: refreshSaved ? await fetchSavedRecipes() : [],
        user: refreshedSession.user,
      };
    } catch {
      clearStoredAuthSession();
      return { savedRecipes: [], user: null };
    }
  }
}

function applySessionState(
  setUser: (user: User | null) => void,
  setSavedRecipes: (recipes: SavedRecipe[]) => void,
  state: SessionState,
) {
  setUser(state.user);
  setSavedRecipes(state.savedRecipes);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const pendingAuthActionRef = useRef<(() => void) | null>(null);

  const isAuthenticated = user !== null;

  const syncSession = useCallback(async (options?: { refreshSaved?: boolean }) => {
    const state = await resolveSessionState(options);
    applySessionState(setUser, setSavedRecipes, state);

    if (options?.refreshSaved !== false) {
      notifySavedRecipesChanged();
    }

    return state;
  }, []);

  const refreshSavedRecipes = useCallback(async () => {
    const recipes = await fetchSavedRecipes();
    setSavedRecipes(recipes);
    notifySavedRecipesChanged();
  }, []);

  useEffect(() => {
    let cancelled = false;

    void resolveSessionState().then((state) => {
      if (cancelled) {
        return;
      }

      applySessionState(setUser, setSavedRecipes, state);
      setIsInitializing(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function handleAuthStateChanged() {
      void syncSession();
    }

    window.addEventListener(AUTH_STATE_CHANGED_EVENT, handleAuthStateChanged);

    return () => {
      window.removeEventListener(
        AUTH_STATE_CHANGED_EVENT,
        handleAuthStateChanged,
      );
    };
  }, [syncSession]);

  const completeAuthSuccess = useCallback(async () => {
    await syncSession();
    notifyAuthStateChanged();
    setIsAuthModalOpen(false);

    const pendingAction = pendingAuthActionRef.current;
    pendingAuthActionRef.current = null;
    pendingAction?.();
  }, [syncSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      const session = await loginRequest({ email, password });
      writeStoredAuthSession(session);
      await completeAuthSuccess();
    },
    [completeAuthSuccess],
  );

  const register = useCallback(
    async (email: string, password: string, displayName?: string) => {
      const session = await registerRequest({
        email,
        password,
        ...(displayName ? { displayName } : {}),
      });
      writeStoredAuthSession(session);
      await completeAuthSuccess();
    },
    [completeAuthSuccess],
  );

  const loginWithGoogleToken = useCallback(
    async (idToken: string) => {
      const session = await loginWithGoogle({ idToken });
      writeStoredAuthSession(session);
      await completeAuthSuccess();
    },
    [completeAuthSuccess],
  );

  const logout = useCallback(async () => {
    const refreshToken = readStoredAuthSession()?.refreshToken;

    if (refreshToken) {
      try {
        await logoutRequest(refreshToken);
      } catch {
        // Local logout still proceeds if revoke fails.
      }
    }

    clearStoredAuthSession();
    setUser(null);
    setSavedRecipes([]);
    notifyAuthStateChanged();
    notifySavedRecipesChanged();
  }, []);

  const openAuthModal = useCallback(() => {
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    pendingAuthActionRef.current = null;
  }, []);

  const requireAuth = useCallback(
    (action?: () => void) => {
      if (isAuthenticated) {
        action?.();
        return true;
      }

      if (action) {
        pendingAuthActionRef.current = action;
      }

      openAuthModal();
      return false;
    },
    [isAuthenticated, openAuthModal],
  );

  const isRecipeSaved = useCallback(
    (recipeSlug: string) => {
      return savedRecipes.some((recipe) => recipe.slug === recipeSlug);
    },
    [savedRecipes],
  );

  const toggleSavedRecipe = useCallback(
    async (recipeSlug: string) => {
      if (!isAuthenticated) {
        openAuthModal();
        return false;
      }

      const currentlySaved = isRecipeSaved(recipeSlug);

      try {
        if (currentlySaved) {
          await authorizedRequest<void>({
            method: "DELETE",
            path: `/api/v1/me/saved-recipes/${encodeURIComponent(recipeSlug)}`,
          });

          setSavedRecipes((currentRecipes) =>
            currentRecipes.filter((recipe) => recipe.slug !== recipeSlug),
          );
        } else {
          const savedRecipe = await authorizedRequest<SavedRecipe>({
            body: {},
            method: "POST",
            path: `/api/v1/me/saved-recipes/${encodeURIComponent(recipeSlug)}`,
          });

          setSavedRecipes((currentRecipes) => {
            if (currentRecipes.some((recipe) => recipe.slug === recipeSlug)) {
              return currentRecipes;
            }

            return [savedRecipe, ...currentRecipes];
          });
        }

        notifySavedRecipesChanged();
        return !currentlySaved;
      } catch (error) {
        if (error instanceof ApiRequestError && error.status === 401) {
          await logout();
          openAuthModal();
        }

        throw error;
      }
    },
    [
      isAuthenticated,
      isRecipeSaved,
      logout,
      openAuthModal,
    ],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      closeAuthModal,
      isAuthModalOpen,
      isAuthenticated,
      isInitializing,
      isRecipeSaved,
      login,
      loginWithGoogleToken,
      logout,
      openAuthModal,
      refreshSavedRecipes,
      register,
      requireAuth,
      savedRecipes,
      toggleSavedRecipe,
      user,
    }),
    [
      closeAuthModal,
      isAuthModalOpen,
      isAuthenticated,
      isInitializing,
      isRecipeSaved,
      login,
      loginWithGoogleToken,
      logout,
      openAuthModal,
      refreshSavedRecipes,
      register,
      requireAuth,
      savedRecipes,
      toggleSavedRecipe,
      user,
    ],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth phải được dùng bên trong AuthProvider.");
  }

  return context;
}

export function getUserInitial(user: User | null): string {
  const source = user?.displayName?.trim() || user?.email || "?";

  return source.charAt(0).toLocaleUpperCase("vi");
}
