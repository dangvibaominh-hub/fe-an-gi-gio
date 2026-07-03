import type { Metadata } from "next";

import { AdminUserList } from "@/components/admin/AdminUserList";

export const metadata: Metadata = { title: "Quản lý tài khoản" };

export default function AdminUsersPage() {
  return <AdminUserList />;
}
