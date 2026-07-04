"use client";

interface StepNavigationButtonsProps {
  canGoBack: boolean;
  canGoForward: boolean;
  isCompleting?: boolean;
  isLastStep: boolean;
  onBack: () => void;
  onForward: () => void;
}

export function StepNavigationButtons({
  canGoBack,
  canGoForward,
  isCompleting = false,
  isLastStep,
  onBack,
  onForward,
}: StepNavigationButtonsProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={onBack}
        disabled={!canGoBack || isCompleting}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-terracotta/20 bg-white px-5 text-xs font-bold uppercase text-charcoal transition hover:border-terracotta/40 hover:text-terracotta disabled:cursor-not-allowed disabled:opacity-45"
      >
        <span aria-hidden="true">←</span>
        Bước trước
      </button>

      <button
        type="button"
        onClick={onForward}
        disabled={!canGoForward || isCompleting}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-terracotta px-5 text-xs font-bold uppercase text-white transition hover:bg-terracotta/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLastStep
          ? isCompleting
            ? "Đang hoàn thành..."
            : "Hoàn thành món ăn"
          : "Bước sau"}
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
