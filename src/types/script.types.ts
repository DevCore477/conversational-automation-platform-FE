export interface CallScript {
  id: string;
  name: string;
  script: string;
  description: string | null;
  firstMessage: string | null;
  model: string;
  voiceId: string | null;
  callType: "inbound" | "outbound" | "both";
  isActive: boolean;
  isDefault: boolean;
  // Usage statistics
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  lastUsedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScriptDto {
  name: string;
  script: string;
  description?: string;
  firstMessage?: string;
  model?: string;
  voiceId?: string;
  callType: "inbound" | "outbound" | "both";
  isActive?: boolean;
  isDefault?: boolean;
  companyId?: string;
}

export interface UpdateScriptDto {
  name?: string;
  script?: string;
  description?: string;
  firstMessage?: string;
  model?: string;
  voiceId?: string;
  callType?: "inbound" | "outbound" | "both";
  isActive?: boolean;
  companyId?: string;
}

export interface ScriptStats {
  total: number;
  active: number;
  inactive: number;
  byCallType: {
    inbound: number;
    outbound: number;
    both: number;
  };
  hasDefault: boolean;
}

export interface ScriptUsageStats {
  scriptId: string;
  scriptName: string;
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  averageDuration: number;
  lastUsed: string | null;
}
