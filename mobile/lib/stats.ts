import { apiFetch } from "./api";

export async function getStats(): Promise<{
  posts: number;
  users: number;
  events: number;
  totalViews: number;
}> {
  return apiFetch("/stats");
}
