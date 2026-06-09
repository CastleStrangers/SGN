import { apiFetch } from "./api";

export async function submitDonation(data: {
  name: string;
  email?: string;
  phone?: string;
  amount: number;
  message?: string;
  paymentMethod?: string;
}): Promise<any> {
  return apiFetch("/donate", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
