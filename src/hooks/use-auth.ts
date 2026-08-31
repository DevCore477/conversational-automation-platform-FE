"use client";

import { useAuthStore } from "@/store/auth.store";

/**
 * useAuth Hook - Convenience hook for accessing auth state
 *
 * Note: This is a simple wrapper around useAuthStore.
 * For cross-store reactions, use the event system in AuthProvider.
 *
 * This hook does NOT trigger auth initialization.
 * Auth initialization happens once in AuthProvider.
 */
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const logout = useAuthStore((state) => state.logout);
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const acceptInvitation = useAuthStore((state) => state.acceptInvitation);
  const inviteUser = useAuthStore((state) => state.inviteUser);

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    acceptInvitation,
    inviteUser,
  };
}
