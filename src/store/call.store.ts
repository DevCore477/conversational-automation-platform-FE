import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getErrorMessage } from "@/lib/get-error-message";
import { callService } from "@/service/call.service";
import { type CallResponse, type MakeCall } from "@/types/call.types";

interface CallState {
  isLoading: boolean;
  error: string | null;
}

interface CallActions {
  makeCall: (payload: MakeCall) => Promise<CallResponse>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

type CallStore = CallState & CallActions;

export const useCallState = create<CallStore>()(
  persist(
    (set) => ({
      isLoading: false,
      error: null,

      makeCall: async (payload: MakeCall) => {
        try {
          set({ isLoading: true, error: null });

          const res = await callService.makeCall(payload);

          set({ isLoading: false });
          return res;
        } catch (err) {
          set({
            error: getErrorMessage(err, "Call failed"),
            isLoading: false,
          });
          throw err;
        }
      },

      clearError: () => set({ error: null }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: "call-storage",
      skipHydration: true,
    },
  ),
);
