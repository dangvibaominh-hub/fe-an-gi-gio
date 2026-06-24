import {
  SEARCH_INGREDIENTS_PARAM,
  SEARCH_MATCHES_STORAGE_KEY,
  SEARCH_SESSION_STORAGE_KEY,
} from "@/lib/constants/search";
import type { RecommendationMatch } from "@/lib/types/recommendation";

export type RecipeMatchMap = Record<string, RecommendationMatch>;

export function buildResultsHref(ingredients: string[]): string {
  const params = new URLSearchParams();

  for (const ingredient of ingredients) {
    params.append(SEARCH_INGREDIENTS_PARAM, ingredient);
  }

  const query = params.toString();

  return query ? `/ket-qua?${query}` : "/ket-qua";
}

export function parseIngredientsFromSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): string[] {
  const rawValue = searchParams[SEARCH_INGREDIENTS_PARAM];

  if (rawValue === undefined) {
    return [];
  }

  const values = Array.isArray(rawValue) ? rawValue : [rawValue];

  return dedupeIngredients(
    values
      .map((value) => value.trim())
      .filter((value) => value.length > 0),
  );
}

export function dedupeIngredients(ingredients: string[]): string[] {
  const seen = new Set<string>();

  return ingredients.filter((ingredient) => {
    const key = ingredient.toLocaleLowerCase("vi");

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export function saveSearchSession(
  ingredients: string[],
  matches: RecipeMatchMap = {},
): void {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(
    SEARCH_SESSION_STORAGE_KEY,
    JSON.stringify(dedupeIngredients(ingredients)),
  );
  sessionStorage.setItem(
    SEARCH_MATCHES_STORAGE_KEY,
    JSON.stringify(matches),
  );
}

export function readSearchIngredients(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue = sessionStorage.getItem(SEARCH_SESSION_STORAGE_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return dedupeIngredients(
      parsedValue.filter(
        (value): value is string => typeof value === "string",
      ),
    );
  } catch {
    return [];
  }
}

export function readRecipeMatch(
  recipeSlug: string,
): RecommendationMatch | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    const storedValue = sessionStorage.getItem(SEARCH_MATCHES_STORAGE_KEY);

    if (!storedValue) {
      return undefined;
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (typeof parsedValue !== "object" || parsedValue === null) {
      return undefined;
    }

    const match = (parsedValue as RecipeMatchMap)[recipeSlug];

    return match;
  } catch {
    return undefined;
  }
}

export function applyMatchToIngredients<
  T extends { haveIt: boolean; name: string },
>(ingredients: T[], match: RecommendationMatch | undefined): T[] {
  if (!match) {
    return ingredients;
  }

  const matchedNames = new Set(
    match.matchedIngredients.map((name) =>
      name.toLocaleLowerCase("vi"),
    ),
  );

  return ingredients.map((ingredient) => ({
    ...ingredient,
    haveIt: matchedNames.has(ingredient.name.toLocaleLowerCase("vi")),
  }));
}
