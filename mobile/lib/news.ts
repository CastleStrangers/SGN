import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiFetch } from "./api";

const FAVORITES_KEY = "favorites_sync";

export async function getNews(page: number = 1, category?: string, locale: string = "ar"): Promise<any> {
  const params = new URLSearchParams({ limit: "20", offset: String((page - 1) * 20), locale });
  if (category) params.set("category", category);
  return apiFetch(`/news?${params}`);
}

export async function getNewsDetail(slug: string): Promise<any> {
  return apiFetch(`/news?slug=${encodeURIComponent(slug)}`);
}

export async function getFavorites(): Promise<any[]> {
  return apiFetch("/mobile/favorites");
}

export async function addFavorite(postId: string): Promise<void> {
  await apiFetch("/mobile/favorites", {
    method: "POST",
    body: JSON.stringify({ postId }),
  });
}

export async function removeFavorite(postId: string): Promise<void> {
  await apiFetch("/mobile/favorites", {
    method: "DELETE",
    body: JSON.stringify({ postId }),
  });
}

export async function registerPushToken(token: string): Promise<void> {
  await apiFetch("/mobile/notifications/register", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}
