import type { Metadata } from "next";

import { AdminRecipeDetailView } from "@/components/admin/AdminRecipeDetailView";

export const metadata: Metadata = { title: "Chi tiết công thức" };

export default async function AdminRecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminRecipeDetailView recipeId={id} />;
}
