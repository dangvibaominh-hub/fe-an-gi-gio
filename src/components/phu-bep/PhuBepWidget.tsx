"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChefHat,
  LoaderCircle,
  MessageCircleMore,
  Send,
  Sparkles,
  X,
} from "lucide-react";

import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";
import { DifficultyBadge } from "@/components/recipe/DifficultyBadge";
import { getChatConversationMessages, sendChatMessage } from "@/lib/api/chat";
import { ApiRequestError } from "@/lib/api/errors";
import { createChatConversation } from "@/lib/api/chat";
import { getRecipeBySlug } from "@/lib/api/recipes";
import { useAuth } from "@/lib/auth/AuthProvider";
import type { ChatMessage } from "@/lib/types/chat";
import type { RecipeDetail } from "@/lib/types/recipe";

const QUICK_REPLIES = [
  "Món chay",
  "Dưới 30 phút",
  "Món cho người mới",
];

const WELCOME_TITLE = "Phụ Bếp";
const WELCOME_TEXT =
  "Mình có thể gợi ý món, giải thích cách nấu hoặc tìm công thức phù hợp từ dữ liệu hệ thống.";
const LOCKED_TEXT =
  "Phụ Bếp chỉ dành cho tài khoản đã đăng nhập. Đăng nhập xong mình sẽ giữ cuộc trò chuyện cho bạn.";

type UiMessage = ChatMessage & {
  isError?: boolean;
  isPending?: boolean;
};

type RecipePreviewMap = Record<string, RecipeDetail | null>;

const DEFAULT_INTRO_MESSAGES: UiMessage[] = [];

