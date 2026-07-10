"use client";

interface CookingProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function CookingProgressBar({
  currentStep,
  totalSteps,
}: CookingProgressBarProps) {
  const progressPercent =
    totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0;

  return (
    <div className="mx-auto flex w-4/5 items-center justify-center gap-3">
      <div
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Tiến độ nấu: bước ${currentStep} trên ${totalSteps}`}
        className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-terracotta/10"
      >
        <div
          className="h-full rounded-full bg-terracotta transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <span className="shrink-0 text-xs font-bold tabular-nums text-charcoal/60">
        {progressPercent}%
      </span>
    </div>
  );
}
