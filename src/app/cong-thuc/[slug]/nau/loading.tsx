import { LoadingState } from "@/components/ui/LoadingState";

export default function CookingModeLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fff8ec]">
      <LoadingState message="Đang chuẩn bị chế độ nấu..." />
    </div>
  );
}
