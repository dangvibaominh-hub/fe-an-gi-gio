import type { Metadata } from "next";

import { SavedRecipesView } from "@/app/da-luu/SavedRecipesView";

export const metadata: Metadata = {
  title: "Công thức đã lưu",
};

export default function SavedRecipesPage() {
  return <SavedRecipesView />;
}
