import type { Metadata } from "next";

import { CookingHistoryView } from "@/app/lich-su/CookingHistoryView";

export const metadata: Metadata = {
  title: "Lịch sử nấu",
};

export default function CookingHistoryPage() {
  return <CookingHistoryView />;
}
