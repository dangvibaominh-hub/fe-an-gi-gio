import {
  GENERATED_RECIPES_STORAGE_KEY,
  SEARCH_INGREDIENTS_PARAM,
  SEARCH_MATCHES_STORAGE_KEY,
  SEARCH_SESSION_STORAGE_KEY,
} from "@/lib/constants/search";
import type { RecommendationMatch } from "@/lib/types/recommendation";
import type { RecipeDetail } from "@/lib/types/recipe";

export type RecipeMatchMap = Record<string, RecommendationMatch>;
type GeneratedRecipeMap = Record<string, RecipeDetail>;

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
  generatedRecipes: RecipeDetail[] = [],
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

  if (generatedRecipes.length > 0) {
    const nextRecipes = { ...readGeneratedRecipes() };

    for (const recipe of generatedRecipes) {
      nextRecipes[recipe.slug] = recipe;
    }

    sessionStorage.setItem(
      GENERATED_RECIPES_STORAGE_KEY,
      JSON.stringify(nextRecipes),
    );
  }
}

export function readGeneratedRecipe(slug: string): RecipeDetail | undefined {
  return readGeneratedRecipes()[slug];
}

function readGeneratedRecipes(): GeneratedRecipeMap {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const storedValue = sessionStorage.getItem(GENERATED_RECIPES_STORAGE_KEY);

    if (!storedValue) {
      return {};
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    return typeof parsedValue === "object" && parsedValue !== null
      ? (parsedValue as GeneratedRecipeMap)
      : {};
  } catch {
    return {};
  }
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

  const missingNames = new Set(
    match.missingIngredients.map((name) =>
      name.toLocaleLowerCase("vi"),
    ),
  );

  return ingredients.map((ingredient) => ({
    ...ingredient,
    haveIt: !missingNames.has(ingredient.name.toLocaleLowerCase("vi")),
  }));
}
