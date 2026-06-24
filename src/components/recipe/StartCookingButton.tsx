"use client";

import { useRouter } from "next/navigation";

import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { useAuth } from "@/lib/auth/AuthProvider";

interface StartCookingButtonProps {
  recipeSlug: string;
}

export function StartCookingButton({
  recipeSlug,
}: StartCookingButtonProps) {
  const router = useRouter();
  const { requireAuth } = useAuth();

  function handleStartCooking() {
    requireAuth(() => {
      router.push(`/cong-thuc/${recipeSlug}/nau`);
    });
  }

  return (
    <ButtonPrimary
      type="button"
      onClick={handleStartCooking}
      className="mb-5 w-full"
    >
      Bắt đầu nấu
    </ButtonPrimary>
  );
}
