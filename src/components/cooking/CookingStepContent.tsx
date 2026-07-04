"use client";

import Image from "next/image";
import { useState } from "react";

import type { RecipeIngredient, RecipeStep } from "@/lib/types/recipe";

const TERM_PATTERN = /{{(.*?)}}/g;

export interface CookingStepContentProps {
  cookingTerms: Record<string, string>;
  ingredients: RecipeIngredient[];
  recipeImage: string;
  recipeImageAlt: string;
  step: RecipeStep;
  stepNumber: number;
}

export function CookingStepContent({
  cookingTerms,
  ingredients,
  recipeImage,
  recipeImageAlt,
  step,
  stepNumber,
}: CookingStepContentProps) {
  const [openTermKey, setOpenTermKey] = useState<string | null>(null);
  const title = getStepTitle(step.content, stepNumber);

  return (
    <article className="w-full">
      <h1 className="text-2xl font-bold leading-tight text-terracotta sm:text-3xl">
        {title}
      </h1>

      <p className="mt-3 text-sm font-medium leading-6 text-charcoal/70">
        Bước {stepNumber} cần khoảng {step.estimatedMinutes} phút. Chuẩn bị sẵn
        nguyên liệu rồi làm chậm rãi theo hướng dẫn bên dưới.
      </p>

      <div className="relative mt-5 aspect-[16/10] overflow-hidden rounded-lg bg-charcoal/10">
        <Image
          src={recipeImage}
          alt={recipeImageAlt}
          fill
          priority
          sizes="(max-width: 1023px) 100vw, 620px"
          className="object-cover"
        />
      </div>

      <div className="mt-5 rounded-lg bg-[#fdebea] p-5 text-sm font-medium leading-6 text-charcoal">
        {renderStepContent({
          content: step.content,
          cookingTerms,
          openTermKey,
          setOpenTermKey,
          stepId: step.id,
        })}
      </div>

      {step.isTricky ? (
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-terracotta/15 px-4 py-2 text-xs font-bold text-terracotta">
          <span aria-hidden="true">!</span>
          Bước này hơi khó, hãy làm chậm và cẩn thận.
        </p>
      ) : null}

      <section className="mt-5" aria-labelledby="needed-ingredients">
        <h2
          id="needed-ingredients"
          className="text-xs font-bold uppercase tracking-wide text-charcoal/70"
        >
          Nguyên liệu cần dùng ở bước này
        </h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {ingredients.slice(0, 3).map((ingredient) => (
            <span
              key={ingredient.id}
              className="inline-flex min-h-7 items-center rounded-full bg-sage/20 px-3 text-xs font-bold text-charcoal"
            >
              {formatIngredient(ingredient)}
            </span>
          ))}
        </div>
      </section>
    </article>
  );
}

interface RenderStepContentOptions {
  content: string;
  cookingTerms: Record<string, string>;
  openTermKey: string | null;
  setOpenTermKey: (key: string | null) => void;
  stepId: string;
}

function renderStepContent({
  content,
  cookingTerms,
  openTermKey,
  setOpenTermKey,
  stepId,
}: RenderStepContentOptions) {
  return content.split(TERM_PATTERN).map((part, index) => {
    const definition = cookingTerms[part];

    if (!definition) {
      return part;
    }

    const termKey = `${stepId}-${part}-${index}`;
    const isOpen = openTermKey === termKey;

    return (
      <span key={termKey} className="relative inline-block">
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => setOpenTermKey(isOpen ? null : termKey)}
          className="font-bold text-terracotta underline decoration-dotted underline-offset-4 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        >
          {part}
        </button>
        {isOpen ? (
          <span
            role="tooltip"
            className="absolute bottom-full left-1/2 z-30 mb-2 w-64 -translate-x-1/2 rounded-lg bg-charcoal px-4 py-3 text-left text-sm font-normal leading-5 text-white shadow-xl"
          >
            {definition}
          </span>
        ) : null}
      </span>
    );
  });
}

function getStepTitle(content: string, stepNumber: number) {
  const cleanContent = content.replace(TERM_PATTERN, "$1").trim();
  const firstSentence = cleanContent.split(/[.!?。]/)[0]?.trim();

  if (!firstSentence) {
    return `Bước ${stepNumber}`;
  }

  return firstSentence.length > 44
    ? `${firstSentence.slice(0, 42).trim()}...`
    : firstSentence;
}

function formatIngredient(ingredient: RecipeIngredient) {
  const amount = Number.isInteger(ingredient.baseAmount)
    ? ingredient.baseAmount
    : ingredient.baseAmount.toFixed(1);

  return `${amount}${ingredient.unit} ${ingredient.name}`;
}
