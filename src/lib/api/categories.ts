import { apiGet } from "@/lib/api/client";
import type { Category } from "@/lib/types/category";

export async function listCategories(): Promise<Category[]> {
  const response = await apiGet<Category[]>("/api/v1/categories");

  return response.data;
}
