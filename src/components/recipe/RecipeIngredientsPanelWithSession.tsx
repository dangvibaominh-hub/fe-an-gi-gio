"use client";

import { useMemo } from "react";

import { RecipeIngredientsPanel } from "@/components/recipe/RecipeIngredientsPanel";
import {
  applyMatchToIngredients,
  readRecipeMatch,
} from "@/lib/searchSession";
import type { RecipeIngredient } from "@/lib/types/recipe";

export interface RecipeIngredientsPanelWithSessionProps {
  baseServings: number;
  ingredients: RecipeIngredient[];
  recipeSlug: string;
}

export function RecipeIngredientsPanelWithSession({
  baseServings,
  ingredients,
  recipeSlug,
}: RecipeIngredientsPanelWithSessionProps) {
  const ingredientsWithMatch = useMemo(() => {
    const match = readRecipeMatch(recipeSlug);

    return applyMatchToIngredients(ingredients, match);
  }, [ingredients, recipeSlug]);

  return (
    <RecipeIngredientsPanel
      baseServings={baseServings}
      ingredients={ingredientsWithMatch}
    />
  );
}
