import api from "@/lib/axios";
import { normalizeAgentFromApi } from "@/lib/agent-normalize";
import {
  type Agent,
  type CreateAgentDto,
  type GetForCallOptions,
  type UpdateAgentDto,
} from "@/types/agent.types";

function mapAgent(data: unknown): Agent {
  return normalizeAgentFromApi(data);
}

function mapAgents(data: unknown): Agent[] {
  if (!Array.isArray(data)) {
    return [];
  }
  return data.map((row) => normalizeAgentFromApi(row));
}

/**
 * Voice agents API (flows, scripts, LLM) — mirrors Nest `AgentsController`.
 */
export const agentsService = {
  create: async (dto: CreateAgentDto): Promise<Agent> => {
    const response = await api.post<unknown>("/agents", dto);
    return mapAgent(response.data);
  },

  findAll: async (companyId?: string): Promise<Agent[]> => {
    const response = await api.get<unknown>("/agents", {
      params:
        companyId !== undefined && companyId !== ""
          ? { companyId }
          : undefined,
    });
    return mapAgents(response.data);
  },

  findByCompany: async (companyId: string): Promise<Agent[]> => {
    const response = await api.get<unknown>(
      `/agents/company/${companyId}`,
    );
    return mapAgents(response.data);
  },

  findOne: async (id: string): Promise<Agent> => {
    const response = await api.get<unknown>(`/agents/${id}`);
    return mapAgent(response.data);
  },

  /** Config for dialer / runtime (e.g. published validation). */
  getForCall: async (
    id: string,
    options?: GetForCallOptions,
  ): Promise<Agent> => {
    const response = await api.get<unknown>(`/agents/${id}/for-call`, {
      params:
        options?.requirePublished !== undefined
          ? { requirePublished: String(options.requirePublished) }
          : undefined,
    });
    return mapAgent(response.data);
  },

  update: async (id: string, dto: UpdateAgentDto): Promise<Agent> => {
    const response = await api.patch<unknown>(`/agents/${id}`, dto);
    return mapAgent(response.data);
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/agents/${id}`);
  },
};
