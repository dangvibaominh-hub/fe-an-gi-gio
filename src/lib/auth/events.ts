export const AUTH_STATE_CHANGED_EVENT = "auth-state-changed";
export const SAVED_RECIPES_CHANGED_EVENT = "saved-recipes-changed";

export function notifyAuthStateChanged() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(AUTH_STATE_CHANGED_EVENT));
}

export function notifySavedRecipesChanged() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(SAVED_RECIPES_CHANGED_EVENT));
}
