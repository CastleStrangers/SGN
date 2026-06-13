import { apiFetch } from "./api";

export interface DBNotification {
  id: string;
  userId: string;
  title: string;
  message: string | null;
  link: string | null;
  read: boolean;
  createdAt: string;
}

export async function getNotifications(): Promise<DBNotification[]> {
  return apiFetch("/notifications");
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiFetch("/notifications", {
    method: "PATCH",
    body: JSON.stringify({ id }),
  });
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiFetch("/notifications", {
    method: "PATCH",
    body: JSON.stringify({ id: "all" }),
  });
}

export async function getNotificationAISummary(locale: string = "ar"): Promise<string> {
  const data = await apiFetch(`/notifications/ai-summary?locale=${locale}`);
  return data.summary || "";
}
