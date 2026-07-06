export type ChatConversationStatus = "ACTIVE" | "ARCHIVED";
export type ChatMessageRole = "user" | "assistant";

export interface ChatRecipeReference {
  id: string;
  slug: string;
  title: string;
}

export interface ChatConversation {
  id: string;
  userId: string;
  title: string;
  status: ChatConversationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: ChatMessageRole;
  content: string;
  recipeReferences: ChatRecipeReference[];
  model: string | null;
  latencyMs: number | null;
  tokenCount: number | null;
  createdAt: string;
}

export interface CreateChatConversationInput {
  title?: string;
}

export interface SendChatMessageInput {
  content: string;
}

export interface SendChatMessageResult {
  conversation: ChatConversation;
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
}
