import type { Metadata } from "next";

import { AdminRecipeForm } from "@/components/admin/AdminRecipeForm";

export const metadata: Metadata = { title: "Chỉnh sửa công thức" };

export default async function EditAdminRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminRecipeForm recipeId={id} />;
}
