"use client";

import { useState } from "react";

import type { RecipeStep, TechniqueIcon } from "@/lib/mockRecipes";

export interface StepListProps {
  cookingTerms: Record<string, string>;
  steps: RecipeStep[];
}

const TERM_PATTERN = /{{(.*?)}}/g;

export function StepList({ cookingTerms, steps }: StepListProps) {
  const [openTermKey, setOpenTermKey] = useState<string | null>(null);

  return (
    <section
      aria-labelledby="steps-heading"
      className="rounded-2xl bg-white p-6 shadow-warm sm:p-8"
    >
      <h2
        id="steps-heading"
        className="text-2xl font-bold text-terracotta sm:text-3xl"
      >
        Các bước thực hiện
      </h2>

      <ol className="mt-8 space-y-8">
        {steps.map((step, stepIndex) => (
          <li
            key={step.id}
            className="relative grid grid-cols-[3rem_minmax(0,1fr)] gap-4"
          >
            {stepIndex < steps.length - 1 ? (
              <span
                aria-hidden="true"
                className="absolute bottom-[-2rem] left-6 top-12 w-px bg-terracotta/20"
              />
            ) : null}

            <span className="relative z-10 inline-flex size-12 items-center justify-center rounded-full bg-terracotta text-lg font-bold text-white shadow-warm">
              {stepIndex + 1}
            </span>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 font-bold uppercase tracking-wide text-charcoal">
                  <TechniqueGlyph technique={step.techniqueIcon} />
                  Bước {stepIndex + 1}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-terracotta/10 px-3 py-1.5 text-sm font-semibold text-charcoal">
                  <ClockGlyph />
                  {step.estimatedMinutes} phút
                </span>
              </div>

              <p className="mt-3 leading-7 text-charcoal/80">
                {renderStepContent({
                  content: step.content,
                  cookingTerms,
                  openTermKey,
                  setOpenTermKey,
                  stepId: step.id,
                })}
              </p>

              {step.isTricky ? (
                <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-terracotta/15 px-3 py-1.5 text-sm font-semibold text-terracotta">
                  <span aria-hidden="true">⚠</span>
                  Bước này hơi khó
                </span>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
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
          onMouseEnter={() => setOpenTermKey(termKey)}
          onMouseLeave={() => setOpenTermKey(null)}
          className="font-semibold text-terracotta underline decoration-dotted underline-offset-4 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        >
          {part}
        </button>
        {isOpen ? (
          <span
            role="tooltip"
            className="absolute bottom-full left-1/2 z-30 mb-2 w-64 -translate-x-1/2 rounded-xl bg-charcoal px-4 py-3 text-left text-sm font-normal leading-5 text-white shadow-xl"
          >
            {definition}
          </span>
        ) : null}
      </span>
    );
  });
}

function TechniqueGlyph({ technique }: { technique: TechniqueIcon }) {
  const paths: Record<TechniqueIcon, React.ReactNode> = {
    dao: <path d="M5 19 19 5M9 5l10 10M5 15l4 4" />,
    chao: <path d="M4 13h12a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Zm12 0 4-4" />,
    noi: <path d="M5 9h14l-2 10H7L5 9Zm3-3h8M3 12h2M19 12h2" />,
    tron: <path d="M7 7a7 7 0 1 1-1 9M7 7H3m4 0v4" />,
    hap: <path d="M5 11h14l-2 8H7l-2-8Zm3-3h8M9 5c0-2 2-2 2-4M14 5c0-2 2-2 2-4" />,
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5 fill-none stroke-terracotta"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[technique]}
    </svg>
  );
}

function ClockGlyph() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4 fill-none stroke-current"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
