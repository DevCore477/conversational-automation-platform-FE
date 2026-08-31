export interface MakeCall {
  to: string;
  script?: string | undefined;
  model?: string;
  scriptId?: string | undefined;
  callerName?: string | undefined;
  callerEmail?: string | undefined;
  flowId?: string | undefined;
  agentId?: string | undefined;
  voiceId?: string | undefined;
}

export interface CallResponse {
  success: boolean;
  callSid: string;
  twimlUrl: string;
  callState: {
    status: string;
    model: string;
    createdAt: string;
  };
  message?: string;
  statusCode?: number;
}

export interface PartialMakeCall {
  to: string;
  script?: string | undefined;
  model?: string;
  scriptId?: string | undefined;
  callerName?: string | undefined;
  callerEmail?: string | undefined;
  /**
   * Optional conversation flow ID when calls are driven by flows
   * instead of scripts.
   */
  flowId?: string | undefined;
  agentId?: string | undefined;
  voiceId?: string | undefined;
}
