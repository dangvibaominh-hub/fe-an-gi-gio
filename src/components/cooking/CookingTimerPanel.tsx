"use client";

import { useEffect, useRef, useState } from "react";

import "./CookingTimerPanel.css";

interface CookingTimerPanelProps {
  timerSeconds: number;
}

type TimerStatus = "idle" | "paused" | "running";

function formatTimerDigits(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return {
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
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

  const timerDigits = formatTimerDigits(remainingSeconds);

  return (
    <aside aria-label="Đồng hồ đếm ngược" className="cooking-timer-phone">
      <span aria-hidden="true" className="cooking-timer-phone__notch" />
      <span
        aria-hidden="true"
        className="cooking-timer-phone__side-button cooking-timer-phone__side-button--top"
      />
      <p aria-live="polite" className="cooking-timer-phone__time tabular-nums">
        {timerDigits.minutes}:{timerDigits.seconds}
      </p>
      <p className="cooking-timer-phone__label">Theo dõi thời gian nấu</p>

      <div>
        {status === "running" ? (
          <button
            type="button"
            onClick={handlePause}
            className="cooking-timer-phone__timer-button"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-3.5 fill-current"
            >
              <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
            </svg>
            Tạm dừng
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStart}
            className="cooking-timer-phone__timer-button"
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

        <button
          type="button"
          onClick={handleReset}
          className="cooking-timer-phone__reset"
        >
          Đặt lại
        </button>
      </div>
    </aside>
  );
}
