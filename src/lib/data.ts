import { cache } from "react";

import "server-only";

import axios from "axios";

import { serverApi } from "@/lib/server-api";
import {
  type DashboardOverview,
  type ScriptPerformance,
  type CallActivity,
  type TopScriptsResponse,
  type SystemHealth,
  type AgentPerformance,
  type FlowPerformance,
  type CallVolumeByResourceResponse,
} from "@/types/dashboard.types";
import { type CallScript, type ScriptStats } from "@/types/script.types";
import { AuthResponse, type User } from "@/types/auth.types";
import {
  type Company,
  type CompanyStats,
  type CompanyUser,
  type PendingInvitation,
} from "@/types/company.types";

export interface CompanyUsersResponse {
  users: CompanyUser[];
  pendingInvitations: PendingInvitation[];
}
import { type GetTeamMembersParams } from "@/types/team.types";
import { type ApiKeyStats } from "@/types/api-key.types";

async function fetchWithErrorHandling<T>(
  fetcher: () => Promise<T>,
  errorMessage: string,
): Promise<T> {
  try {
    return await fetcher();
  } catch (error) {
    console.error(`[Data Fetch Error] ${errorMessage}:`, error);
    throw new Error(error instanceof Error ? error.message : errorMessage);
  }
}

export const getDashboardOverview = cache(
  async (): Promise<DashboardOverview> => {
    return await fetchWithErrorHandling(async () => {
      const response = await serverApi.get<DashboardOverview>(
        "/dashboard-stats/overview",
      );
      return response.data;
    }, "Failed to fetch dashboard overview");
  },
);

export const getScriptPerformance = cache(
  async (
    params?: { from?: string; to?: string; period?: string; scriptId?: string },
  ): Promise<ScriptPerformance[]> => {
    return await fetchWithErrorHandling(async () => {
      const searchParams = new URLSearchParams();
      if (params?.from) searchParams.set("from", params.from);
      if (params?.to) searchParams.set("to", params.to);
      if (params?.period) searchParams.set("period", params.period);
      if (params?.scriptId) searchParams.set("scriptId", params.scriptId);

      const queryString = searchParams.toString();
      const url = queryString
        ? `/dashboard-stats/scripts/performance?${queryString}`
        : "/dashboard-stats/scripts/performance";

      const response = await serverApi.get<{ scripts: ScriptPerformance[] }>(url);
      return response.data.scripts || [];
    }, "Failed to fetch script performance");
  },
);

export const getRecentActivity = cache(
  async (limit = 50): Promise<CallActivity[]> => {
    return await fetchWithErrorHandling(async () => {
      const response = await serverApi.get<CallActivity[]>(
        `/dashboard-stats/activity/recent?limit=${limit}`,
      );
      return response.data;
    }, "Failed to fetch recent activity");
  },
);

export const getSystemHealth = cache(async (period?: string | null): Promise<SystemHealth | null> => {
  return await fetchWithErrorHandling(async () => {
     const url = period 
      ? `/dashboard-stats/system/health?period=${period}`
      : "/dashboard-stats/system/health";
      
    const response = await serverApi.get<SystemHealth>(url);
    return response.data;
  }, "Failed to fetch system health");
});

export const getTopScripts = cache(
  async (limit = 5, period?: string | null): Promise<TopScriptsResponse> => {
    return await fetchWithErrorHandling(async () => {
      let url = `/dashboard-stats/scripts/top?limit=${limit}`;

      if (period) {
        url += `&period=${period}`;
      }

      const response = await serverApi.get<TopScriptsResponse>(url);
      return response.data;
    }, "Failed to fetch top scripts");
  },
);

export const getAgentPerformance = cache(
  async (
    params?: { from?: string; to?: string; period?: string; agentId?: string },
  ): Promise<AgentPerformance[]> => {
    return await fetchWithErrorHandling(async () => {
      const searchParams = new URLSearchParams();
      if (params?.from) searchParams.set("from", params.from);
      if (params?.to) searchParams.set("to", params.to);
      if (params?.period) searchParams.set("period", params.period);
      if (params?.agentId) searchParams.set("agentId", params.agentId);

      const queryString = searchParams.toString();
      const url = queryString
        ? `/dashboard-stats/agents/performance?${queryString}`
        : "/dashboard-stats/agents/performance";

      const response = await serverApi.get<{ agents: AgentPerformance[] }>(url);
      return response.data.agents || [];
    }, "Failed to fetch agent performance");
  },
);

export const getFlowPerformance = cache(
  async (
    params?: { from?: string; to?: string; period?: string; flowId?: string },
  ): Promise<FlowPerformance[]> => {
    return await fetchWithErrorHandling(async () => {
      const searchParams = new URLSearchParams();
      if (params?.from) searchParams.set("from", params.from);
      if (params?.to) searchParams.set("to", params.to);
      if (params?.period) searchParams.set("period", params.period);
      if (params?.flowId) searchParams.set("flowId", params.flowId);

      const queryString = searchParams.toString();
      const url = queryString
        ? `/dashboard-stats/flows/performance?${queryString}`
        : "/dashboard-stats/flows/performance";

      const response = await serverApi.get<{ flows: FlowPerformance[] }>(url);
      return response.data.flows || [];
    }, "Failed to fetch flow performance");
  },
);

