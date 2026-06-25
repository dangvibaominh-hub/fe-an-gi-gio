"use client";

import { useState } from "react";

import type { RecipeStep, TechniqueIcon } from "@/lib/types/recipe";

const TERM_PATTERN = /{{(.*?)}}/g;

export interface CookingStepContentProps {
  cookingTerms: Record<string, string>;
  step: RecipeStep;
  stepNumber: number;
}

export function CookingStepContent({
  cookingTerms,
  step,
  stepNumber,
}: CookingStepContentProps) {
  const [openTermKey, setOpenTermKey] = useState<string | null>(null);

  return (
    <article className="mx-auto w-full max-w-3xl">
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-terracotta/10 px-4 py-2 text-sm font-bold uppercase tracking-wide text-terracotta">
          <TechniqueGlyph technique={step.techniqueIcon} />
          Bước {stepNumber}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-sm font-semibold text-charcoal shadow-warm">
          <ClockGlyph />
          {step.estimatedMinutes} phút
        </span>
      </div>

      <p className="mt-8 text-2xl font-medium leading-relaxed text-charcoal sm:text-3xl sm:leading-relaxed">
        {renderStepContent({
          content: step.content,
          cookingTerms,
          openTermKey,
          setOpenTermKey,
          stepId: step.id,
        })}
      </p>

      {step.isTricky ? (
        <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-terracotta/15 px-4 py-2 text-sm font-semibold text-terracotta">
          <span aria-hidden="true">⚠</span>
          Bước này hơi khó — hãy làm chậm và cẩn thận
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
      className="size-5 fill-none stroke-current"
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
