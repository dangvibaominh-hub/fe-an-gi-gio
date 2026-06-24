import { LoadingState } from "@/components/ui/LoadingState";

export default function ExploreRecipesLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <LoadingState message="Đang tải danh mục công thức..." />
    </div>
  );
}
