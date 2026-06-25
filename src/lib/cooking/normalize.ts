import type {
  CookingFeedbackSummary,
  CookingSession,
  FeedbackIssue,
} from "@/lib/types/cookingSession";

const VALID_FEEDBACK_ISSUES = new Set<FeedbackIssue>([
  "cutting-meat-hard",
  "missing-ingredients",
  "oil-splatter",
  "took-longer-than-expected",
]);

export function normalizeFeedbackIssues(value: unknown): FeedbackIssue[] {
  if (value === null || value === undefined) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter(
      (issue): issue is FeedbackIssue =>
        typeof issue === "string" &&
        VALID_FEEDBACK_ISSUES.has(issue as FeedbackIssue),
    );
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) {
      return [];
    }

    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      const inner = trimmed.slice(1, -1).trim();

      if (!inner) {
        return [];
      }

      return inner
        .split(",")
        .map((part) => part.trim().replace(/^"|"$/g, ""))
        .filter(
          (issue): issue is FeedbackIssue =>
            VALID_FEEDBACK_ISSUES.has(issue as FeedbackIssue),
        );
    }

    if (trimmed.startsWith("[")) {
      try {
        return normalizeFeedbackIssues(JSON.parse(trimmed) as unknown);
      } catch {
        return [];
      }
    }

    if (VALID_FEEDBACK_ISSUES.has(trimmed as FeedbackIssue)) {
      return [trimmed as FeedbackIssue];
    }
  }

  return [];
}

function normalizeFeedbackSummary(
  feedback: CookingFeedbackSummary,
): CookingFeedbackSummary {
  return {
    ...feedback,
    issues: normalizeFeedbackIssues(feedback.issues),
  };
}

export function normalizeCookingSession(session: CookingSession): CookingSession {
  if (!session.feedback) {
    return session;
  }

  return {
    ...session,
    feedback: normalizeFeedbackSummary(session.feedback),
  };
}
