"use client";

import { useEffect, useRef, useState } from "react";

interface CookingTimerPanelProps {
  timerSeconds: number;
}

type TimerStatus = "idle" | "paused" | "running";

function formatTimer(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    String(seconds).padStart(2, "0"),
  ].join(":");
}

export function CookingTimerPanel({ timerSeconds }: CookingTimerPanelProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(timerSeconds);
  const [status, setStatus] = useState<TimerStatus>("idle");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status !== "running") {
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemainingSeconds((currentValue) => {
        if (currentValue <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          setStatus("paused");
          return 0;
        }

        return currentValue - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status]);

  function handleStart() {
    if (remainingSeconds === 0) {
      setRemainingSeconds(timerSeconds);
    }

    setStatus("running");
  }

  function handlePause() {
    setStatus("paused");
  }

  function handleReset() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setRemainingSeconds(timerSeconds);
    setStatus("idle");
  }

  return (
    <aside
      aria-label="Đồng hồ đếm ngược"
      className="h-full rounded-lg border border-terracotta/15 bg-[#fde9e3] p-4 text-center shadow-warm lg:p-5"
    >
      <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-mustard text-charcoal">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-5 fill-none stroke-current"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      </div>

      <p className="mt-4 text-base font-bold text-charcoal">Theo dõi thời gian nấu</p>

      <p
        aria-live="polite"
        className="mt-4 rounded-md bg-white px-3 py-3 text-2xl font-bold tabular-nums text-terracotta sm:text-3xl"
      >
        {formatTimer(remainingSeconds)}
      </p>

      <div className="mt-4">
        {status === "running" ? (
          <button
            type="button"
            onClick={handlePause}
            className="inline-flex min-h-10 w-full items-center justify-center rounded-full bg-terracotta px-4 text-sm font-bold text-white transition hover:bg-terracotta/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          >
            Tạm dừng
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStart}
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-terracotta px-4 text-sm font-bold text-white transition hover:bg-terracotta/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-3.5 fill-current"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            {status === "paused" ? "Tiếp tục" : "Bắt đầu"}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={handleReset}
        className="mt-3 text-xs font-semibold text-charcoal/55 underline-offset-4 transition hover:text-terracotta hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
      >
        Đặt lại
      </button>
    </aside>
  );
}
