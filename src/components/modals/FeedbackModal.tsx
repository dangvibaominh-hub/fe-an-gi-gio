"use client";

import { useState } from "react";

import { ModalBase } from "@/components/modals/ModalBase";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { submitCookingFeedback } from "@/lib/api/feedback";
import { ApiRequestError } from "@/lib/api/errors";
import { FEEDBACK_ISSUE_OPTIONS } from "@/lib/constants/feedback";
import type { FeedbackIssue } from "@/lib/types/cookingSession";

export interface FeedbackModalProps {
  cookingSessionId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function FeedbackModal({
  cookingSessionId,
  isOpen,
  onClose,
  onSuccess,
}: FeedbackModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby="feedback-modal-heading"
    >
      <FeedbackForm
        key={cookingSessionId}
        cookingSessionId={cookingSessionId}
        onSuccess={onSuccess}
      />
    </ModalBase>
  );
}

interface FeedbackFormProps {
  cookingSessionId: string;
  onSuccess: () => void;
}

function FeedbackForm({ cookingSessionId, onSuccess }: FeedbackFormProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [selectedIssues, setSelectedIssues] = useState<FeedbackIssue[]>([]);
  const [note, setNote] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggleIssue(issue: FeedbackIssue) {
    setSelectedIssues((currentIssues) => {
      if (currentIssues.includes(issue)) {
        return currentIssues.filter((value) => value !== issue);
      }

      if (currentIssues.length >= 4) {
        return currentIssues;
      }

      return [...currentIssues, issue];
    });
  }

  async function handleSubmit() {
    if (!rating) {
      setErrorMessage("Vui lòng chọn số sao đánh giá.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await submitCookingFeedback(cookingSessionId, {
        issues: selectedIssues,
        note: note.trim() || undefined,
        rating,
      });

      onSuccess();
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Không thể gửi đánh giá. Vui lòng thử lại.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <h2
        id="feedback-modal-heading"
        className="pr-10 text-2xl font-bold text-charcoal sm:text-3xl"
      >
        Món ăn thế nào rồi?
      </h2>

      <div className="mt-6">
        <p className="font-semibold text-charcoal">Đánh giá của bạn</p>
        <div
          role="radiogroup"
          aria-label="Chọn số sao đánh giá"
          className="mt-3 flex flex-wrap gap-2"
        >
          {[1, 2, 3, 4, 5].map((value) => {
            const isSelected = rating !== null && value <= rating;

            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setRating(value)}
                className={[
                  "inline-flex size-12 items-center justify-center rounded-full border text-xl transition",
                  isSelected
                    ? "border-amber-400 bg-amber-400 text-charcoal"
                    : "border-terracotta/25 bg-white text-charcoal hover:border-terracotta/50",
                ].join(" ")}
              >
                <span aria-hidden="true">★</span>
                <span className="sr-only">{value} sao</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <p className="font-semibold text-charcoal">
          Bạn gặp khó khăn gì không?
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {FEEDBACK_ISSUE_OPTIONS.map(({ label, value }) => {
            const isSelected = selectedIssues.includes(value);

            return (
              <button
                key={value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggleIssue(value)}
                className={[
                  "rounded-full border px-4 py-2 text-sm font-semibold transition",
                  isSelected
                    ? "border-terracotta bg-terracotta/10 text-terracotta"
                    : "border-terracotta/25 bg-white text-charcoal hover:bg-terracotta/5",
                ].join(" ")}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="feedback-note" className="font-semibold text-charcoal">
          Ghi chú thêm
        </label>
        <textarea
          id="feedback-note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Ghi chú thêm (không bắt buộc)"
          rows={3}
          maxLength={1000}
          className="mt-2 w-full rounded-xl border border-terracotta/30 bg-cream/40 px-4 py-3 text-charcoal outline-none transition placeholder:text-charcoal/45 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
        />
      </div>

      {errorMessage ? (
        <p className="mt-4 text-sm text-terracotta" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <ButtonPrimary
        type="button"
        onClick={() => {
          void handleSubmit();
        }}
        disabled={isSubmitting}
        className="mt-7 w-full"
      >
        {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
      </ButtonPrimary>
    </>
  );
}
