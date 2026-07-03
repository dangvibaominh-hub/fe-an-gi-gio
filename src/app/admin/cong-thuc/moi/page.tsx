import type { Metadata } from "next";

import { AdminRecipeForm } from "@/components/admin/AdminRecipeForm";

export const metadata: Metadata = { title: "Thêm công thức" };

export default function NewAdminRecipePage() {
  return <AdminRecipeForm />;
}
