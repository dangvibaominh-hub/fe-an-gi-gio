"use client";

import { useEffect, useRef, useState } from "react";

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
  const shareMenuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!isShareMenuOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        shareMenuRef.current?.contains(event.target as Node)
      ) {
        return;
      }

      setIsShareMenuOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () =>
      document.removeEventListener(
        "pointerdown",
        handlePointerDown,
      );
  }, [isShareMenuOpen]);

  function copyRecipeLink() {
    setToastMessage("Đã sao chép liên kết");
    setIsShareMenuOpen(false);

    void navigator.clipboard
      .writeText(window.location.href)
      .catch(() => setToastMessage("Không thể sao chép liên kết"));
  }

  function shareViaZalo() {
    const shareUrl = `https://zalo.me/share?u=${encodeURIComponent(window.location.href)}`;
    setIsShareMenuOpen(false);
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <BookmarkButton
          recipeSlug={recipeSlug}
          recipeTitle={recipeTitle}
        />

        <div ref={shareMenuRef} className="relative">
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
            <div className="absolute bottom-14 right-0 z-40 grid w-max max-w-[calc(100vw-2rem)] rounded-2xl border border-terracotta/20 bg-white p-2 text-sm text-charcoal shadow-xl">
              <ShareMenuButton onClick={copyRecipeLink}>
                <CopyGlyph />
                Sao chép link
              </ShareMenuButton>
              <ShareMenuButton onClick={shareViaZalo}>
                <ZaloGlyph />
                Chia sẻ Zalo
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
      className="inline-flex items-center whitespace-nowrap rounded-xl px-4 py-3 text-left font-medium transition hover:bg-terracotta/10 focus-visible:outline-2 focus-visible:outline-terracotta"
    >
      {children}
    </button>
  );
}

function CopyGlyph() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="mr-2 size-4 shrink-0 fill-none stroke-current"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function ZaloGlyph() {
  return (
    <span
      aria-hidden="true"
      className="mr-2 inline-flex size-4 shrink-0 items-center justify-center rounded border border-charcoal text-[8px] font-bold leading-none text-charcoal"
    >
      Z
    </span>
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
