"use client";

import { useEffect, useRef, useState } from "react";

import { ButtonSecondary } from "@/components/ui/ButtonSecondary";
import { IconButton } from "@/components/ui/IconButton";

interface CookingTimerPanelProps {
  timerSeconds: number;
}

type TimerStatus = "idle" | "paused" | "running";

function formatTimer(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
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

          setStatus("idle");
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
      className="rounded-2xl border border-terracotta/20 bg-white/90 p-4 shadow-warm backdrop-blur-sm sm:p-5"
    >
      <p className="text-sm font-semibold uppercase tracking-wide text-charcoal/60">
        Thời gian chờ
      </p>
      <p
        aria-live="polite"
        className="mt-2 text-4xl font-bold tabular-nums text-terracotta sm:text-5xl"
      >
        {formatTimer(remainingSeconds)}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {status === "running" ? (
          <ButtonSecondary
            type="button"
            onClick={handlePause}
            className="min-h-10 px-4 py-2 text-sm"
          >
            Tạm dừng
          </ButtonSecondary>
        ) : (
          <ButtonSecondary
            type="button"
            onClick={handleStart}
            className="min-h-10 px-4 py-2 text-sm"
          >
            {status === "paused" ? "Tiếp tục" : "Bắt đầu"}
          </ButtonSecondary>
        )}

        <IconButton
          aria-label="Đặt lại đồng hồ"
          onClick={handleReset}
          className="size-10 bg-cream text-charcoal hover:bg-terracotta/10"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-5 fill-none stroke-current"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 4v6h6M20 20v-6h-6" />
            <path d="M5 19a9 9 0 0 1 14-7M19 5a9 9 0 0 1-14 7" />
          </svg>
        </IconButton>
      </div>
    </aside>
  );
}
