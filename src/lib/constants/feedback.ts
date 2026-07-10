import type { FeedbackIssue } from "@/lib/types/cookingSession";
import type { RecipeCategory } from "@/lib/constants/recipe";

export const FEEDBACK_ISSUE_OPTIONS: ReadonlyArray<{
  categories?: readonly RecipeCategory[];
  label: string;
  value: FeedbackIssue;
}> = [
  {
    label: "Mất nhiều thời gian hơn dự kiến",
    value: "took-longer-than-expected",
  },
  { label: "Thiếu nguyên liệu", value: "missing-ingredients" },
  { label: "Các bước hơi khó hiểu", value: "hard-to-follow-steps" },
  { label: "Vị chưa hợp khẩu vị", value: "taste-not-right" },
  {
    categories: ["Món xào", "Món canh", "Món chiên", "Món hấp"],
    label: "Sơ chế/cắt thịt khó",
    value: "cutting-meat-hard",
  },
  {
    categories: ["Món chiên"],
    label: "Chiên bị bắn dầu",
    value: "oil-splatter",
  },
  {
    categories: ["Món chiên", "Món xào"],
    label: "Món quá nhiều dầu",
    value: "too-oily",
  },
  {
    categories: ["Món chiên"],
    label: "Món chưa giòn",
    value: "not-crispy",
  },
  {
    categories: ["Món xào"],
    label: "Bị dính/cháy chảo",
    value: "pan-sticking-or-burning",
  },
  {
    categories: ["Món xào", "Món chay"],
    label: "Rau/nguyên liệu bị mềm quá",
    value: "vegetables-too-soft",
  },
  {
    categories: ["Món canh"],
    label: "Nước canh nhạt hoặc mặn",
    value: "soup-too-bland-or-salty",
  },
  {
    categories: ["Món canh"],
    label: "Nguyên liệu bị mềm quá",
    value: "ingredients-overcooked",
  },
  {
    categories: ["Món hấp"],
    label: "Chưa chín đều",
    value: "steamed-unevenly",
  },
  {
    categories: ["Món hấp"],
    label: "Món bị tanh",
    value: "fishy-smell",
  },
  {
    categories: ["Món hấp"],
    label: "Món bị khô",
    value: "too-dry",
  },
  {
    categories: ["Tráng miệng"],
    label: "Quá ngọt",
    value: "too-sweet",
  },
  {
    categories: ["Tráng miệng"],
    label: "Texture chưa đạt",
    value: "texture-failed",
  },
  {
    categories: ["Tráng miệng"],
    label: "Khó canh nhiệt",
    value: "temperature-control-hard",
  },
  {
    categories: ["Món chay"],
    label: "Vị hơi nhạt",
    value: "bland-flavor",
  },
  {
    categories: ["Món chay"],
    label: "Ăn chưa đủ no/thiếu đạm",
    value: "lacks-protein",
  },
];

export const FEEDBACK_ISSUE_VALUES = FEEDBACK_ISSUE_OPTIONS.map(
  ({ value }) => value,
);

export function getFeedbackIssueOptionsForCategory(category: RecipeCategory) {
  return FEEDBACK_ISSUE_OPTIONS.filter(
    ({ categories }) => categories === undefined || categories.includes(category),
  );
}

export const POST_COOKING_TOAST_KEY = "an-gi-gio-cooking-thank-you";
export const POST_COOKING_TOAST_MESSAGE =
  "Cảm ơn bạn! Lần sau mình sẽ gợi ý phù hợp hơn.";
