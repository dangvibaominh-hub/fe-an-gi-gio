import type { Metadata } from "next";

import { AdminRecipeList } from "@/components/admin/AdminRecipeList";

export const metadata: Metadata = { title: "Quản lý công thức" };

export default function AdminRecipesPage() {
  return <AdminRecipeList />;
}
