import api from "@/lib/axios";
import { UserRole } from "@/common/enums/user.types";
import { useAuthStore } from "@/store/auth.store";
import type {
  WhatsAppConversation,
  WhatsAppConversationDetail,
  WhatsAppMessage,
  SendTemplatePayload,
  SendTemplateResponse,
  SendMessagePayload,
  SendMessageResponse,
  BulkSendPayload,
  CampaignStatus,
  PaginatedResponse,
  CompanyWhatsAppConfig,
  CompanyWhatsAppConfigInput,
  WhatsAppStatusResponse,
  WhatsAppHealthResponse,
  WhatsAppMessageTemplate,
  CreateTemplatePayload,
  UpdateTemplatePayload,
  SyncTemplatesResult,
  LibraryTemplate,
  LibraryTemplatesResponse,
  CopyLibraryTemplatePayload,
  MessageStatusResponse,
  UpdateConversationStatusPayload,
  ClearConversationResponse,
  RetryMessageResponse,
  DeleteMessageResponse,
  WhatsAppMessageStats,
  CreateCampaignPayload,
  CreateCampaignResponse,
  WhatsAppCampaign,
  CampaignStats,
  CampaignAggregateStats,
  CampaignAllMessagesStats,
  CampaignDetailResponse,
} from "@/types/whatsapp.types";

const BASE = "/whatsapp";

function getTemplatesEndpoint(companyId?: string): string {
  const user = useAuthStore.getState().user;
  const isPlatformAdmin = user?.role === UserRole.ADMIN && !user?.companyId;
  if (isPlatformAdmin && companyId) {
    return `/admin/companies/${companyId}/whatsapp/message-templates`;
  }
  return `${BASE}/message-templates`;
}

