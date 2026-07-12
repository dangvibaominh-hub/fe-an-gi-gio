"use client";

import { useEffect } from "react";

import type { RecipeMatchMap } from "@/lib/searchSession";
import { saveSearchSession } from "@/lib/searchSession";
import type { RecipeDetail } from "@/lib/types/recipe";

export interface SearchSessionSyncProps {
  ingredients: string[];
  matches: RecipeMatchMap;
  generatedRecipes?: RecipeDetail[];
}

export function SearchSessionSync({
  ingredients,
  matches,
  generatedRecipes = [],
}: SearchSessionSyncProps) {
  useEffect(() => {
    saveSearchSession(ingredients, matches, generatedRecipes);
  }, [generatedRecipes, ingredients, matches]);

  return null;
}
