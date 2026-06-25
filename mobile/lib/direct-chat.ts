import { apiFetch } from "./api";

export interface ChatMsg {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  member: { id: string; nameAr: string; nameNl: string; avatar: string | null };
  lastMessage: string | null;
  unreadCount: number;
  lastMessageAt: string | null;
}

export async function getConversations(): Promise<Conversation[]> {
  return apiFetch("/chat/conversations");
}

export async function getMessages(partnerId: string): Promise<ChatMsg[]> {
  return apiFetch(`/chat/messages?with=${partnerId}`);
}

export async function sendMessage(receiverId: string, message: string): Promise<ChatMsg> {
  return apiFetch("/chat/send", {
    method: "POST",
    body: JSON.stringify({ receiverId, message }),
  });
}
