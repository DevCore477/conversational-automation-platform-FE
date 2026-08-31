export interface ErrorResponse {
  message: string;
  error: string;
  code: number;
}

/** Standard API error shape for user-facing messages (e.g. axios error.response.data) */
export interface ApiErrorShape {
  message: string;
  code?: string;
}