export const whatsappService = {
  getConversations: async (
    companyId: string,
    params?: { limit?: number; page?: number; search?: string; status?: string }
  ): Promise<PaginatedResponse<WhatsAppConversation>> => {
    const user = useAuthStore.getState().user;
    const isPlatformAdmin = user?.role === UserRole.ADMIN && !user?.companyId;
    const endpoint = isPlatformAdmin
      ? `/admin/companies/${companyId}/whatsapp/conversations`
      : `${BASE}/conversations`;
    const response = await api.get<PaginatedResponse<WhatsAppConversation>>(endpoint, {
      params,
    });
    return response.data;
  },

  getConversation: async (id: string, companyId?: string): Promise<WhatsAppConversationDetail> => {
    const user = useAuthStore.getState().user;
    const isPlatformAdmin = user?.role === UserRole.ADMIN && !user?.companyId;
    const endpoint = isPlatformAdmin && companyId
      ? `/admin/companies/${companyId}/whatsapp/conversations/${id}`
      : `${BASE}/conversations/${id}`;
    const response = await api.get<WhatsAppConversationDetail>(endpoint);
    return response.data;
  },

  getConversationMessages: async (
    id: string,
    params?: { limit?: number; offset?: number }
  ): Promise<WhatsAppMessage[]> => {
    const response = await api.get<WhatsAppMessage[]>(
      `${BASE}/conversations/${id}/messages`,
      { params }
    );
    return response.data;
  },

  updateConversationStatus: async (id: string, payload: UpdateConversationStatusPayload): Promise<WhatsAppConversation> => {
    const response = await api.patch<WhatsAppConversation>(`${BASE}/conversations/${id}/status`, payload);
    return response.data;
  },

  clearConversation: async (id: string): Promise<ClearConversationResponse> => {
    const response = await api.post<ClearConversationResponse>(`${BASE}/conversations/${id}/clear`);
    return response.data;
  },

  retryMessage: async (conversationId: string, messageId: string): Promise<RetryMessageResponse> => {
    const response = await api.post<RetryMessageResponse>(`${BASE}/conversations/${conversationId}/messages/${messageId}/retry`);
    return response.data;
  },

  deleteMessage: async (conversationId: string, messageId: string): Promise<DeleteMessageResponse> => {
    const response = await api.delete<DeleteMessageResponse>(`${BASE}/conversations/${conversationId}/messages/${messageId}`);
    return response.data;
  },

  sendMessage: async (payload: SendMessagePayload): Promise<SendMessageResponse> => {
    const response = await api.post<SendMessageResponse>(`${BASE}/messages`, payload);
    return response.data;
  },

  sendTemplate: async (payload: SendTemplatePayload): Promise<SendTemplateResponse> => {
    const response = await api.post<SendTemplateResponse>(`${BASE}/templates`, payload);
    return response.data;
  },

  uploadCsv: async (
    file: File,
    options?: { delayMs?: number; dryRun?: boolean; stopOnError?: boolean; design?: string }
  ): Promise<{ success: boolean; campaignId?: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    if (options?.design) {
      formData.append("design", options.design);
    }
    const response = await api.post(`${BASE}/bulk/csv`, formData, {
      params: {
        delayMs: options?.delayMs ?? 800,
        dryRun: options?.dryRun ?? false,
        stopOnError: options?.stopOnError ?? false,
      },
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  bulkSend: async (payload: BulkSendPayload): Promise<{ success: boolean; campaignId: string }> => {
    const response = await api.post(`${BASE}/bulk`, payload);
    return response.data;
  },

  bulkSendText: async (payload: {
    message: string;
    recipients: { to: string; variables?: Record<string, string> }[];
    delayMs?: number;
    dryRun?: boolean;
  }): Promise<{ success: boolean; campaignId: string }> => {
    const response = await api.post(`${BASE}/bulk/text`, payload);
    return response.data;
  },

  getCampaignStatus: async (campaignId: string): Promise<CampaignStatus> => {
    const response = await api.get<CampaignStatus>(`${BASE}/campaigns/${campaignId}`);
    return response.data;
  },

  downloadSampleCsv: async (): Promise<Blob> => {
    const response = await api.get(`${BASE}/bulk/csv/sample`, {
      responseType: "blob",
    });
    return response.data;
  },

  getTemplates: async (
    params?: {
      page?: number;
      limit?: number;
      status?: string;
      approvedOnly?: boolean;
      includeInactive?: boolean;
    },
    companyId?: string
  ): Promise<PaginatedResponse<WhatsAppMessageTemplate>> => {
    const endpoint = getTemplatesEndpoint(companyId);
    const response = await api.get<PaginatedResponse<WhatsAppMessageTemplate>>(endpoint, { params });
    return response.data;
  },

  getTemplate: async (id: string, companyId?: string): Promise<WhatsAppMessageTemplate> => {
    const user = useAuthStore.getState().user;
    const isPlatformAdmin = user?.role === UserRole.ADMIN && !user?.companyId;
    const endpoint = isPlatformAdmin && companyId
      ? `/admin/companies/${companyId}/whatsapp/message-templates/${id}`
      : `${BASE}/message-templates/${id}`;
    const response = await api.get<WhatsAppMessageTemplate>(endpoint);
    return response.data;
  },

  createTemplate: async (payload: CreateTemplatePayload, companyId?: string): Promise<WhatsAppMessageTemplate> => {
    const endpoint = getTemplatesEndpoint(companyId);
    const response = await api.post<WhatsAppMessageTemplate>(endpoint, payload);
    return response.data;
  },

  updateTemplate: async (id: string, payload: UpdateTemplatePayload, companyId?: string): Promise<WhatsAppMessageTemplate> => {
    const user = useAuthStore.getState().user;
    const isPlatformAdmin = user?.role === UserRole.ADMIN && !user?.companyId;
    const endpoint = isPlatformAdmin && companyId
      ? `/admin/companies/${companyId}/whatsapp/message-templates/${id}`
      : `${BASE}/message-templates/${id}`;
    const response = await api.patch<WhatsAppMessageTemplate>(endpoint, payload);
    return response.data;
  },

  deleteTemplate: async (id: string, companyId?: string): Promise<{ deleted: boolean }> => {
    const user = useAuthStore.getState().user;
    const isPlatformAdmin = user?.role === UserRole.ADMIN && !user?.companyId;
    const endpoint = isPlatformAdmin && companyId
      ? `/admin/companies/${companyId}/whatsapp/message-templates/${id}`
      : `${BASE}/message-templates/${id}`;
    const response = await api.delete<{ deleted: boolean }>(endpoint);
    return response.data;
  },

  syncTemplates: async (companyId?: string): Promise<SyncTemplatesResult> => {
    const endpoint = getTemplatesEndpoint(companyId);
    const response = await api.post<SyncTemplatesResult>(`${endpoint}/sync`);
    return response.data;
  },

  getLibraryTemplates: async (
    params?: {
      search?: string;
      language?: string;
      category?: string;
      topic?: string;
      name?: string;
      limit?: number;
      after?: string;
      skipCache?: boolean;
    },
    companyId?: string
  ): Promise<LibraryTemplate[]> => {
    const user = useAuthStore.getState().user;
    const isPlatformAdmin = user?.role === UserRole.ADMIN && !user?.companyId;
    const endpoint = isPlatformAdmin && companyId
      ? `/admin/companies/${companyId}/whatsapp/message-templates/library`
      : `${BASE}/message-templates/library`;
    const response = await api.get<LibraryTemplatesResponse>(endpoint, { params });
    return response.data.templates;
  },

  copyFromLibrary: async (payload: CopyLibraryTemplatePayload, companyId?: string): Promise<{ success: boolean }> => {
    const endpoint = getTemplatesEndpoint(companyId);
    const response = await api.post<{ success: boolean }>(`${endpoint}/from-library`, payload);
    return response.data;
  },

  getMessageStatus: async (messageSid: string): Promise<MessageStatusResponse> => {
    const response = await api.get<MessageStatusResponse>(`${BASE}/messages/${messageSid}/status`);
    return response.data;
  },

  getConfig: async (companyId: string): Promise<CompanyWhatsAppConfig> => {
    const response = await api.get<CompanyWhatsAppConfig>(`/admin/companies/${companyId}/whatsapp/config`);
    return response.data;
  },

  updateConfig: async (companyId: string, payload: CompanyWhatsAppConfigInput): Promise<CompanyWhatsAppConfig> => {
    const response = await api.post<CompanyWhatsAppConfig>(`/admin/companies/${companyId}/whatsapp/config`, payload);
    return response.data;
  },

  toggleWhatsApp: async (companyId: string, isActive: boolean): Promise<CompanyWhatsAppConfig> => {
    const response = await api.patch<CompanyWhatsAppConfig>(`/admin/companies/${companyId}/whatsapp/config/status`, { isActive });
    return response.data;
  },

  getMessageStats: async (companyId?: string): Promise<WhatsAppMessageStats> => {
    const user = useAuthStore.getState().user;
    const isPlatformAdmin = user?.role === UserRole.ADMIN && !user?.companyId;
    const endpoint = isPlatformAdmin && companyId
      ? `/admin/companies/${companyId}/whatsapp/stats`
      : `${BASE}/campaigns/all-messages-stats`;
    const response = await api.get<WhatsAppMessageStats>(endpoint);
    return response.data;
  },

  getWhatsAppStatus: async (): Promise<WhatsAppStatusResponse> => {
    const response = await api.get<WhatsAppStatusResponse>(`${BASE}/config`);
    return response.data;
  },

  getWhatsAppHealth: async (): Promise<WhatsAppHealthResponse> => {
    const response = await api.get<WhatsAppHealthResponse>(`${BASE}/health`);
    return response.data;
  },

  // Campaign methods
  createCampaign: async (payload: CreateCampaignPayload): Promise<CreateCampaignResponse> => {
    const response = await api.post<CreateCampaignResponse>(`${BASE}/campaigns`, payload);
    return response.data;
  },

  createCampaignFromCsv: async (formData: FormData): Promise<CreateCampaignResponse> => {
    const response = await api.post<CreateCampaignResponse>(`${BASE}/campaigns/csv`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateCampaign: async (id: string, payload: { name?: string }): Promise<WhatsAppCampaign> => {
    const response = await api.patch<WhatsAppCampaign>(`${BASE}/campaigns/${id}`, payload);
    return response.data;
  },

  deleteCampaign: async (id: string): Promise<void> => {
    await api.delete(`${BASE}/campaigns/${id}`);
  },

  getCampaigns: async (params?: { limit?: number; offset?: number }): Promise<WhatsAppCampaign[]> => {
    const response = await api.get<WhatsAppCampaign[]>(`${BASE}/campaigns`, { params });
    return response.data;
  },

  getCampaign: async (id: string, params?: { page?: number; limit?: number }): Promise<CampaignDetailResponse> => {
    const response = await api.get<CampaignDetailResponse>(`${BASE}/campaigns/${id}`, { params });
    return response.data;
  },

  getCampaignStats: async (id: string): Promise<CampaignStats> => {
    const response = await api.get<CampaignStats>(`${BASE}/campaigns/${id}/stats`);
    return response.data;
  },

  getCampaignAggregateStats: async (): Promise<CampaignAggregateStats> => {
    const response = await api.get<CampaignAggregateStats>(`${BASE}/campaigns/all-stats`);
    return response.data;
  },

  getCampaignAllMessagesStats: async (): Promise<CampaignAllMessagesStats> => {
    const response = await api.get<CampaignAllMessagesStats>(`${BASE}/campaigns/all-messages-stats`);
    return response.data;
  },

  // Admin campaign endpoints
  getCompanyCampaigns: async (companyId: string, params?: { limit?: number; offset?: number }): Promise<WhatsAppCampaign[]> => {
    const response = await api.get<WhatsAppCampaign[]>(`/admin/companies/${companyId}/whatsapp/campaigns`, { params });
    return response.data;
  },

  getCompanyCampaignStats: async (companyId: string): Promise<CampaignAllMessagesStats> => {
    const response = await api.get<CampaignAllMessagesStats>(`/admin/companies/${companyId}/whatsapp/stats`);
    return response.data;
  },
};