export const getDashboardData = cache(async (
  period: "hour" | "day" | "week" | "month" | null = null ,
) => {
  // console.log("[getDashboardData] Starting dashboard data fetch");

  const [overview, scriptsResponse, recentActivity, health] = await Promise.all(
    [
      getDashboardOverview(),
      getTopScripts(),
      getRecentActivity(),
      getSystemHealth(),
    ],
  );

  // console.log("[getDashboardData] Core data fetched successfully");

  let agentPerf: AgentPerformance[] = [];
  let flowPerf: FlowPerformance[] = [];
  let scriptPerf: ScriptPerformance[] = [];

  try {
    // console.log("[getDashboardData] Fetching performance data...");
    [agentPerf, flowPerf, scriptPerf] = await Promise.all([
      getAgentPerformance(),
      getFlowPerformance(),
      getScriptPerformance(),
    ]);
    // console.log("[getDashboardData] Performance data fetched:", {
    //   agents: agentPerf.length,
    //   flows: flowPerf.length,
    //   scripts: scriptPerf.length,
    // });
  } catch (error) {
    console.error(
      "[Dashboard Data] Failed to fetch agent/flow/script performance (non-critical):",
      error,
    );
  }

  return {
    overview,
    scripts: scriptsResponse,
    recentActivity,
    health,
    agents: agentPerf,
    flows: flowPerf,
    scriptPerf: scriptPerf,
  };
});

export const getScripts = cache(async (): Promise<CallScript[]> => {
  return await fetchWithErrorHandling(async () => {
    const response = await serverApi.get<CallScript[]>("/call-scripts");
    return response.data;
  }, "Failed to fetch scripts");
});

export const getActiveScripts = cache(async (): Promise<CallScript[]> => {
  return await fetchWithErrorHandling(async () => {
    const response = await serverApi.get<CallScript[]>("/call-scripts/active");
    return response.data;
  }, "Failed to fetch active scripts");
});

export const getDefaultScript = cache(async (): Promise<CallScript | null> => {
  return await fetchWithErrorHandling(async () => {
    const response = await serverApi.get<CallScript>("/call-scripts/default");
    return response.data;
  }, "Failed to fetch default script");
});

export const getScriptStats = cache(async (): Promise<ScriptStats> => {
  return await fetchWithErrorHandling(async () => {
    const response = await serverApi.get<ScriptStats>("/call-scripts/stats");
    return response.data;
  }, "Failed to fetch script stats");
});

export const getScriptData = cache(async () => {
  try {
    const [scripts, stats] = await Promise.all([
      getScripts(),
      getScriptStats(),
    ]);

    return {
      scripts,
      stats,
    };
  } catch (error) {
    console.error("[Script Data] Failed to fetch script data:", error);
    throw new Error("Failed to load script data");
  }
});

export const getFlows = cache(async (companyId: string) => {
  return await fetchWithErrorHandling(async () => {
    const response = await serverApi.get(`/flows/company/${companyId}`);
    return response.data;
  }, "Failed to fetch flows");
});

export const getDeletedFlows = cache(async (companyId: string) => {
  return await fetchWithErrorHandling(async () => {
    const response = await serverApi.get(`/flows/company/${companyId}/trash`);
    return response.data;
  }, "Failed to fetch deleted flows");
});

export const getPublishedFlows = cache(async (companyId: string) => {
  try {
    const response = await serverApi.get(
      `/flows/company/${companyId}/published`,
    );

    return response.data;
  } catch (error) {
    // ✅ Handle empty published flows gracefully
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return [];
    }

    console.error("[getPublishedFlows] Failed:", error);
    throw new Error("Failed to fetch published flows");
  }
});

export const getFlowData = cache(async (companyId: string) => {
  try {
    const [flows, publishedFlows] = await Promise.all([
      getFlows(companyId),
      getPublishedFlows(companyId),
    ]);

    return {
      flows,
      publishedFlows,
      currentPublishedFlow: publishedFlows[0] ?? null,
    };
  } catch (error) {
    console.error("[Flow Data] Failed to fetch flow data:", error);
    throw new Error("Failed to load flow data");
  }
});

export const getCurrentUser = cache(async (): Promise<User | null> => {
  try {
    const response = await serverApi.get<AuthResponse>("/auth/me");
    return response.data.user;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    console.error("[getCurrentUser] Failed to fetch user:", error);
    return null;
  }
});

