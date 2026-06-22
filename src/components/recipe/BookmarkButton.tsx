"use client";

import { useEffect, useState } from "react";

import { IconButton } from "@/components/ui/IconButton";
import {
  SAVED_RECIPES_CHANGED_EVENT,
  isRecipeSaved,
  toggleSavedRecipe,
} from "@/lib/savedRecipes";

export interface BookmarkButtonProps {
  recipeSlug: string;
  recipeTitle: string;
}

export function BookmarkButton({
  recipeSlug,
  recipeTitle,
}: BookmarkButtonProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    function updateSavedState() {
      setIsSaved(isRecipeSaved(recipeSlug));
    }

    updateSavedState();

    window.addEventListener(
      SAVED_RECIPES_CHANGED_EVENT,
      updateSavedState,
    );

    window.addEventListener("storage", updateSavedState);

    return () => {
      window.removeEventListener(
        SAVED_RECIPES_CHANGED_EVENT,
        updateSavedState,
      );

      window.removeEventListener("storage", updateSavedState);
    };
  }, [recipeSlug]);

  function handleToggleSave() {
    const nextSavedState = toggleSavedRecipe(recipeSlug);

    setIsSaved(nextSavedState);
  }

  return (
    <IconButton
      aria-label={`${isSaved ? "Bỏ lưu" : "Lưu"} công thức ${recipeTitle}`}
      isActive={isSaved}
      onClick={handleToggleSave}
      className="bg-white/90 shadow-warm hover:bg-white"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className={`size-5 stroke-current ${
          isSaved ? "fill-current" : "fill-none"
        }`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 3h12v18l-6-4-6 4V3Z" />
      </svg>
    </IconButton>
  );
}