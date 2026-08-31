import api from "@/lib/axios";
import {
  type ConversationFlow,
  type CreateFlowDto,
  type UpdateFlowDto,
  type ValidateFlowResponse,
} from "@/types/flow.types";

/**
 * Conversation Flow API service.
 * Base URL and auth are handled by @/lib/axios.
 */
export const flowService = {
  /**
   * List all flows across companies (platform / super admin).
   * GET /flows
   */
  listAll: async (): Promise<ConversationFlow[]> => {
    const response = await api.get<ConversationFlow[]>(`/flows`);
    return response.data;
  },

  /** List all flows (draft + published) for a company */
  listByCompany: async (companyId: string): Promise<ConversationFlow[]> => {
    const response = await api.get<ConversationFlow[]>(
      `/flows/company/${companyId}`,
    );
    return response.data;
  },

  /** List soft-deleted flows (trash) for a company */
  listDeletedByCompany: async (
    companyId: string,
  ): Promise<ConversationFlow[]> => {
    const response = await api.get<ConversationFlow[]>(
      `/flows/company/${companyId}/trash`,
    );
    return response.data;
  },

  /** Create a new draft flow */
  create: async (
    companyId: string,
    payload: CreateFlowDto,
  ): Promise<ConversationFlow> => {
    const response = await api.post<ConversationFlow>(
      `/flows/company/${companyId}`,
      payload,
    );
    return response.data;
  },

  /** Update a draft flow (only status === "draft") */
  update: async (
    flowId: string,
    companyId: string,
    payload: UpdateFlowDto,
  ): Promise<ConversationFlow> => {
    const response = await api.patch<ConversationFlow>(
      `/flows/${flowId}/company/${companyId}`,
      payload,
    );
    return response.data;
  },

  /** Validate flow before publish (no side effects) */
  validate: async (
    flowId: string,
    companyId: string,
  ): Promise<ValidateFlowResponse> => {
    const response = await api.post<ValidateFlowResponse>(
      `/flows/${flowId}/company/${companyId}/validate`,
    );
    return response.data;
  },

  /**
   * Set flow status (draft | published | archived).
   * POST /flows/{flowId}/company/{companyId}/status/{status}
   */
  setStatus: async (
    flowId: string,
    companyId: string,
    status: "draft" | "published" | "archived",
  ): Promise<ConversationFlow> => {
    const response = await api.post<ConversationFlow>(
      `/flows/${flowId}/company/${companyId}/status/${status}`,
    );
    return response.data;
  },

  /** Publish flow (makes it live; previous published flow is archived) */
  publish: async (
    flowId: string,
    companyId: string,
  ): Promise<ConversationFlow> => {
    return flowService.setStatus(flowId, companyId, "published");
  },

  /**
   * Get published flows for the company.
   * Backend returns an array (sorted by publishedAt DESC) or 404 when none exist.
   */
  getPublished: async (companyId: string): Promise<ConversationFlow[]> => {
    try {
      const response = await api.get<ConversationFlow[]>(
        `/flows/company/${companyId}/published`,
      );
      return response.data;
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response
        ?.status;
      if (status === 404) {
        // Treat 404 as "no published flows" for frontend purposes
        return [];
      }
      throw err;
    }
  },

  /** Delete flow (soft delete - moves to trash) */
  delete: async (
    flowId: string,
    companyId: string,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/flows/${flowId}/company/${companyId}`,
    );
    return response.data;
  },

  /** Activate flow (set status to published; for archived flows) */
  activate: async (
    flowId: string,
    companyId: string,
  ): Promise<ConversationFlow> => {
    return flowService.setStatus(flowId, companyId, "published");
  },

  /** Archive flow (set status to archived) */
  archive: async (
    flowId: string,
    companyId: string,
  ): Promise<ConversationFlow> => {
    return flowService.setStatus(flowId, companyId, "archived");
  },
};