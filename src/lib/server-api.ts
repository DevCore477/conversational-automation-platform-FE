import axios from "axios";

import { resolveServerAccessToken } from "@/lib/server-auth-refresh";

const serverApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "https://api.gethexa.ai",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

serverApi.interceptors.request.use(async (config) => {
  const token = await resolveServerAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { serverApi };
