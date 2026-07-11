"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { Clock3 } from "lucide-react";
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
  timerPanel?: ReactNode;
}

export function CookingStepContent({
  cookingTerms,
  ingredients,
  recipeImage,
  recipeImageAlt,
  step,
  stepNumber,
  timerPanel,
}: CookingStepContentProps) {
  const cookingNotes = getCookingNotes(step.content, cookingTerms);
  const [checkedIngredients, setCheckedIngredients] = useState<
    Record<string, boolean>
  >(() =>
    Object.fromEntries(
      ingredients.map((ingredient) => [ingredient.id, ingredient.haveIt]),
    ),
  );
  const stepIngredients = ingredients.slice(0, 3);

  function toggleIngredient(id: string) {
    setCheckedIngredients((currentState) => ({
      ...currentState,
      [id]: !currentState[id],
    }));
  }

  return (
    <article className="flex h-full min-h-0 w-full flex-col justify-center">
      <div className="grid min-h-0 gap-x-3 gap-y-3 sm:grid-cols-[minmax(8rem,16rem)_minmax(0,1fr)] lg:grid-cols-[minmax(9rem,18rem)_minmax(0,1fr)_minmax(240px,320px)]">
        <div className="sm:col-span-2 lg:col-span-2">
          <section className="h-fit w-full self-start rounded-2xl bg-white p-4 shadow-warm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-charcoal/60">
            Bước {stepNumber}
          </p>

          <h1 className="mt-3 flex min-w-0 items-baseline gap-3 break-words text-xl font-bold leading-tight text-terracotta sm:text-xl lg:text-2xl">
            <span className="min-w-0 break-words">
              {renderStepTitle(step.content, stepNumber)}
            </span>
          </h1>

          <span className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-terracotta/10 px-3 py-1.5 text-sm font-semibold text-charcoal">
            <Clock3 aria-hidden="true" className="size-4 text-terracotta" />
            {step.estimatedMinutes} phút
          </span>
          </section>

          <div className="mt-2 grid min-h-0 gap-x-3 gap-y-3 sm:grid-cols-[minmax(8rem,16rem)_minmax(0,1fr)] sm:grid-rows-[minmax(0,16rem)] lg:grid-cols-[minmax(9rem,18rem)_minmax(0,1fr)] lg:grid-rows-[minmax(0,18rem)]">
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

            <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-terracotta/15 bg-white p-4 shadow-warm">
          <div className="grid min-h-0 gap-4 md:grid-cols-2">
            <div aria-labelledby="needed-ingredients">
              <h2
                id="needed-ingredients"
                className="text-sm font-bold uppercase tracking-wide text-terracotta"
              >
                Nguyên liệu
              </h2>
              <ul className="mt-3 space-y-1.5">
                {stepIngredients.map((ingredient) => {
                  const isChecked = checkedIngredients[ingredient.id] ?? false;

                  return (
                    <li key={ingredient.id}>
                      <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-sage/10">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleIngredient(ingredient.id)}
                          className="size-5 shrink-0 rounded border-terracotta/30 accent-sage"
                        />
                        <span
                          className={
                            isChecked
                              ? "min-w-0 text-charcoal/55 line-through"
                              : "min-w-0 text-charcoal"
                          }
                        >
                          {formatIngredientAmount(ingredient)}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>

            <aside className="flex h-full flex-col border-t border-terracotta/10 pt-4 md:border-l md:border-t-0 md:pl-4 md:pt-0">
              <h3 className="text-sm font-bold uppercase tracking-wide text-terracotta">Ghi chú</h3>
              {cookingNotes.length > 0 ? (
                <div className="mt-1.5 space-y-1 text-md leading-5 text-charcoal/80">
                  {cookingNotes.map(({ term, definition }) => (
                    <p key={term}>
                      <span className="font-bold text-terracotta text-md">- {term}:</span>{" "}
                      {definition}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="mt-1.5 text-md leading-5 text-charcoal/55">
                  Chưa có ghi chú cho bước này.
                </p>
              )}
              {step.isTricky ? (
                <p className="mt-auto inline-flex items-center gap-2 rounded-full bg-terracotta/15 px-4 py-2 text-xs font-bold text-terracotta">
                  <span aria-hidden="true">!</span>
                  Bước này hơi khó, hãy làm chậm và cẩn thận.
                </p>
              ) : null}
            </aside>
          </div>
            </section>
          </div>
        </div>

        {timerPanel ? (
          <div className="flex justify-center sm:col-span-2 lg:col-start-3 lg:h-full lg:items-center">
            {timerPanel}
          </div>
        ) : null}
      </div>

    </article>
  );
}

function renderStepTitle(content: string, stepNumber: number) {
  const titleContent = content.trim() || `Bước ${stepNumber}`;

  return titleContent.split(TERM_PATTERN).map((part, index) =>
    index % 2 === 1 ? (
      <span
        key={`${part}-${index}`}
        className="mx-1 inline-flex max-w-full whitespace-normal break-words rounded-2xl bg-terracotta px-4 py-1 text-white sm:px-5 sm:py-1.5"
      >
        {part}
      </span>
    ) : (
      part
    ),
  );
}

function getCookingNotes(
  content: string,
  cookingTerms: Record<string, string>,
) {
  const terms = Array.from(content.matchAll(TERM_PATTERN), (match) =>
    match[1]?.trim(),
  ).filter((term): term is string => Boolean(term));

  return [...new Set(terms)].flatMap((term) => {
    const definition = cookingTerms[term];
    return definition ? [{ definition, term }] : [];
  });
}

function formatIngredientAmount(ingredient: RecipeIngredient) {
  const amount = Number.isInteger(ingredient.baseAmount)
    ? ingredient.baseAmount
    : ingredient.baseAmount.toFixed(1);

  return `${amount} ${ingredient.unit} ${ingredient.name}`;
}
