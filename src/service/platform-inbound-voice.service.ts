import api from "@/lib/axios";
import {
  type PlatformInboundPhoneRoute,
  type PlatformInboundVoiceConfig,
  type UpsertPlatformInboundVoiceDto,
  type UpsertPlatformPhoneRouteDto,
} from "@/types/platform-inbound-voice.types";

export const platformInboundVoiceService = {
  getConfig: async (): Promise<PlatformInboundVoiceConfig | null> => {
    const response = await api.get<PlatformInboundVoiceConfig | null>(
      "/platform/inbound-voice",
    );
    return response.data ?? null;
  },

  upsert: async (
    dto: UpsertPlatformInboundVoiceDto,
  ): Promise<PlatformInboundVoiceConfig> => {
    const response = await api.put<PlatformInboundVoiceConfig>(
      "/platform/inbound-voice",
      dto,
    );
    return response.data;
  },

  listPhoneRoutes: async (): Promise<PlatformInboundPhoneRoute[]> => {
    const response = await api.get<PlatformInboundPhoneRoute[]>(
      "/platform/inbound-voice/phone-routes",
    );
    return response.data ?? [];
  },

  upsertPhoneRoute: async (
    dto: UpsertPlatformPhoneRouteDto,
  ): Promise<PlatformInboundPhoneRoute> => {
    const response = await api.put<PlatformInboundPhoneRoute>(
      "/platform/inbound-voice/phone-routes",
      dto,
    );
    return response.data;
  },

  deactivatePhoneRoute: async (routeId: string): Promise<void> => {
    await api.delete(`/platform/inbound-voice/phone-routes/${routeId}`);
  },
};