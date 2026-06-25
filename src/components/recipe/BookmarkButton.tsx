"use client";

import { useEffect, useState } from "react";

import { IconButton } from "@/components/ui/IconButton";
import { useAuth } from "@/lib/auth/AuthProvider";
import { SAVED_RECIPES_CHANGED_EVENT } from "@/lib/auth/events";

export interface BookmarkButtonProps {
  recipeSlug: string;
  recipeTitle: string;
}

export function BookmarkButton({
  recipeSlug,
  recipeTitle,
}: BookmarkButtonProps) {
  const {
    isRecipeSaved,
    requireAuth,
    toggleSavedRecipe,
  } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    function updateSavedState() {
      setIsSaved(isRecipeSaved(recipeSlug));
    }

    updateSavedState();

    window.addEventListener(
      SAVED_RECIPES_CHANGED_EVENT,
      updateSavedState,
    );

    return () => {
      window.removeEventListener(
        SAVED_RECIPES_CHANGED_EVENT,
        updateSavedState,
      );
    };
  }, [isRecipeSaved, recipeSlug]);

  function handleToggleSave(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (isPending) {
      return;
    }

    requireAuth(() => {
      setIsPending(true);

      void toggleSavedRecipe(recipeSlug)
        .then((nextSavedState) => {
          setIsSaved(nextSavedState);
        })
        .catch(() => {
          setIsSaved(isRecipeSaved(recipeSlug));
        })
        .finally(() => {
          setIsPending(false);
        });
    });
  }

  return (
    <IconButton
      aria-label={`${isSaved ? "Bỏ lưu" : "Lưu"} công thức ${recipeTitle}`}
      isActive={isSaved}
      disabled={isPending}
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
