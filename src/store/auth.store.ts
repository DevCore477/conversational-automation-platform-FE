import { create } from "zustand";
import { persist } from "zustand/middleware";

import { setFavicon } from "@/lib/set-favicon";
import { authService } from "@/service/auth.service";
import {
  type User,
  type LoginUser,
  type RegisterUser,
  type InviteUserRegistration,
  type ResetPassword,
  type InviteUser,
  type WhatsAppConfig,
} from "@/types/auth.types";

/**
 * Auth events - Used to break store-to-store coupling
 * Components can subscribe to these events instead of direct store access
 */
export type AuthEvent =
  | { type: "LOGIN"; user: User }
  | { type: "LOGOUT" }
  | { type: "USER_LOADED"; user: User }
  | { type: "AUTH_ERROR"; error: string };

type AuthEventListener = (event: AuthEvent) => void;

const eventListeners: AuthEventListener[] = [];

export function subscribeToAuthEvents(listener: AuthEventListener) {
  eventListeners.push(listener);
  return () => {
    const index = eventListeners.indexOf(listener);
    if (index > -1) {
      eventListeners.splice(index, 1);
    }
  };
}

function emitAuthEvent(event: AuthEvent) {
  eventListeners.forEach((listener) => listener(event));
}

/**
 * Minimal Auth State
 *
 * Principles:
 * - No loading states (handle in components)
 * - No error states (handle in components)
 * - No token in state (stored in httpOnly cookie)
 * - Only user info and auth status
 */
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  whatsappConfig: WhatsAppConfig | null;
}

interface AuthActions {
  // Auth operations
  login: (credentials: LoginUser) => Promise<void>;
  register: (userData: RegisterUser) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;

  // Additional auth flows
  acceptInvitation: (userData: InviteUserRegistration) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (payload: ResetPassword) => Promise<void>;
  inviteUser: (payload: InviteUser) => Promise<void>;

  // Direct state manipulation (for edge cases)
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // State
      user: null,
      isAuthenticated: false,
      whatsappConfig: null,

      // Actions
      login: async (credentials: LoginUser) => {
        const response = await authService.login(credentials);

        set({
          user: response.user,
          isAuthenticated: true,
          whatsappConfig: response.whatsapp ?? null,
        });

        emitAuthEvent({ type: "LOGIN", user: response.user });
      },

      register: async (userData: RegisterUser) => {
        const response = await authService.register(userData);

        set({
          user: response.user,
          isAuthenticated: true,
          whatsappConfig: response.whatsapp ?? null,
        });

        emitAuthEvent({ type: "LOGIN", user: response.user });
      },

      acceptInvitation: async (userData: InviteUserRegistration) => {
        const response = await authService.acceptInvitation(userData);

        set({
          user: response.user,
          isAuthenticated: true,
          whatsappConfig: response.whatsapp ?? null,
        });

        emitAuthEvent({ type: "LOGIN", user: response.user });
      },

      logout: () => {
        try {
          // Clear auth cookies
          authService.logout();

          // Reset favicon
          setFavicon();

          // Clear state
          set({
            user: null,
            isAuthenticated: false,
            whatsappConfig: null,
          });

          // Emit event for other stores/components
          emitAuthEvent({ type: "LOGOUT" });
        } catch (error) {
          console.error("Logout error:", error);
          // Still clear state even if service fails
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },

      loadUser: async () => {
        if (!authService.hasSessionCookie()) {
          set({ isAuthenticated: false });
          return;
        }

        try {
          const response = await authService.getCurrentUser();

          set({
            user: response.user,
            isAuthenticated: true,
            whatsappConfig: response.whatsapp ?? null,
          });

          emitAuthEvent({ type: "USER_LOADED", user: response.user });
        } catch (err) {
          console.error("[auth.store] loadUser failed:", err);

          // Keep the session when a refresh token remains — axios may still be
          // renewing the access token (slow refresh / concurrent 401 recovery).
          if (!authService.hasSessionCookie()) {
            authService.logout();
            set({
              user: null,
              isAuthenticated: false,
            });
            emitAuthEvent({ type: "AUTH_ERROR", error: "Failed to load user" });
          }
        }
      },

      forgotPassword: async (email: string) => {
        await authService.forgotPassword(email);
      },

      resetPassword: async (payload: ResetPassword) => {
        await authService.resetPassword(payload);
      },

      inviteUser: async (payload: InviteUser) => {
        await authService.inviteUser(payload);
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },

      setAuthenticated: (isAuthenticated: boolean) => {
        set({ isAuthenticated });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        whatsappConfig: state.whatsappConfig,
      }),
      skipHydration: true,
    },
  ),
);

/**
 * Hook to subscribe to auth events
 * Use this in components that need to react to auth changes
 * instead of direct store-to-store coupling
 */
export function useAuthEvents(listener: AuthEventListener) {
  const unsubscribe = subscribeToAuthEvents(listener);

  // Cleanup on unmount
  return unsubscribe;
}
