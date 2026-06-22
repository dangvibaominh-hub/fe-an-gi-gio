const STORAGE_KEY = "an-gi-gio-saved-recipe-slugs";

export const SAVED_RECIPES_CHANGED_EVENT = "saved-recipes-changed";

export function getSavedRecipeSlugs(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
      return [];
    }

    const parsedData: unknown = JSON.parse(savedData);

    if (!Array.isArray(parsedData)) {
      return [];
    }

    return [...new Set(
      parsedData.filter(
        (slug): slug is string => typeof slug === "string",
      ),
    )];
  } catch {
    return [];
  }
}

export function isRecipeSaved(recipeSlug: string): boolean {
  return getSavedRecipeSlugs().includes(recipeSlug);
}

export function toggleSavedRecipe(recipeSlug: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const savedRecipeSlugs = getSavedRecipeSlugs();
  const isSaved = savedRecipeSlugs.includes(recipeSlug);

  const nextSavedRecipeSlugs = isSaved
    ? savedRecipeSlugs.filter((slug) => slug !== recipeSlug)
    : [...savedRecipeSlugs, recipeSlug];

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(nextSavedRecipeSlugs),
  );

  window.dispatchEvent(new Event(SAVED_RECIPES_CHANGED_EVENT));

  return !isSaved;
}