export const getCompany = cache(async (): Promise<Company> => {
  return await fetchWithErrorHandling(async () => {
    const response = await serverApi.get<Company>("/companies/me");
    return response.data;
  }, "Failed to fetch company");
});

export const getCompanyUsers = cache(
  async (): Promise<CompanyUsersResponse> => {
    return await fetchWithErrorHandling(async () => {
      const response = await serverApi.get<CompanyUsersResponse>(
        "/companies/me/users",
      );
      return response.data;
    }, "Failed to fetch company users");
  },
);

interface CompanyStatsResponse {
  totalUsers: number;
  totalCalls: number;
  totalScripts?: number;
  totalAPIKeys?: number;
  activeAPIKeys?: number;
  callsThisMonth?: number;
  callsLastMonth?: number;
  plan?: string;
  isActive?: boolean;
  trialDaysLeft?: number;
  growth?: number;
}

export const getCompanyStats = cache(
  async (): Promise<CompanyStatsResponse> => {
    return await fetchWithErrorHandling(async () => {
      const response = await serverApi.get<CompanyStatsResponse>(
        "/companies/me/stats",
      );
      return response.data;
    }, "Failed to fetch company stats");
  },
);

interface CompanyDataResponse {
  company: Company;
  users: CompanyUsersResponse;
  stats: CompanyStatsResponse;
}

export const getCompanyData = cache(async (): Promise<CompanyDataResponse> => {
  try {
    const [company, users, stats] = await Promise.all([
      getCompany(),
      getCompanyUsers(),
      getCompanyStats(),
    ]);
    return { company, users, stats };
  } catch (error) {
    console.error("[Company Data] Failed to fetch company data:", error);
    throw new Error("Failed to load company data");
  }
});

export const getAllCompanies = cache(async () => {
  return await fetchWithErrorHandling(async () => {
    const response = await serverApi.get("/companies");
    return response.data;
  }, "Failed to fetch all companies");
});

export const getCompanyById = cache(async (companyId: string) => {
  return await fetchWithErrorHandling(async () => {
    const response = await serverApi.get(`/companies/admins/${companyId}`);
    return response.data;
  }, `Failed to fetch company ${companyId}`);
});

export const getCompanyUsersAdmin = cache(async (companyId: string) => {
  return await fetchWithErrorHandling(async () => {
    const response = await serverApi.get(
      `/companies/admins/${companyId}/users`,
    );
    return response.data;
  }, `Failed to fetch users for company ${companyId}`);
});

export const getTeamMembers = cache(
  async (params: GetTeamMembersParams = {}) => {
    return await fetchWithErrorHandling(async () => {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.set("page", String(params.page));
      if (params.limit) queryParams.set("limit", String(params.limit));
      if (params.search) queryParams.set("search", params.search);
      if (params.role) queryParams.set("role", params.role);
      if (params.companyId) queryParams.set("companyId", params.companyId);

      const response = await serverApi.get(
        `/users/members?${queryParams.toString()}`,
      );
      return response.data;
    }, "Failed to fetch team members");
  },
);

export const getTeamMembersData = cache(
  async (params: GetTeamMembersParams = {}) => {
    try {
      const response = await getTeamMembers(params);

      return {
        members: response.data,
        meta: response.meta,
        stats: {
          total:
            response.meta?.counts?.matchingSearchTotal ??
            response.meta?.totalItems ??
            0,
          admin: response.meta?.counts?.platformAdmin ?? 0,
          member: response.meta?.counts?.platformMember ?? 0,
        },
      };
    } catch (error) {
      console.error("[Team Data] Failed to fetch team data:", error);
      throw new Error("Failed to load team data");
    }
  },
);

export const getApiKeys = cache(async () => {
  return await fetchWithErrorHandling(async () => {
    const response = await serverApi.get("/api-keys");
    return response.data;
  }, "Failed to fetch API keys");
});

export const getApiKeyStats = cache(async (): Promise<ApiKeyStats> => {
  return await fetchWithErrorHandling(async () => {
    const response = await serverApi.get<ApiKeyStats>("/api-keys/stats");
    return response.data;
  }, "Failed to fetch API key stats");
});

export const getApiKeysData = cache(async () => {
  try {
    const [apiKeys, stats] = await Promise.all([
      getApiKeys(),
      getApiKeyStats(),
    ]);

    return {
      apiKeys,
      stats,
    };
  } catch (error) {
    console.error("[API Keys Data] Failed to fetch API keys data:", error);
    throw new Error("Failed to load API keys data");
  }
});

export const getCallsVolumeByResource = cache(
  async (
    period: "hour" | "day" | "week" | "month" | null = null ,
  ): Promise<CallVolumeByResourceResponse> => {
    return await fetchWithErrorHandling(async () => {
      const response = await serverApi.get<CallVolumeByResourceResponse>(
        `/dashboard-stats/calls/volume/by-resource?period=${period}`,
      );
      return response.data;
    }, "Failed to fetch call volume by resource");
  },
);
