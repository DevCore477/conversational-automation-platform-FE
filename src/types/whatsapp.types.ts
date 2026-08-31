export type ReplyRoutingMode =
  | "agent"
  | "flow"
  | "script"
  | "ai"
  | "database_default";

export interface ReplyRouting {
  routingMode?: ReplyRoutingMode;
  agentId?: string | null;
  flowId?: string | null;
  scriptId?: string | null;
  aiModel?: string;
  aiSystemPrompt?: string | null;
}

export interface WhatsAppConversation {
  id: string;
  companyId: string | null;
  contactPhone: string;
  contactWaId: string;
  metaPhoneNumberId: string;
  status: "open" | "closed" | "pending" | "human_handoff";
  routingMode: "ai" | "agent" | "flow" | "script";
  agentId: string | null;
  flowId: string | null;
  scriptId: string | null;
  sessionState: Record<string, unknown>;
  lastMessageAt: string | null;
  lastInboundAt: string | null;
  lastOutboundAt: string | null;
  unreadCount: number;
  contactName?: string;
  importSource?: "csv" | "manual" | "inbound";
  createdAt: string;
  updatedAt: string;
}

export interface WhatsAppConversationDetail {
  conversation: WhatsAppConversation;
  messages: WhatsAppMessage[];
}

export type WhatsAppMediaKind =
  | "image"
  | "video"
  | "audio"
  | "document"
  | "sticker"
  | "location"
  | "contact";

export interface WhatsAppMessageMedia {
  mediaType: WhatsAppMediaKind;
  status: "pending" | "processing" | "completed" | "failed" | "unsupported";
  s3Url: string | null;
  visionDescription: string | null;
  ocrText: string | null;
  sceneSummary: string | null;
  transcript: string | null;
  extractedText: string | null;
  structuredData: {
    location?: {
      latitude: number;
      longitude: number;
      name?: string;
      address?: string;
    };
    contacts?: Array<{
      name?: string;
      phones?: string[];
    }>;
  } | null;
  errorMessage: string | null;
}

export interface WhatsAppMessage {
  id: string;
  conversationId: string;
  direction: "inbound" | "outbound";
  messageType:
    | "text"
    | "media"
    | "image"
    | "video"
    | "document"
    | "audio"
    | "sticker"
    | "location"
    | "contacts"
    | "contact"
    | "interactive";
  body: string;
  mediaUrl: string | null;
  metaWamid: string | null;
  status:
    | "received"
    | "pending"
    | "queued"
    | "sent"
    | "delivered"
    | "read"
    | "failed";
  statusUpdatedAt: string;
  errorCode: string | null;
  errorMessage: string | null;
  sentAt: string | null;
  deliveredAt: string | null;
  readAt: string | null;
  failedAt: string | null;
  createdAt: string;
  updatedAt: string;
  templateParameters?: string[];
  /** Media/structured content for inbound messages (URL lives here, not mediaUrl). */
  media?: WhatsAppMessageMedia | null;
}

export interface SendTemplatePayload extends ReplyRouting {
  to: string;
  templateName?: string;
  templateId?: string;
  parameters?: string[];
  contentVariables?: Record<string, string>;
  languageCode?: string;
  headerParameters?: string[];
  bodyParameters?: string[];
  buttonParameters?: { index: number; subType: string; parameters: string[] }[];
  components?: object[];
}

export interface SendTemplateResponse {
  success: boolean;
  messageId: string;
  metaWamid: string;
  status: string;
}

export interface SendMessagePayload extends ReplyRouting {
  to: string;
  body: string;
  mediaUrl?: string[];
  mediaType?: string;
}

export interface SendMessageResponse {
  success: boolean;
  messageId: string;
  metaWamid: string;
  status: string;
}

export interface BulkCsvPayload extends ReplyRouting {
  file: File;
  delayMs?: number;
  dryRun?: boolean;
  stopOnError?: boolean;
  design?: string;
}

export interface BulkRecipient {
  to: string;
  variables?: Record<string, string>;
}

