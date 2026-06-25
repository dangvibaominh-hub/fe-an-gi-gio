import { authorizedRequest } from "@/lib/auth/authorizedRequest";
import type { UpdateProfileRequest, User } from "@/lib/types/auth";
import type { PersonalizationInsight } from "@/lib/types/personalization";

export async function updateProfile(
  request: UpdateProfileRequest,
): Promise<User> {
  return authorizedRequest<User>({
    body: request,
    method: "PATCH",
    path: "/api/v1/me",
  });
}

export async function getPersonalization(): Promise<PersonalizationInsight> {
  return authorizedRequest<PersonalizationInsight>({
    method: "GET",
    path: "/api/v1/me/personalization",
  });
}
