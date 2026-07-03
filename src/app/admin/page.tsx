import type { Metadata } from "next";

import { AdminOverview } from "@/components/admin/AdminOverview";

export const metadata: Metadata = { title: "Quản trị" };

export default function AdminPage() {
  return <AdminOverview />;
}
