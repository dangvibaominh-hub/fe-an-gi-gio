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
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-sm font-semibold text-charcoal/70">
        <span>
          Bước {currentStep}/{totalSteps}
        </span>
        <span>{progressPercent}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Tiến độ nấu: bước ${currentStep} trên ${totalSteps}`}
        className="h-2 overflow-hidden rounded-full bg-terracotta/15"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-terracotta to-mustard transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
