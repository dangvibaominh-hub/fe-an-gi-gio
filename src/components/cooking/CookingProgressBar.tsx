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
    <div className="mx-auto w-full max-w-md">
      <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase text-charcoal">
        <span>
          Bước {currentStep} / {totalSteps}
        </span>
        <span>{progressPercent}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Tiến độ nấu: bước ${currentStep} trên ${totalSteps}`}
        className="h-1.5 overflow-hidden rounded-full bg-terracotta/10"
      >
        <div
          className="h-full rounded-full bg-terracotta transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
