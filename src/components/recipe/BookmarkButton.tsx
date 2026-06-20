"use client";

import { useState } from "react";

import { IconButton } from "@/components/ui/IconButton";

export interface BookmarkButtonProps {
  recipeTitle: string;
}

export function BookmarkButton({ recipeTitle }: BookmarkButtonProps) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <IconButton
      aria-label={`${isSaved ? "Bỏ lưu" : "Lưu"} công thức ${recipeTitle}`}
      isActive={isSaved}
      onClick={() => setIsSaved((currentValue) => !currentValue)}
      className="bg-white/90 shadow-warm hover:bg-white"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className={`size-5 stroke-current ${isSaved ? "fill-current" : "fill-none"}`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 3h12v18l-6-4-6 4V3Z" />
      </svg>
    </IconButton>
  );
}
