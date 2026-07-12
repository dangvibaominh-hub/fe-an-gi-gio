import type { Metadata } from "next";

import {
  GeneratedRecipeDetailFallback,
} from "@/components/recipe/GeneratedRecipeFallback";
import { RecipeDetailView } from "@/components/recipe/RecipeDetailView";
import { getRecipeBySlug } from "@/lib/api/recipes";

interface RecipeDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: RecipeDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  return {
    title: recipe?.title ?? "Không tìm thấy công thức",
    description: recipe?.description,
  };
}

export default async function RecipeDetailPage({
  params,
}: RecipeDetailPageProps) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    return <GeneratedRecipeDetailFallback slug={slug} />;
  }

  return <RecipeDetailView recipe={recipe} />;
}
