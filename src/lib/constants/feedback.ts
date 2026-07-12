import type { FeedbackIssue } from "@/lib/types/cookingSession";

export const FEEDBACK_ISSUE_OPTIONS: ReadonlyArray<{
  label: string;
  value: FeedbackIssue;
}> = [
  { label: "Cắt thịt khó quá", value: "cutting-meat-hard" },
  { label: "Chiên bị bắn dầu", value: "oil-splatter" },
  {
    label: "Mất nhiều thời gian hơn dự kiến",
    value: "took-longer-than-expected",
  },
  { label: "Thiếu nguyên liệu", value: "missing-ingredients" },
];

export const POST_COOKING_TOAST_KEY = "an-gi-gio-cooking-thank-you";
export const POST_COOKING_TOAST_MESSAGE =
  "Bạn đã hoàn thành món ăn! Cảm ơn bạn đã đánh giá.";
