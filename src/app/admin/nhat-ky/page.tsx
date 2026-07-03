import type { Metadata } from "next";

import { AdminAuditLogList } from "@/components/admin/AdminAuditLogList";

export const metadata: Metadata = { title: "Nhật ký quản trị" };

export default function AdminAuditPage() {
  return <AdminAuditLogList />;
}
