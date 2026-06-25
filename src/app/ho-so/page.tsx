import type { Metadata } from "next";
import { Suspense } from "react";

import { ProfileView } from "@/app/ho-so/ProfileView";
import { LoadingState } from "@/components/ui/LoadingState";

export const metadata: Metadata = {
  title: "Hồ sơ",
};

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[calc(100vh-80px)] bg-[#fff8ec]">
          <div className="mx-auto max-w-5xl px-4 py-14">
            <LoadingState message="Đang tải hồ sơ..." />
          </div>
        </main>
      }
    >
      <ProfileView />
    </Suspense>
  );
}
