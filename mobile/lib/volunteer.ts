import { apiFetch } from "./api";

export async function submitVolunteer(data: {
  name: string;
  email: string;
  phone?: string;
  skills?: string;
  availability?: string;
  message?: string;
}): Promise<any> {
  return apiFetch("/volunteer", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
