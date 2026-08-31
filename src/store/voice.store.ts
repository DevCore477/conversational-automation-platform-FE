import { create } from "zustand";

import { getErrorMessage } from "@/lib/get-error-message";
import { agentService } from "@/service/agent.service";
import { voiceService } from "@/service/voice.service";
import { type Voice } from "@/types/voice.types";

interface VoiceState {
  voices: Voice[];
  defaultVoiceId: string | null;
  isLoading: boolean;
  error: string | null;
}

interface VoiceActions {
  fetchVoices: () => Promise<void>;
  fetchAgentVoice: () => Promise<string | null>;
  clearError: () => void;
}

type VoiceStore = VoiceState & VoiceActions;

export const useVoiceStore = create<VoiceStore>((set) => ({
  voices: [],
  defaultVoiceId: null,
  isLoading: false,
  error: null,

  fetchVoices: async () => {
    try {
      set({ isLoading: true, error: null });

      // Fetch voices and agent info in parallel
      const [voicesResponse, agentVoiceId] = await Promise.all([
        voiceService.getVoices(),
        agentService
          .getAgentInfo()
          .then((info) => info.conversation_config.tts.voice_id)
          .catch(() => null),
      ]);

      set({
        voices: voicesResponse.voices,
        defaultVoiceId: agentVoiceId || voicesResponse.defaultVoiceId || null,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: getErrorMessage(err, "Failed to fetch voices"),
        isLoading: false,
      });
      throw err;
    }
  },

  fetchAgentVoice: async () => {
    try {
      const agentInfo = await agentService.getAgentInfo();
      const voiceId = agentInfo.conversation_config.tts.voice_id;
      set({ defaultVoiceId: voiceId });
      return voiceId;
    } catch (err) {
      set({
        error: getErrorMessage(err, "Failed to fetch agent voice"),
      });
      return null;
    }
  },

  clearError: () => set({ error: null }),
}));