export function PhuBepWidget() {
  const { isAuthenticated, requireAuth, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<UiMessage[]>(DEFAULT_INTRO_MESSAGES);
  const [recipePreviews, setRecipePreviews] = useState<RecipePreviewMap>({});
  const [draft, setDraft] = useState("");
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [panelError, setPanelError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pendingDraftRef = useRef<string | null>(null);
  const fetchedRecipeSlugsRef = useRef<Set<string>>(new Set());
  const previousConversationStorageKeyRef = useRef<string | null>(null);

  const conversationStorageKey = useMemo(() => {
    if (!user?.id) {
      return null;
    }

    return `an-gi-gio-phu-bep-conversation-${user.id}`;
  }, [user?.id]);

  useEffect(() => {
    if (!isOpen || !isAuthenticated || conversationStorageKey === null) {
      return;
    }

    let cancelled = false;

    async function loadConversation() {
      const storageKey = conversationStorageKey;
      if (storageKey === null) {
        return;
      }

      const storedConversationId = window.localStorage.getItem(
        storageKey,
      );

      if (!storedConversationId) {
        setConversationId(null);
        setMessages([]);
        setPanelError(null);
        setIsLoadingConversation(false);
        return;
      }

      await Promise.resolve();

      if (cancelled) {
        return;
      }

      setIsLoadingConversation(true);
      setPanelError(null);

      void getChatConversationMessages(storedConversationId)
        .then((loadedMessages) => {
          if (cancelled) {
            return;
          }

          setConversationId(storedConversationId);
          setMessages(loadedMessages);
        })
        .catch((error: unknown) => {
          if (cancelled) {
            return;
          }

          if (error instanceof ApiRequestError && error.status === 404) {
            window.localStorage.removeItem(storageKey);
            setConversationId(null);
            setMessages([]);
            setRecipePreviews({});
            return;
          }

          setPanelError(
            error instanceof Error
              ? error.message
              : "Không thể tải lịch sử Phụ Bếp.",
          );
        })
        .finally(() => {
          if (!cancelled) {
            setIsLoadingConversation(false);
          }
        });
    }

    void loadConversation();

    return () => {
      cancelled = true;
    };
  }, [conversationStorageKey, isAuthenticated, isOpen]);

  useEffect(() => {
    let cancelled = false;

    async function resetConversationState() {
      const previousConversationStorageKey =
        previousConversationStorageKeyRef.current;

      if (previousConversationStorageKey !== null) {
        if (previousConversationStorageKey !== conversationStorageKey) {
          window.localStorage.removeItem(previousConversationStorageKey);
        }
      }

      previousConversationStorageKeyRef.current = conversationStorageKey;

      await Promise.resolve();

      if (cancelled) {
        return;
      }

      setConversationId(null);
      setMessages([]);
      setDraft("");
      setPanelError(null);
      setIsSending(false);
      setRecipePreviews({});
      fetchedRecipeSlugsRef.current = new Set();
    }

    void resetConversationState();

    return () => {
      cancelled = true;
    };
  }, [conversationStorageKey]);

  useEffect(() => {
    const recipeSlugs = new Set<string>();

    for (const message of messages) {
      if (message.role !== "assistant") {
        continue;
      }

      for (const reference of message.recipeReferences) {
        recipeSlugs.add(reference.slug);
      }
    }

    const unresolvedSlugs = Array.from(recipeSlugs).filter(
      (slug) => !fetchedRecipeSlugsRef.current.has(slug),
    );

    if (unresolvedSlugs.length === 0) {
      return;
    }

    let cancelled = false;

    void Promise.all(
      unresolvedSlugs.map(async (slug) => {
        try {
          const recipe = await getRecipeBySlug(slug);
          return { recipe, slug };
        } catch {
          return { recipe: null, slug };
        }
      }),
    ).then((results) => {
      if (cancelled) {
        return;
      }

      setRecipePreviews((current) => {
        const next = { ...current };

        for (const { recipe, slug } of results) {
          fetchedRecipeSlugsRef.current.add(slug);
          next[slug] = recipe;
        }

        return next;
      });
    });

    return () => {
      cancelled = true;
    };
  }, [messages]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return;
    }

    scrollContainer.scrollTop = scrollContainer.scrollHeight;
  }, [messages, isLoadingConversation, isSending]);

  async function handleSubmitMessage(nextMessage: string) {
    const content = nextMessage.trim();

    if (!content || isSending || isLoadingConversation) {
      return;
    }

    if (!isAuthenticated) {
      pendingDraftRef.current = content;
      requireAuth(() => {
        setIsOpen(true);
        if (pendingDraftRef.current) {
          setDraft(pendingDraftRef.current);
        }
      });
      return;
    }

    setIsSending(true);
    setPanelError(null);
    setIsOpen(true);

    const localUserMessage: UiMessage = {
      conversationId: conversationId ?? "pending",
      content,
      createdAt: new Date().toISOString(),
      id: `local-user-${Date.now()}`,
      isPending: true,
      latencyMs: null,
      model: null,
      recipeReferences: [],
      role: "user",
      tokenCount: null,
    };

    setMessages((current) => [...current, localUserMessage]);
    setDraft("");

    try {
      let activeConversationId = conversationId;

      if (!activeConversationId) {
        const conversation = await createChatConversation({
          title: WELCOME_TITLE,
        });
        activeConversationId = conversation.id;
        setConversationId(activeConversationId);

        if (conversationStorageKey) {
          window.localStorage.setItem(conversationStorageKey, conversation.id);
        }
      }

      const result = await sendChatMessage(activeConversationId, {
        content,
      });

      setConversationId(result.conversation.id);

      if (conversationStorageKey) {
        window.localStorage.setItem(conversationStorageKey, result.conversation.id);
      }

      setMessages((current) => {
        const withoutPending = current.filter(
          (message) => message.id !== localUserMessage.id,
        );

        return [...withoutPending, result.userMessage, result.assistantMessage];
      });
    } catch (error) {
      setMessages((current) =>
        current.filter((message) => message.id !== localUserMessage.id),
      );

      if (error instanceof ApiRequestError && error.status === 401) {
        pendingDraftRef.current = content;
        requireAuth(() => setIsOpen(true));
        setPanelError("Bạn cần đăng nhập để dùng Phụ Bếp.");
      } else {
        setPanelError(
          error instanceof Error
            ? error.message
            : "Không thể gửi tin nhắn Phụ Bếp.",
        );
      }
    } finally {
      setIsSending(false);
    }
  }

  function handleQuickReply(reply: string) {
    void handleSubmitMessage(reply);
  }

  function handleTriggerClick() {
    if (!isAuthenticated) {
      pendingDraftRef.current = null;
      requireAuth(() => setIsOpen(true));
      return;
    }

    setIsOpen((currentValue) => !currentValue);
  }

  return (
    <>
      {isOpen ? (
        <section
          aria-label="Phụ Bếp"
          className="fixed bottom-4 right-4 z-[90] w-[calc(100vw-2rem)] max-w-[24rem] overflow-hidden rounded-3xl border border-terracotta/20 bg-white shadow-[0_24px_80px_rgba(43,36,32,0.22)] sm:bottom-6 sm:right-6 sm:w-[24rem]"
        >
          <header className="flex items-start justify-between gap-3 border-b border-terracotta/10 bg-gradient-to-r from-terracotta/12 to-mustard/12 px-4 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-terracotta to-mustard text-white shadow-warm">
                <ChefHat className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-base font-bold text-charcoal">
                  Phụ Bếp
                </p>
                <p className="text-xs text-charcoal/60">
                  Luôn sẵn sàng gợi ý món ngon
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Đóng Phụ Bếp"
              onClick={() => setIsOpen(false)}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-charcoal transition hover:bg-terracotta/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </header>

          <div className="flex h-[min(72vh,40rem)] flex-col bg-cream/25">
            <div
              ref={scrollContainerRef}
              className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
            >
              {!isAuthenticated ? (
                <LockedPrompt onLogin={() => requireAuth(() => setIsOpen(true))} />
              ) : null}

              {isAuthenticated && isLoadingConversation ? (
                <TypingCard text="Đang tải cuộc trò chuyện..." />
              ) : null}

              {isAuthenticated && !isLoadingConversation && messages.length === 0 ? (
                <IntroCard onQuickReply={handleQuickReply} />
              ) : null}

              {messages.map((message) => (
                <ChatMessageBubble
                  key={message.id}
                  message={message}
                  recipePreviews={recipePreviews}
                />
              ))}

              {isSending ? <TypingCard text="Phụ Bếp đang trả lời..." /> : null}
            </div>

            <div className="border-t border-terracotta/10 bg-white/95 px-4 py-3 backdrop-blur">
              {panelError ? (
                <p className="mb-3 rounded-2xl bg-terracotta/10 px-3 py-2 text-sm text-terracotta">
                  {panelError}
                </p>
              ) : null}

              {isAuthenticated ? (
                <form
                  className="space-y-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void handleSubmitMessage(draft);
                  }}
                >
                  <div className="flex items-center gap-2 rounded-full border border-terracotta/20 bg-cream px-3 py-2 shadow-sm">
                    <input
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      placeholder="Hỏi Phụ Bếp điều bạn đang băn khoăn"
                      className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-charcoal outline-none placeholder:text-charcoal/45"
                    />
                    <button
                      type="submit"
                      disabled={isSending || isLoadingConversation || !draft.trim()}
                      className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-terracotta to-mustard text-white shadow-warm transition hover:brightness-105 disabled:pointer-events-none disabled:opacity-40"
                      aria-label="Gửi tin nhắn"
                    >
                      {isSending ? (
                        <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <Send className="size-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {QUICK_REPLIES.map((reply) => (
                      <button
                        key={reply}
                        type="button"
                        onClick={() => handleQuickReply(reply)}
                        className="rounded-full border border-terracotta/15 bg-terracotta/5 px-3 py-1.5 text-xs font-semibold text-charcoal transition hover:border-terracotta/30 hover:bg-terracotta/10"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <ButtonPrimary className="w-full" onClick={() => requireAuth(() => setIsOpen(true))}>
                    Đăng nhập để dùng Phụ Bếp
                  </ButtonPrimary>
                  <p className="text-xs leading-5 text-charcoal/60">
                    {LOCKED_TEXT}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {!isOpen ? (
        <button
          type="button"
          title="Phụ Bếp"
          aria-label="Mở Phụ Bếp"
          onClick={handleTriggerClick}
          className="fixed bottom-4 right-4 z-[91] inline-flex size-14 items-center justify-center rounded-full bg-gradient-to-r from-terracotta to-mustard text-white shadow-[0_18px_45px_rgba(226,114,91,0.35)] transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta sm:bottom-6 sm:right-6"
        >
          <MessageCircleMore className="size-6" aria-hidden="true" />
        </button>
      ) : null}
    </>
  );
}

interface IntroCardProps {
  onQuickReply: (reply: string) => void;
}

function IntroCard({ onQuickReply }: IntroCardProps) {
  return (
    <div className="rounded-3xl border border-terracotta/10 bg-white px-4 py-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-2xl bg-sage/15 text-sage">
          <Sparkles className="size-4" aria-hidden="true" />
        </span>
        <div>
          <p className="font-semibold text-charcoal">{WELCOME_TITLE}</p>
          <p className="mt-1 text-sm leading-6 text-charcoal/70">{WELCOME_TEXT}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {QUICK_REPLIES.map((reply) => (
          <button
            key={reply}
            type="button"
            onClick={() => onQuickReply(reply)}
            className="rounded-full border border-terracotta/15 bg-terracotta/5 px-3 py-1.5 text-xs font-semibold text-charcoal transition hover:border-terracotta/30 hover:bg-terracotta/10"
          >
            {reply}
          </button>
        ))}
      </div>
    </div>
  );
}

interface LockedPromptProps {
  onLogin: () => void;
}

function LockedPrompt({ onLogin }: LockedPromptProps) {
  return (
    <div className="rounded-3xl border border-terracotta/10 bg-white px-4 py-4 shadow-sm">
      <p className="text-sm font-semibold text-charcoal">Cần đăng nhập</p>
      <p className="mt-1 text-sm leading-6 text-charcoal/70">{LOCKED_TEXT}</p>
      <ButtonSecondary className="mt-4 w-full" onClick={onLogin}>
        Đăng nhập
      </ButtonSecondary>
    </div>
  );
}

interface TypingCardProps {
  text: string;
}

function TypingCard({ text }: TypingCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-3xl border border-terracotta/10 bg-white px-4 py-4 shadow-sm">
      <span className="inline-flex size-9 items-center justify-center rounded-2xl bg-terracotta/10 text-terracotta">
        <ChefHat className="size-4" aria-hidden="true" />
      </span>
      <div className="flex min-w-0 flex-col gap-2">
        <p className="text-sm font-medium text-charcoal">{text}</p>
        <div className="flex items-center gap-1.5" aria-label="Đang nhập">
          <span className="size-2 rounded-full bg-terracotta/60 animate-[pulse_1s_ease-in-out_infinite]" />
          <span className="size-2 rounded-full bg-terracotta/60 animate-[pulse_1s_ease-in-out_150ms_infinite]" />
          <span className="size-2 rounded-full bg-terracotta/60 animate-[pulse_1s_ease-in-out_300ms_infinite]" />
        </div>
      </div>
    </div>
  );
}

interface ChatMessageBubbleProps {
  message: UiMessage;
  recipePreviews: RecipePreviewMap;
}

function ChatMessageBubble({
  message,
  recipePreviews,
}: ChatMessageBubbleProps) {
  const isUser = message.role === "user";
  const previewCards = message.recipeReferences
    .map((reference) => ({
      reference,
      recipe: recipePreviews[reference.slug] ?? null,
    }))
    .filter(({ recipe }) => recipe !== null);

  return (
    <article
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[88%] rounded-3xl px-4 py-3 shadow-sm ${
          isUser
            ? "bg-gradient-to-r from-terracotta to-mustard text-white"
            : "border border-terracotta/10 bg-white text-charcoal"
        } ${message.isPending ? "opacity-80" : ""}`}
      >
        <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>

        {message.isError ? (
          <p className="mt-2 text-xs text-terracotta">
            Tin nhắn này không gửi được.
          </p>
        ) : null}

        {previewCards.length > 0 ? (
          <div className="mt-3 space-y-3">
            {previewCards.map(({ recipe, reference }) => (
              <ChatRecipeCard
                key={reference.slug}
                recipe={recipe}
                reference={reference}
              />
            ))}
          </div>
        ) : null}

        {!isUser && message.recipeReferences.length > 0 && previewCards.length === 0 ? (
          <div className="mt-3 space-y-3">
            {message.recipeReferences.map((reference) => (
              <Link
                key={reference.slug}
                href={`/cong-thuc/${reference.slug}`}
                className="block rounded-2xl border border-terracotta/10 bg-cream px-3 py-3 text-sm font-semibold text-charcoal transition hover:border-terracotta/25 hover:bg-terracotta/5"
              >
                <p className="truncate">{reference.title}</p>
                <p className="mt-1 text-xs font-normal text-charcoal/60">
                  Xem chi tiết công thức
                </p>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

interface ChatRecipeCardProps {
  recipe: RecipeDetail | null;
  reference: ChatMessage["recipeReferences"][number];
}

function ChatRecipeCard({ recipe, reference }: ChatRecipeCardProps) {
  if (!recipe) {
    return (
      <Link
        href={`/cong-thuc/${reference.slug}`}
        className="block overflow-hidden rounded-2xl border border-terracotta/10 bg-cream transition hover:border-terracotta/25 hover:bg-terracotta/10"
      >
        <div className="px-3 py-3">
          <p className="line-clamp-2 text-sm font-semibold text-charcoal">
            {reference.title}
          </p>
          <p className="mt-1 text-xs text-charcoal/55">Xem chi tiết công thức</p>
        </div>
      </Link>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-terracotta/10 bg-cream shadow-sm">
      <div className="grid grid-cols-[88px_1fr] gap-3 p-3">
        <div className="relative h-20 overflow-hidden rounded-2xl bg-white">
          <Image
            src={recipe.image}
            alt={recipe.imageAlt}
            fill
            sizes="88px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0">
          <p className="line-clamp-2 text-sm font-semibold text-charcoal">
            {recipe.title}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <DifficultyBadge difficulty={recipe.difficulty} mode="badge" />
          </div>
          <p className="mt-2 text-xs text-charcoal/60">
            {recipe.cookTimeMinutes} phút • {recipe.category}
          </p>
        </div>
      </div>

      <div className="border-t border-terracotta/10 px-3 py-3">
        <Link
          href={`/cong-thuc/${recipe.slug}`}
          className="inline-flex rounded-full bg-terracotta/10 px-3 py-1.5 text-xs font-semibold text-terracotta transition hover:bg-terracotta/15"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
}
