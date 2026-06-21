import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { DifficultyBadge } from "@/components/recipe/DifficultyBadge";
import { RecipeActions } from "@/components/recipe/RecipeActions";
import { RecipeIngredientsPanel } from "@/components/recipe/RecipeIngredientsPanel";
import { StepList } from "@/components/recipe/StepList";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import {
  getRecipeBySlug,
  MOCK_RECIPES,
} from "@/lib/mockRecipes";

interface RecipeDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return MOCK_RECIPES.map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({
  params,
}: RecipeDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);

  return {
    title: recipe?.title ?? "Không tìm thấy công thức",
    description: recipe
      ? `Hướng dẫn chi tiết món ${recipe.title}.`
      : undefined,
  };
}

export default async function RecipeDetailPage({
  params,
}: RecipeDetailPageProps) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="relative overflow-hidden rounded-2xl shadow-warm">
        <div className="relative aspect-[16/8] min-h-80">
          <Image
            src={recipe.image}
            alt={recipe.imageAlt}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1216px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-5 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
            <div>
              <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-white sm:text-5xl">
                {recipe.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <DifficultyBadge difficulty={recipe.difficulty} />
                <span className="rounded-full bg-white/85 px-3 py-1 text-sm font-semibold text-charcoal">
                  {recipe.cookTimeMinutes} phút
                </span>
                <span className="rounded-full bg-white/85 px-3 py-1 text-sm font-semibold text-charcoal">
                  {recipe.category}
                </span>
              </div>
            </div>
            <RecipeActions />
          </div>
        </div>
      </header>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <RecipeIngredientsPanel
          baseServings={recipe.baseServings}
          ingredients={recipe.ingredients}
        />

        <div>
          <ButtonPrimary
            href={`/cong-thuc/${recipe.slug}/nau`}
            className="mb-5 w-full"
          >
            Bắt đầu nấu
          </ButtonPrimary>
          <StepList
            steps={recipe.steps}
            cookingTerms={recipe.cookingTerms}
          />
        </div>
      </div>
    </div>
  );
}
