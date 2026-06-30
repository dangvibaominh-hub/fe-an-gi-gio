import { LoadingState } from "@/components/ui/LoadingState";

export default function RecipeResultsLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <LoadingState message="Đang tìm món hợp với nguyên liệu của bạn..." />
    </div>
  );
}
