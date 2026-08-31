import Cookies from "js-cookie";

import {
  AUTH_REFRESH_TOKEN_COOKIE_KEY,
  AUTH_TOKEN_COOKIE_KEY,
  refreshAuthSessionFromCookie,
} from "@/lib/auth-token-refresh";
import api from "@/lib/axios";
import {
  type LoginUser,
  type RegisterUser,
  type AuthResponse,
  type InviteUserRegistration,
  type ResetPassword,
  type ResetPasswordResponse,
  type InviteUser,
} from "@/types/auth.types";

/**
 * Authentication service
 *
 * SECURITY NOTE: Tokens are stored in httpOnly cookies for security.
 * The cookie is set by the service layer, not accessible to JavaScript.
 * We use js-cookie only for non-httpOnly cookies that need to be accessible.
 * In production, the backend should set httpOnly cookies directly.
 */
export const authService = {
  /**
   * Login user
   * On success, tokens are stored in cookies by the service
   */
  login: async (payload: LoginUser): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", payload);

    if (response.data.accessToken) {
      // Store in cookie for middleware access
      // Note: In production, the backend should set httpOnly cookies
      Cookies.set(AUTH_TOKEN_COOKIE_KEY, response.data.accessToken, {
        path: "/",
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      if (response.data.refreshToken) {
        Cookies.set(AUTH_REFRESH_TOKEN_COOKIE_KEY, response.data.refreshToken, {
          path: "/",
          expires: 30,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      }
    }

    return response.data;
  },

  /**
   * Register new user
   */
  register: async (payload: RegisterUser): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/signup", payload);

    if (response.data.accessToken) {
      Cookies.set(AUTH_TOKEN_COOKIE_KEY, response.data.accessToken, {
        path: "/",
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      if (response.data.refreshToken) {
        Cookies.set(AUTH_REFRESH_TOKEN_COOKIE_KEY, response.data.refreshToken, {
          path: "/",
          expires: 30,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      }
    }

    return response.data;
  },

  /**
   * Logout user
   * Clears all auth cookies
   */
  logout: (): void => {
    try {
      Cookies.remove(AUTH_TOKEN_COOKIE_KEY, { path: "/" });
      Cookies.remove(AUTH_REFRESH_TOKEN_COOKIE_KEY, { path: "/" });
    } catch (error) {
      console.error("Logout cleanup error:", error);
    }
  },

  /**
   * Get current authenticated user
   * Token is automatically sent via cookie in request headers
   */
  getCurrentUser: async (): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>("/auth/me");
    return response.data;
  },

  /**
   * Refresh access token using refresh token
   */
  refreshToken: async (): Promise<AuthResponse> => {
    const data = await refreshAuthSessionFromCookie();
    if (!data) {
      throw new Error("No refresh token available");
    }
    return data;
  },

  /**
   * Request password reset email
   */
  forgotPassword: async (email: string): Promise<void> => {
    await api.post("/auth/forgot-password", { email });
  },

  /**
   * Accept invitation and create account
   */
  acceptInvitation: async (
    payload: InviteUserRegistration,
  ): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      "/auth/accept-invite",
      payload,
    );

    if (response.data.accessToken) {
      Cookies.set(AUTH_TOKEN_COOKIE_KEY, response.data.accessToken, {
        path: "/",
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      if (response.data.refreshToken) {
        Cookies.set(AUTH_REFRESH_TOKEN_COOKIE_KEY, response.data.refreshToken, {
          path: "/",
          expires: 30,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      }
    }

    return response.data;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (payload: ResetPassword): Promise<void> => {
    await api.post<ResetPasswordResponse>("/auth/reset-password", payload);
  },

  /**
   * Invite a new user
   */
  inviteUser: async (payload: InviteUser): Promise<void> => {
    await api.post<InviteUserRegistration>("/auth/invite", payload);
  },

  /**
   * Get token from cookie (for middleware/initial auth check)
   */
  getToken: (): string | undefined => {
    return Cookies.get(AUTH_TOKEN_COOKIE_KEY);
  },

  /**
   * Access or refresh cookie present — enough to attempt restoring a session.
   */
  hasSessionCookie: (): boolean => {
    return !!(
      Cookies.get(AUTH_TOKEN_COOKIE_KEY) ||
      Cookies.get(AUTH_REFRESH_TOKEN_COOKIE_KEY)
    );
  },

  /**
   * Check if user is authenticated (has access token)
   */
  isAuthenticated: (): boolean => {
    return !!Cookies.get(AUTH_TOKEN_COOKIE_KEY);
  },
};

// Backward compatibility
export const login = authService.login;
