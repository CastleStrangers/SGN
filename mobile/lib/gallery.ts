import { apiFetch } from "./api";

export async function getGalleryImages(limit: number = 50): Promise<any> {
  const data = await apiFetch(`/news?limit=${limit}&offset=0`);
  const posts = Array.isArray(data) ? data : data.posts || [];
  return posts.filter((p: any) => p.image);
}
