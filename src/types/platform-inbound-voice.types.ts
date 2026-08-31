/**
 * Platform inbound voice routing (Twilio /webhook/inbound when number has no company mapping).
 * Mirrors Nest `PlatformInboundVoiceController` and `UpsertPlatformInboundVoiceSchema`.
 */
export type PlatformInboundRoutingMode =
  | "agent"
  | "flow"
  | "script"
  | "database_default";

export interface PlatformInboundVoiceConfig {
  id?: string;
  platformCompanyId: string | null;
  routingMode: PlatformInboundRoutingMode;
  agentId: string | null;
  flowId: string | null;
  scriptId: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpsertPlatformInboundVoiceDto {
  platformCompanyId?: string | null;
  routingMode: PlatformInboundRoutingMode;
  agentId?: string | null;
  flowId?: string | null;
  scriptId?: string | null;
}

export interface PlatformInboundPhoneRoute {
  id?: string;
  platformCompanyId: string | null;
  routingMode: PlatformInboundRoutingMode;
  agentId: string | null;
  flowId: string | null;
  scriptId: string | null;
  phoneNumber: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  agent?: { id: string; name: string | null } | null;
  callScript?: { id: string; name: string | null } | null;
  flow?: { id: string; name: string | null } | null;
  company?: { id: string; name: string | null } | null;
}

export interface UpsertPlatformPhoneRouteDto {
  phoneNumber: string;
  platformCompanyId: string;
  routingMode: PlatformInboundRoutingMode;
  agentId?: string | null;
  flowId?: string | null;
  scriptId?: string | null;
}
