import { authorizedRequest } from "@/lib/auth/authorizedRequest";
import type {
  CookingFeedbackOption,
  SubmitFeedbackRequest,
} from "@/lib/types/cookingSession";

interface CookingFeedbackOptionsResponse {
  issues: CookingFeedbackOption[];
}

const feedbackOptionsCache = new Map<string, CookingFeedbackOption[]>();
const feedbackOptionsRequests = new Map<
  string,
  Promise<CookingFeedbackOption[]>
>();

export function getCachedCookingFeedbackOptions(sessionId: string) {
  return feedbackOptionsCache.get(sessionId);
}

export async function getCookingFeedbackOptions(
  sessionId: string,
): Promise<CookingFeedbackOption[]> {
  const cachedOptions = feedbackOptionsCache.get(sessionId);
  if (cachedOptions) {
    return cachedOptions;
  }

  const pendingRequest = feedbackOptionsRequests.get(sessionId);
  if (pendingRequest) {
    return pendingRequest;
  }

  const request = authorizedRequest<CookingFeedbackOptionsResponse>({
    method: "GET",
    path: `/api/v1/cooking-sessions/${encodeURIComponent(sessionId)}/feedback/options`,
  })
    .then((response) => {
      feedbackOptionsCache.set(sessionId, response.issues);
      return response.issues;
    })
    .finally(() => {
      feedbackOptionsRequests.delete(sessionId);
    });

  feedbackOptionsRequests.set(sessionId, request);
  return request;
}

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