export interface BulkSendPayload extends ReplyRouting {
  design: {
    type:
      | "text"
      | "template"
      | "media"
      | "interactive_buttons"
      | "interactive_list";
    body?: string;
    templateName?: string;
    parameters?: string[];
    languageCode?: string;
    mediaType?: string;
    url?: string;
    caption?: string;
  };
  recipients: BulkRecipient[];
  delayMs?: number;
  dryRun?: boolean;
  stopOnError?: boolean;
}

export interface CampaignStatus {
  id: string;
  name: string;
  status: "queued" | "running" | "completed" | "failed" | "cancelled";
  designType: string;
  totalCount: number;
  sentCount: number;
  failedCount: number;
  dryRun: boolean;
  createdAt: string;
  completedAt: string | null;
}

export interface CsvParsedRow {
  phone: string;
  message?: string;
  name?: string;
  [key: string]: string | undefined;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface CompanyWhatsAppConfig {
  id: string;
  companyId: string;
  provider: string;
  wabaId: string | null;
  phoneNumberId: string;
  businessPhoneNumber: string | null;
  accessTokenMasked: string;
  apiVersion: string;
  isActive: boolean;
  maxMessagesPerSecond: number | null;
  maxMessagesPerMinute: number | null;
  maxDailyMessages: number | null;
  qualityStatus: string | null;
  messagingTier: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyWhatsAppConfigInput {
  wabaId?: string;
  phoneNumberId: string;
  businessPhoneNumber?: string;
  accessToken: string;
  appSecret?: string;
  webhookVerifyToken?: string;
  apiVersion?: string;
  isActive?: boolean;
  maxMessagesPerSecond?: number;
  maxMessagesPerMinute?: number;
  maxDailyMessages?: number;
}

export interface WhatsAppTemplateComponent {
  type: "BODY" | "HEADER" | "FOOTER" | "BUTTONS";
  text?: string;
  format?: string;
  buttons?: {
    type: string;
    text: string;
    url?: string;
    phoneNumber?: string;
  }[];
}

export interface WhatsAppMessageTemplate {
  id: string;
  companyId: string;
  name: string;
  metaTemplateName: string;
  metaTemplateId: string | null;
  category: string;
  language: string;
  status: "approved" | "pending" | "rejected" | "paused" | "disabled";
  qualityStatus: "green" | "yellow" | "red" | null;
  source: "synced" | "manual" | "library";
  libraryTemplateName: string | null;
  rejectionReason: string | null;
  isActive: boolean;
  lastSyncedAt: string | null;
  components: WhatsAppTemplateComponent[];
  bodyPreview: string | null;
  usableForCampaigns: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplatePayload {
  name: string;
  metaTemplateName: string;
  language?: string;
  category?: string;
  status?: string;
  components?: WhatsAppTemplateComponent[];
  bodyPreview?: string;
}

export interface UpdateTemplatePayload {
  name?: string;
  category?: string;
  status?: string;
  components?: WhatsAppTemplateComponent[];
  bodyPreview?: string;
}

export interface SyncTemplatesResult {
  created: number;
  updated: number;
  archived: number;
}

export interface LibraryTemplate {
  name: string;
  language: string;
  category: string;
  topic: string;
  usecase: string;
  industry: string[];
  header?: string;
  body: string;
  body_params: string[];
  body_param_types: string[];
  buttons?: { type: string; text: string; url?: string }[];
  id: string;
}

export interface LibraryTemplatesResponse {
  templates: LibraryTemplate[];
  paging: { cursors: { before: string; after: string }; next?: string };
  meta: { fromCache: boolean; note: string };
}

export interface CopyLibraryTemplatePayload {
  libraryTemplateName: string;
  name: string;
  language: string;
  category: "MARKETING" | "UTILITY" | "AUTHENTICATION";
  bodyInputs?: Record<string, string>;
  buttonInputs?: {
    type: string;
    text?: string;
    url?: string;
    phoneNumber?: string;
  }[];
  allowCategoryChange?: boolean;
}

export interface MessageStatusResponse {
  status: string;
  wamid: string;
  recipientId: string;
  statusUpdatedAt: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface UpdateConversationStatusPayload {
  status: "open" | "closed" | "human_handoff";
}

export interface ClearConversationResponse {
  deletedMessages: number;
}

export interface RetryMessageResponse {
  messageSid: string;
  conversationId: string;
  messageId: string;
}

export interface DeleteMessageResponse {
  deleted: boolean;
}

export interface WhatsAppMessageStats {
  companyId: string;
  campaignCount: number;
  messagesByStatus: Record<string, number>;
}

export interface DesignObject {
  type:
    | "text"
    | "template"
    | "media"
    | "interactive_buttons"
    | "interactive_list";
  body?: string;
  templateName?: string;
  parameters?: string[];
  languageCode?: string;
  mediaType?: string;
  url?: string;
  caption?: string;
  buttons?: { id: string; title: string }[];
  list?: {
    header?: string;
    body: string;
    footer?: string;
    button: string;
    sections: {
      title: string;
      rows: { id: string; title: string; description?: string }[];
    }[];
  };
}

export interface WhatsAppStatusResponse {
  configured: boolean;
  provider: string;
}

export interface WhatsAppHealthResponse {
  ok: boolean;
  provider: string;
}

// Campaign types
export interface CampaignRecipient {
  phone: string;
  name?: string;
  templateParams?: string[];
}

export interface CreateCampaignPayload extends ReplyRouting {
  name: string;
  templateId: string;
  recipients?: CampaignRecipient[];
  phones?: string[];
  contactIds?: string[];
  templateParamsByPhone?: Record<string, string[]>;
  templateVariableMapping?: Record<string, string>;
  confirmRecipientsOptedIn?: boolean;
  scheduledAt?: string;
}

export interface CreateCampaignResponse {
  campaignId: string;
  totalContacts: number;
  queued: number;
  skipped: number;
  failed: number;
  skipReasons: Record<string, unknown>;
  invalidPhones: string[];
}

export interface WhatsAppCampaign {
  id: string;
  companyId: string;
  name: string;
  status:
    | "draft"
    | "queued"
    | "sending"
    | "running"
    | "completed"
    | "failed"
    | "paused"
    | "cancelled";
  designType: string;
  templateId: string;
  totalCount: number;
  queuedCount: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
  skippedCount: number;
  pauseReason: string | null;
  scheduledAt: string | null;
  dryRun: boolean;
  routingMode: string | null;
  agentId: string | null;
  flowId: string | null;
  scriptId: string | null;
  aiModel: string | null;
  aiSystemPrompt: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface CampaignStats {
  id: string;
  name: string;
  status: string;
  totalContacts: number;
  queued: number;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
  skipped: number;
  pauseReason: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface CampaignAggregateStats {
  totalCampaigns: number;
  completedCampaigns: number;
  totalContacts: number;
  queued: number;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
  skipped: number;
}

export interface CampaignAllMessagesStats {
  companyId: string;
  campaignCount: number;
  messagesByStatus: Record<string, number>;
}

export const CAMPAIGN_STATUS_VARIANT: Record<
  string,
  "default" | "success" | "warning" | "danger" | "muted"
> = {
  draft: "default",
  queued: "default",
  sending: "warning",
  running: "warning",
  completed: "success",
  failed: "danger",
  paused: "muted",
  cancelled: "muted",
};

// Campaign detail (combined endpoint)
export interface CampaignRecipientRow {
  messageId: string;
  contactId: string | null;
  contactName: string | null;
  phoneNumber: string;
  status: string;
  body: string | null;
  templateName: string | null;
  errorCode: string | null;
  errorMessage: string | null;
  conversationId: string | null;
  sentAt: string | null;
  deliveredAt: string | null;
  readAt: string | null;
  failedAt: string | null;
  createdAt: string;
}

export interface CampaignDetailTemplate {
  id: string;
  name: string;
  metaTemplateName: string;
  metaTemplateId: string | null;
  category: string;
  language: string;
  status: string;
  bodyPreview: string | null;
  usableForCampaigns: boolean;
}

export interface CampaignDetailMessage {
  designType: string;
  preview: string | null;
  templateName: string | null;
  variableMapping: Record<string, string> | null;
}

export interface CampaignDetailResponse {
  campaign: WhatsAppCampaign;
  template: CampaignDetailTemplate | null;
  message: CampaignDetailMessage | null;
  recipients: PaginatedResponse<CampaignRecipientRow>;
}
