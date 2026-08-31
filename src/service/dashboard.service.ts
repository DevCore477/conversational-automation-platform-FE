import api from "@/lib/axios";
import { type CallActivity } from "@/types/dashboard.types";

export const dashboardService = {
  getRecentActivity: async (limit = 100): Promise<CallActivity[]> => {
    const response = await api.get<CallActivity[]>(
      `/dashboard-stats/activity/recent?limit=${limit}`,
    );
    return response.data ?? [];
  },
};
