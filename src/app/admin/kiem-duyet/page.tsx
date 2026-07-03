import type { Metadata } from "next";

import { AdminModerationQueue } from "@/components/admin/AdminModerationQueue";

export const metadata: Metadata = { title: "Kiểm duyệt công thức AI" };

export default function AdminModerationPage() {
  return <AdminModerationQueue />;
}
