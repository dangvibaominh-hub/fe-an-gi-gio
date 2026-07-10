import { HomePageClient } from "@/components/home/HomePageClient";
import { listRecipes } from "@/lib/api/recipes";
import { DEFAULT_RECIPE_LIST_LIMIT } from "@/lib/constants/recipe";

export default async function HomePage() {
  const { items: recipes } = await listRecipes({
    limit: DEFAULT_RECIPE_LIST_LIMIT,
  });

  return (
    <div className="flex-1">
      <HomePageClient recipes={recipes} />
    </div>
  );
}
