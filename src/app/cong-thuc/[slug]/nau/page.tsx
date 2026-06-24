import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CookingModeView } from "@/components/cooking/CookingModeView";
import { getRecipeBySlug } from "@/lib/api/recipes";

interface CookingModePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CookingModePageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  return {
    title: recipe ? `Nấu ${recipe.title}` : "Không tìm thấy công thức",
  };
}

export default async function CookingModePage({
  params,
}: CookingModePageProps) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }

  return <CookingModeView recipe={recipe} />;
}
