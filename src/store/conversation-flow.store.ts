import { create } from "zustand";

import { getErrorMessage } from "@/lib/get-error-message";
import { flowService } from "@/service/flow.service";
import {
  type ConversationFlow,
  type CreateFlowDto,
  type UpdateFlowDto,
  type ValidateFlowResponse,
} from "@/types/flow.types";

interface ConversationFlowState {
  flows: ConversationFlow[];
  /** All published flows for the current company (sorted by publishedAt DESC from backend) */
  publishedFlows: ConversationFlow[];
  /** Soft-deleted flows for the current company (trash) */
  trashFlows: ConversationFlow[];
  isLoading: boolean;
  error: string | null;
  validateResult: ValidateFlowResponse | null;
  isSaving: boolean;
  isPublishing: boolean;
}

interface ConversationFlowActions {
  fetchFlows: (companyId: string) => Promise<void>;
  fetchPublished: (companyId: string) => Promise<void>;
  /** Platform admin without company: GET /flows, then keep published only for UI */
  fetchPublishedForPlatformAdmin: () => Promise<void>;
  fetchTrash: (companyId: string) => Promise<void>;
  createFlow: (
    companyId: string,
    dto: CreateFlowDto,
  ) => Promise<ConversationFlow>;
  updateFlow: (
    flowId: string,
    companyId: string,
    dto: UpdateFlowDto,
  ) => Promise<ConversationFlow>;
  validateFlow: (
    flowId: string,
    companyId: string,
  ) => Promise<ValidateFlowResponse>;
  publishFlow: (flowId: string, companyId: string) => Promise<ConversationFlow>;
  deleteFlow: (flowId: string, companyId: string) => Promise<void>;
  activateFlow: (flowId: string, companyId: string) => Promise<void>;
  archiveFlow: (flowId: string, companyId: string) => Promise<void>;
  getFlowById: (flowId: string) => ConversationFlow | undefined;
  clearError: () => void;
  clearValidateResult: () => void;
}

type ConversationFlowStore = ConversationFlowState & ConversationFlowActions;

export const useConversationFlowStore = create<ConversationFlowStore>(
  (set, get) => ({
    flows: [],
    publishedFlows: [],
    trashFlows: [],
    isLoading: false,
    error: null,
    validateResult: null,
    isSaving: false,
    isPublishing: false,

    fetchFlows: async (companyId: string) => {
      try {
        set({ isLoading: true, error: null });
        const flows = await flowService.listByCompany(companyId);
        set({ flows, isLoading: false });
      } catch (err) {
        set({
          error: getErrorMessage(err, "Failed to fetch flows"),
          isLoading: false,
        });
        throw err;
      }
    },

    fetchPublished: async (companyId: string) => {
      try {
        const publishedFlows = await flowService.getPublished(companyId);
        set({ publishedFlows });
      } catch (err) {
        set({
          error: getErrorMessage(err, "Failed to fetch published flow"),
        });
        throw err;
      }
    },

    fetchPublishedForPlatformAdmin: async () => {
      try {
        set({ isLoading: true, error: null });
        const flows = await flowService.listAll();
        const publishedFlows = flows.filter((f) => f.status === "published");
        set({ publishedFlows, isLoading: false });
      } catch (err) {
        set({
          error: getErrorMessage(err, "Failed to fetch conversation flows"),
          isLoading: false,
        });
        throw err;
      }
    },

    fetchTrash: async (companyId: string) => {
      try {
        const trashFlows = await flowService.listDeletedByCompany(companyId);
        set({ trashFlows });
      } catch (err) {
        set({
          error: getErrorMessage(err, "Failed to fetch deleted flows"),
        });
        throw err;
      }
    },

    createFlow: async (companyId: string, dto: CreateFlowDto) => {
      try {
        set({ isSaving: true, error: null });
        const created = await flowService.create(companyId, dto);
        set((s) => ({
          flows: [created, ...s.flows],
          isSaving: false,
        }));
        return created;
      } catch (err) {
        set({
          error: getErrorMessage(err, "Failed to create flow"),
          isSaving: false,
        });
        throw err;
      }
    },

    updateFlow: async (
      flowId: string,
      companyId: string,
      dto: UpdateFlowDto,
    ) => {
      try {
        set({ isSaving: true, error: null });
        const updated = await flowService.update(flowId, companyId, dto);
        set((s) => ({
          flows: s.flows.map((f) => (f.id === flowId ? updated : f)),
          isSaving: false,
        }));
        return updated;
      } catch (err) {
        set({
          error: getErrorMessage(err, "Failed to update flow"),
          isSaving: false,
        });
        throw err;
      }
    },

    validateFlow: async (flowId: string, companyId: string) => {
      try {
        set({ error: null, validateResult: null });
        const result = await flowService.validate(flowId, companyId);
        set({ validateResult: result });
        return result;
      } catch (err) {
        set({
          error: getErrorMessage(err, "Validation failed"),
          validateResult: { valid: false },
        });
        throw err;
      }
    },

    publishFlow: async (flowId: string, companyId: string) => {
      try {
        set({ isPublishing: true, error: null });
        const published = await flowService.publish(flowId, companyId);
        await get().fetchFlows(companyId);
        await get().fetchPublished(companyId);
        set({ isPublishing: false });
        return published;
      } catch (err) {
        set({
          error: getErrorMessage(err, "Failed to publish flow"),
          isPublishing: false,
        });
        throw err;
      }
    },

    deleteFlow: async (flowId: string, companyId: string) => {
      try {
        set({ error: null });
        await flowService.delete(flowId, companyId);
        // Refresh flows after deletion
        await get().fetchFlows(companyId);
        await get().fetchPublished(companyId);
      } catch (err) {
        set({
          error: getErrorMessage(err, "Failed to delete flow"),
        });
        throw err;
      }
    },

    activateFlow: async (flowId: string, companyId: string) => {
      try {
        set({ error: null });
        await flowService.activate(flowId, companyId);
        // Refresh flows after activation
        await get().fetchFlows(companyId);
        await get().fetchPublished(companyId);
      } catch (err) {
        set({
          error: getErrorMessage(err, "Failed to activate flow"),
        });
        throw err;
      }
    },

    archiveFlow: async (flowId: string, companyId: string) => {
      try {
        set({ error: null });
        await flowService.archive(flowId, companyId);
        // Refresh flows after archiving
        await get().fetchFlows(companyId);
        await get().fetchPublished(companyId);
      } catch (err) {
        set({
          error: getErrorMessage(err, "Failed to archive flow"),
        });
        throw err;
      }
    },

    getFlowById: (flowId: string) => {
      return get().flows.find((f) => f.id === flowId);
    },

    clearError: () => set({ error: null }),
    clearValidateResult: () => set({ validateResult: null }),
  }),
);
