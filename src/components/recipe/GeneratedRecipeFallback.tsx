"use client";

import { notFound } from "next/navigation";

import { RecipeDetailView } from "@/components/recipe/RecipeDetailView";
import { readGeneratedRecipe } from "@/lib/searchSession";

export function GeneratedRecipeDetailFallback({ slug }: { slug: string }) {
  const recipe = readGeneratedRecipe(slug);

  if (!recipe) {
    notFound();
  }

  return <RecipeDetailView recipe={recipe} canStartCooking={false} />;
}
