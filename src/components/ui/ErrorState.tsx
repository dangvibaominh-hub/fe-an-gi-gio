"use client";

import { ButtonPrimary } from "@/components/ui/ButtonPrimary";

export interface ErrorStateProps {
  description: string;
  onRetry?: () => void;
  title: string;
}

export function ErrorState({
  description,
  onRetry,
  title,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="max-w-lg rounded-2xl border border-terracotta/20 bg-white/70 px-8 py-10 shadow-warm">
        <h1 className="text-2xl font-bold text-charcoal sm:text-3xl">
          {title}
        </h1>
        <p className="mt-3 text-charcoal/70">{description}</p>
        {onRetry ? (
          <ButtonPrimary onClick={onRetry} className="mt-8">
            Thử lại
          </ButtonPrimary>
        ) : null}
      </div>
    </div>
  );
}
