import { LoadingState } from "@/components/ui/LoadingState";

export default function RecipeResultsLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <LoadingState message="Đang sắp xếp công thức từ dễ đến khó..." />
    </div>
  );
}
