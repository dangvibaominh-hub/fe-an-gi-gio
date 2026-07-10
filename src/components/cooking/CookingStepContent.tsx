"use client";

import Image from "next/image";
import type { ReactNode } from "react";
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
  totalSteps: number;
  timerPanel?: ReactNode;
}

export function CookingStepContent({
  cookingTerms,
  ingredients,
  recipeImage,
  recipeImageAlt,
  step,
  stepNumber,
  totalSteps,
  timerPanel,
}: CookingStepContentProps) {
  const [openTermKey, setOpenTermKey] = useState<string | null>(null);
  const title = getStepTitle(step.content, stepNumber);

  return (
    <article className="grid h-full min-h-0 w-full grid-rows-[auto_auto_auto_auto]">
      <div className="mt-4 flex min-w-0 items-start justify-start gap-3">
        <span className="shrink-0 whitespace-nowrap text-xl font-bold leading-tight text-charcoal sm:text-2xl lg:text-3xl">
          Bước {stepNumber} / {totalSteps}:
        </span>

        <h1 className="min-w-0 text-xl font-bold leading-tight text-terracotta sm:text-2xl lg:text-3xl">
          {title}
        </h1>
      </div>

      <p className="mt-0.5 text-sm font-medium leading-5 text-charcoal/70">
        Bước {stepNumber} cần khoảng {step.estimatedMinutes} phút.
      </p>

      <div className="mt-2 grid min-h-0 gap-3 sm:grid-cols-[minmax(8rem,16rem)_minmax(0,1fr)] sm:grid-rows-[minmax(0,16rem)] lg:grid-cols-[minmax(9rem,18rem)_minmax(0,1fr)_minmax(240px,320px)] lg:grid-rows-[minmax(0,18rem)]">
        <div className="relative aspect-square min-h-0 w-full overflow-hidden rounded-lg bg-charcoal/10 sm:h-full">
          <Image
            src={recipeImage}
            alt={recipeImageAlt}
            fill
            priority
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 16rem, 18rem"
            className="object-cover"
          />
        </div>

        <section className="flex min-h-0 flex-col overflow-hidden rounded-lg border p-4 shadow-warm">
          <div className="shrink-0" aria-labelledby="needed-ingredients">
            <h2
              id="needed-ingredients"
              className="text-xs font-bold uppercase tracking-wide text-charcoal/70"
            >
              Nguyên liệu cần dùng ở bước này
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {ingredients.slice(0, 3).map((ingredient) => (
                <span
                  key={ingredient.id}
                  className="inline-flex min-h-8 items-center rounded-full bg-sage/20 px-3 text-xs font-bold text-charcoal"
                >
                  {formatIngredient(ingredient)}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-3 min-h-0 flex-1 overflow-y-auto text-sm font-medium leading-5 text-charcoal lg:leading-6">
            {renderStepContent({
              content: step.content,
              cookingTerms,
              openTermKey,
              setOpenTermKey,
              stepId: step.id,
            })}
          </div>
        </section>

        {timerPanel}
      </div>

      {step.isTricky ? (
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-terracotta/15 px-4 py-2 text-xs font-bold text-terracotta">
          <span aria-hidden="true">!</span>
          Bước này hơi khó, hãy làm chậm và cẩn thận.
        </p>
      ) : null}
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

  return `${amount} ${ingredient.unit} ${ingredient.name}`;
}
