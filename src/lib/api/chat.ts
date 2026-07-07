import { authorizedRequest } from "@/lib/auth/authorizedRequest";
import type {
  ChatConversation,
  ChatMessage,
  CreateChatConversationInput,
  SendChatMessageInput,
  SendChatMessageResult,
} from "@/lib/types/chat";

export function createChatConversation(
  input: CreateChatConversationInput = {},
) {
  return authorizedRequest<ChatConversation>({
    body: input,
    method: "POST",
    path: "/api/v1/chat/conversations",
  });
}

export function getChatConversationMessages(conversationId: string) {
  return authorizedRequest<ChatMessage[]>({
    method: "GET",
    path: `/api/v1/chat/conversations/${encodeURIComponent(conversationId)}/messages`,
  });
}

export function sendChatMessage(
  conversationId: string,
  input: SendChatMessageInput,
) {
  return authorizedRequest<SendChatMessageResult>({
    body: input,
    method: "POST",
    path: `/api/v1/chat/conversations/${encodeURIComponent(conversationId)}/messages`,
  });
}
