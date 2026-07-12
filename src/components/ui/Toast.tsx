"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

export interface ToastProps {
  message: string;
}

export function Toast({ message }: ToastProps) {
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      role="status"
      className="fixed bottom-6 left-1/2 z-[70] flex max-w-[min(calc(100vw-2rem),32rem)] -translate-x-1/2 items-center gap-2 rounded-2xl bg-sage px-5 py-3 text-sm font-semibold leading-6 text-charcoal shadow-xl sm:text-base"
    >
      <span aria-hidden="true" className="shrink-0">
        ✓
      </span>
      <span className="min-w-0 break-words">{message}</span>
    </div>,
    document.body,
  );
}
