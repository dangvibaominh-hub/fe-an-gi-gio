import { LoadingState } from "@/components/ui/LoadingState";

export default function RecipeDetailLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <LoadingState message="Đang tải chi tiết công thức..." />
    </div>
  );
}
