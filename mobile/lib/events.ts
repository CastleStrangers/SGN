import { apiFetch } from "./api";

export async function getEvents(upcoming?: boolean): Promise<any[]> {
  const params = upcoming ? "?upcoming=true" : "";
  return apiFetch(`/events${params}`);
}

export async function getEvent(id: string): Promise<any> {
  const events = await apiFetch("/events");
  return events.find((e: any) => e.id === id) || null;
}
