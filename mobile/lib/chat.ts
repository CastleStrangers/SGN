import { apiFetch } from "./api";

export interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AISession {
  id: string;
  userId: string;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
}

export async function getAISessions(): Promise<AISession[]> {
  return apiFetch("/chat/ai");
}

export async function getAIMessages(sessionId: string): Promise<AISession> {
  return apiFetch(`/chat/ai?sessionId=${sessionId}`);
}

export async function translateMessage(text: string, to: string = "en"): Promise<string> {
  const data = await apiFetch("/chat/translate", {
    method: "POST",
    body: JSON.stringify({ text, to }),
  });
  return data.translated;
}

export async function summarizeConversation(sessionId: string, locale: string = "ar"): Promise<string> {
  const data = await apiFetch("/chat/summarize", {
    method: "POST",
    body: JSON.stringify({ sessionId, locale }),
  });
  return data.summary;
}

export async function sendAIMessage(
  message: string,
  sessionId?: string,
  locale: string = "ar"
): Promise<{ reply: string; sessionId: string }> {
  return apiFetch("/chat/ai", {
    method: "POST",
    body: JSON.stringify({ message, sessionId, locale }),
  });
}
