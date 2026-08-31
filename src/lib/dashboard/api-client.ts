import { getCookie } from "@/lib/cookies";

export async function apiGet<T>(url: string): Promise<T> {
  // const token = document.cookie.split("auth-token=")[1] ?.split(";")[0];
  const token = getCookie("auth-token");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("API request failed");
  }

  return res.json();
}