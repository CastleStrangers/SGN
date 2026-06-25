import { apiFetch } from "./api";

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewer: { name: string | null; image: string | null };
}

export async function getServiceReviews(memberId: string): Promise<Review[]> {
  const data = await apiFetch(`/members/services/${memberId}/reviews`);
  return data.reviews || [];
}

export async function submitReview(memberId: string, rating: number, comment: string): Promise<Review> {
  const data = await apiFetch(`/members/services/${memberId}/reviews`, {
    method: "POST",
    body: JSON.stringify({ rating, comment }),
  });
  return data.review;
}
