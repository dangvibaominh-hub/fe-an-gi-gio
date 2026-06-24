"use client";

import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";

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
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      <ButtonSecondary
        type="button"
        onClick={onBack}
        disabled={!canGoBack || isCompleting}
        className="w-full"
      >
        Bước trước
      </ButtonSecondary>

      {isLastStep ? (
        <ButtonPrimary
          type="button"
          onClick={onForward}
          disabled={!canGoForward || isCompleting}
          className="w-full"
        >
          {isCompleting ? "Đang hoàn thành..." : "Hoàn thành món ăn"}
        </ButtonPrimary>
      ) : (
        <ButtonPrimary
          type="button"
          onClick={onForward}
          disabled={!canGoForward || isCompleting}
          className="w-full"
        >
          Bước sau
        </ButtonPrimary>
      )}
    </div>
  );
}
