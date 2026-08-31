import api from "@/lib/axios";
import { type CallResponse, type MakeCall } from "@/types/call.types";
import { type CallListRow, type CallRecord } from "@/types/dashboard.types";

export const callService = {
  makeCall: async (payload: MakeCall): Promise<CallResponse> => {
    const response = await api.post<CallResponse>("/calls", payload);
    return response.data;
  },

  getOutboundCalls: async (limit = 200): Promise<CallListRow[]> => {
    const response = await api.get<CallListRow[]>("/calls", {
      params: { limit },
    });
    return response.data;
  },

  getCallRecord: async (callSid: string): Promise<CallRecord> => {
    const response = await api.get<CallRecord>(`/calls/records/${callSid}`);
    return response.data;
  },
};
