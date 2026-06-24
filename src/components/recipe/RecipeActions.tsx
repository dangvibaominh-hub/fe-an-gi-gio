"use client";

import { useEffect, useState } from "react";

import { BookmarkButton } from "@/components/recipe/BookmarkButton";
import { IconButton } from "@/components/ui/IconButton";
import { Toast } from "@/components/ui/Toast";

export interface RecipeActionsProps {
  recipeSlug: string;
  recipeTitle: string;
}

export function RecipeActions({
  recipeSlug,
  recipeTitle,
}: RecipeActionsProps) {
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeoutId = window.setTimeout(
      () => setToastMessage(null),
      2500,
    );

    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  function copyRecipeLink() {
    setToastMessage("Đã sao chép liên kết");
    setIsShareMenuOpen(false);

    void navigator.clipboard
      .writeText(window.location.href)
      .catch(() => setToastMessage("Không thể sao chép liên kết"));
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <BookmarkButton
          recipeSlug={recipeSlug}
          recipeTitle={recipeTitle}
        />

        <div className="relative">
          <IconButton
            aria-label="Chia sẻ công thức"
            aria-expanded={isShareMenuOpen}
            onClick={() =>
              setIsShareMenuOpen((currentValue) => !currentValue)
            }
            className="bg-white/85 shadow-warm backdrop-blur-sm hover:bg-white"
          >
            <ShareGlyph />
          </IconButton>

          {isShareMenuOpen ? (
            <div className="absolute right-0 top-14 z-40 w-60 rounded-2xl border border-terracotta/20 bg-white p-2 text-sm text-charcoal shadow-xl">
              <ShareMenuButton onClick={copyRecipeLink}>
                Sao chép liên kết
              </ShareMenuButton>
              <ShareMenuButton
                onClick={() => setIsShareMenuOpen(false)}
              >
                Chia sẻ qua Messenger
              </ShareMenuButton>
              <ShareMenuButton
                onClick={() => setIsShareMenuOpen(false)}
              >
                Chia sẻ qua Zalo
              </ShareMenuButton>
            </div>
          ) : null}
        </div>

        <IconButton
          aria-label="In công thức"
          onClick={() => window.print()}
          className="bg-white/85 shadow-warm backdrop-blur-sm hover:bg-white"
        >
          <PrintGlyph />
        </IconButton>
      </div>

      {toastMessage ? <Toast message={toastMessage} /> : null}
    </>
  );
}

interface ShareMenuButtonProps {
  children: React.ReactNode;
  onClick: () => void;
}

function ShareMenuButton({
  children,
  onClick,
}: ShareMenuButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl px-4 py-3 text-left font-medium transition hover:bg-terracotta/10 focus-visible:outline-2 focus-visible:outline-terracotta"
    >
      {children}
    </button>
  );
}

function ShareGlyph() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5 fill-none stroke-current"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4" />
    </svg>
  );
}

function PrintGlyph() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5 fill-none stroke-current"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 8V3h10v5M7 17H5a3 3 0 0 1-3-3v-3a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-2" />
      <path d="M7 14h10v7H7z" />
    </svg>
  );
}
