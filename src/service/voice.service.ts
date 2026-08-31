import api from "@/lib/axios";
import { type VoicesResponse } from "@/types/voice.types";

export const voiceService = {
  /**
   * Get all available voices from ElevenLabs
   */
  getVoices: async (): Promise<VoicesResponse> => {
    const response = await api.get<VoicesResponse>("/elevenlabs/voices");
    return response.data;
  },
};
