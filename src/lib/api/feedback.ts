import { authorizedRequest } from "@/lib/auth/authorizedRequest";
import type { SubmitFeedbackRequest } from "@/lib/types/cookingSession";

export async function submitCookingFeedback(
  sessionId: string,
  request: SubmitFeedbackRequest,
): Promise<void> {
  await authorizedRequest<unknown>({
    body: request,
    method: "POST",
    path: `/api/v1/cooking-sessions/${encodeURIComponent(sessionId)}/feedback`,
  });
}
