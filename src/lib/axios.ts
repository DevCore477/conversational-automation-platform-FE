import axios, { isAxiosError, type InternalAxiosRequestConfig } from "axios";

import {
  clearAuthSessionAndRedirect,
  isPublicAuthApiPath,
  refreshAuthSessionFromCookie,
  resolveClientAccessToken,
} from "@/lib/auth-token-refresh";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "https://api.gethexa.ai",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _authRetried?: boolean;
};

/** Shared promise so concurrent 401s wait on one refresh instead of racing to logout. */
let refreshAccessTokenPromise: Promise<string | null> | null = null;

function getRefreshAccessTokenPromise(): Promise<string | null> {
  if (!refreshAccessTokenPromise) {
    refreshAccessTokenPromise = refreshAuthSessionFromCookie()
      .then((session) => session?.accessToken ?? null)
      .finally(() => {
        refreshAccessTokenPromise = null;
      });
  }
  return refreshAccessTokenPromise;
}

api.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined" && !isPublicAuthApiPath(config.url)) {
      const token = await resolveClientAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!isAxiosError(error)) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    if (status === 403) {
      console.warn("Forbidden");
      return Promise.reject(error);
    }

    if (status !== 401) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (typeof window === "undefined") {
      return Promise.reject(error);
    }

    if (!originalRequest || isPublicAuthApiPath(originalRequest.url)) {
      return Promise.reject(error);
    }

    if (originalRequest._authRetried) {
      console.warn("Unauthorized after token refresh");
      clearAuthSessionAndRedirect();
      return Promise.reject(error);
    }

    originalRequest._authRetried = true;
    const token = await getRefreshAccessTokenPromise();

    if (!token) {
      console.warn("Unauthorized — refresh failed");
      clearAuthSessionAndRedirect();
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${token}`;
    return api.request(originalRequest);
  },
);

export default api;
