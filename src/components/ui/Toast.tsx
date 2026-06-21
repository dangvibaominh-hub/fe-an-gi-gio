"use client";

export interface ToastProps {
  message: string;
}

export function Toast({ message }: ToastProps) {
  return (
    <div
      role="status"
      className="fixed bottom-6 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-full bg-sage px-5 py-3 font-semibold text-charcoal shadow-xl"
    >
      <span aria-hidden="true">✓</span>
      {message}
    </div>
  );
}
