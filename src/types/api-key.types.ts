export type ApiKeyPermission =
  | "calls.read"
  | "calls.create"
  | "calls.update"
  | "calls.delete"
  | "scripts.read"
  | "scripts.create"
  | "scripts.update"
  | "scripts.delete"
  | "flows.read"
  | "flows.create"
  | "flows.update"
  | "flows.delete"
  | "agents.read"
  | "agents.create"
  | "agents.update"
  | "agents.delete"
  | "analytics.read"
  | "webhooks.read"
  | "webhooks.create"
  | "webhooks.update"
  | "webhooks.delete"
  | "companies.read"
  | "companies.create"
  | "companies.update"
  | "platform.read"
  | "platform.update"
  | "apiKeys.read"
  | "apiKeys.create"
  | "apiKeys.update"
  | "apiKeys.delete"
  | "all";

export interface ApiKeyRestrictions {
  ipWhitelist?: string[];
  allowedOrigins?: string[];
  rateLimit?: number;
  expiresAt?: string;
  [key: string]: unknown;
}

export interface ApiKey {
  id: string;
  name: string;
  description?: string;
  companyId: string;
  key: string; // Masked version (e.g., "mp_****abcd")
  prefix: string;
  permissions: ApiKeyPermission[];
  restrictions?: ApiKeyRestrictions;
  isActive: boolean;
  lastUsedAt?: string;
  usageCount: number;
  totalRequests?: number;
  expiresAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApiKeyDto {
  name: string;
  description?: string;
  permissions: ApiKeyPermission[];
  restrictions?: ApiKeyRestrictions;
  expiresAt?: string;
}

export interface UpdateApiKeyDto {
  name?: string;
  description?: string;
  permissions?: ApiKeyPermission[];
  restrictions?: ApiKeyRestrictions;
  expiresAt?: string;
  isActive?: boolean;
}

export interface ApiKeyCreateResponse {
  apiKey: ApiKey;
  plainKey: string; // Full key only shown once
  message: string;
}

export interface ApiKeyStats {
  total: number;
  active: number;
  expired: number;
  revoked: number;
  inactive?: number;
  totalUsage: number;
  totalRequests?: number;
  recentlyUsed: number;
}
