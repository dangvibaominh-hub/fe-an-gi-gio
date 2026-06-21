"use client";

import { useState } from "react";

import { IconButton } from "@/components/ui/IconButton";

export interface ServingStepperProps {
  baseServings: number;
  onServingsChange?: (servings: number) => void;
}

const MAX_SERVINGS = 12;

export function ServingStepper({
  baseServings,
  onServingsChange,
}: ServingStepperProps) {
  const [servings, setServings] = useState(baseServings);

  function updateServings(nextServings: number) {
    const safeServings = Math.min(
      MAX_SERVINGS,
      Math.max(1, nextServings),
    );

    setServings(safeServings);
    onServingsChange?.(safeServings);
  }

  return (
    <div
      aria-label="Điều chỉnh khẩu phần"
      className="inline-flex items-center rounded-full bg-terracotta/10 p-1"
    >
      <IconButton
        aria-label="Giảm khẩu phần"
        onClick={() => updateServings(servings - 1)}
        disabled={servings === 1}
        className="size-10 bg-white text-terracotta shadow-warm hover:bg-white"
      >
        <span aria-hidden="true" className="text-2xl leading-none">
          −
        </span>
      </IconButton>
      <output
        aria-live="polite"
        className="min-w-24 px-3 text-center font-bold text-charcoal"
      >
        {servings} người
      </output>
      <IconButton
        aria-label="Tăng khẩu phần"
        onClick={() => updateServings(servings + 1)}
        disabled={servings === MAX_SERVINGS}
        className="size-10 bg-white text-terracotta shadow-warm hover:bg-white"
      >
        <span aria-hidden="true" className="text-2xl leading-none">
          +
        </span>
      </IconButton>
    </div>
  );
}
