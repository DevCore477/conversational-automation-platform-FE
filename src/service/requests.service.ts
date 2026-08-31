import api from "@/lib/axios";
import {Request, RequestCreateDto, RequestResponse} from "@/types/requests.types";

/**
 * Requests/connect Us API service.
 * Base URL and auth are handled by @/lib/axios.
 */
export const RequestsService = {
    /**
     * List all requests (platform / super admin).
     * GET /connect-us
     */
    list: async (): Promise<Request[]> => {
        const response = await api.get<Request[]>(`/connect-us`);
        return response.data;
    },

    /** Create a new request */
    create: async (
        payload: RequestCreateDto,
    ): Promise<RequestResponse> => {
        const response = await api.post<RequestResponse>(
            `/connect-us`,
            payload,
        );
        return response.data;
    },


    /**
     * Get single Request.
     * GET /connect-us/{requestId}
     */
    getPublished: async (requestId: string): Promise<RequestResponse> => {
        try {
            const response = await api.get<RequestResponse>(
                `/connect-us/${requestId}`,
            );
            return response.data;
        } catch (err: unknown) {
            const status = (err as { response?: { status?: number } })?.response
                ?.status;
            if (status === 404) {
                // Treat 404 as "no published flows" for frontend purposes
                return null as unknown as RequestResponse;
            }
            throw err;
        }
    },

    /**
     * Update a request (admin).
     * PATCH /connect-us/{requestId}
     * Only status can be updated for now, but we can expand this in the future if needed.
     * Payload example: { status: "in_review" }
     * Allowed status values: "new", "in_review", "contacted", "rejected"
     * We can also add an optional "note" field for admins to leave internal comments about the request if needed.
     * update: async (
     *  requestId: string,
     *  payload: { status: string; note?: string },
     *  ): Promise<RequestResponse> => {
     *  const response = await api.patch<RequestResponse>(
     *    `/connect-us/${requestId}`,
     *    payload,
     *  );
     *  return response.data;
     * },
     **/
    updateRequest: async (
        requestId: string,
        payload: { status: string; note?: string },
    ): Promise<RequestResponse> => {
        const response = await api.patch<RequestResponse>(
            `/connect-us/${requestId}`,
            payload,
        );
        return response.data;
    },
};