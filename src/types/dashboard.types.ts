export interface DashboardOverview {
  summary: {
    totalCalls: number;
    activeCalls: number;
    totalScripts: number;
    activeScripts: number;
  };
  callStats: {
    total: number;
    byStatus: {
      initiating: number;
      active: number;
      completed: number;
      failed: number;
      retried: number;
    };
    successRate: number;
  };
  scriptStats: {
    total: number;
    active: number;
    inactive: number;
    byCallType: {
      inbound: number;
      outbound: number;
      both: number;
    };
    totalCallsMade: number;
    mostUsedScript: {
      name: string;
      calls: number;
    } | null;
  };
  recentActivity: {
    last24Hours: number;
    lastHour: number;
  };
}

export interface ScriptPerformance {
  id: string;
  name: string;
  callType: "inbound" | "outbound" | "both";
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  successRate: number;
  lastUsedAt: string | null;
  isActive: boolean;
  isDefault: boolean;
  activeCalls: number;
  retriedCalls: number;
}

export interface PerformanceUsageBucket {
  timestamp: string;
  total: number;
  completed: number;
  failed: number;
  active: number;
  retried: number;
}

export interface PerformanceUsageSeries {
  period: "hour" | "day" | "week" | "month";
  window: {
    from: string;
    to: string;
  };
  data: PerformanceUsageBucket[];
  totals: {
    total: number;
    completed: number;
    failed: number;
    active: number;
    retried: number;
  };
  peak: {
    timestamp: string;
    count: number;
  };
}

export interface FlowPerformanceReport {
  flows: FlowPerformance[];
  usage: PerformanceUsageSeries;
}

export interface AgentPerformanceReport {
  agents: AgentPerformance[];
  usage: PerformanceUsageSeries;
}

export interface CallActivity {
  callSid: string;
  status: string;
  phoneNumberFrom: string;
  phoneNumberTo: string;
  template: string;
  createdAt: string;
  updatedAt: string;
  duration?: number;
  scriptUsed?: {
    id: string;
    name: string;
  } | null;
  flowUsed?: {
    id: string;
    name: string;
  } | null;
  agentUsed?: {
    id: string;
    name: string;
  } | null;
  flowIdFromMetadata?: string;
  /** Present when the call has been analyzed for inbound intent (platform / super-admin views). */
  inboundInsight?: {
    category?: string;
    purpose?: string;
    summary?: string;
  } | null;
}

export interface TimeSeriesDataPoint {
  timestamp: string;
  count: number;
}

export interface CallVolumeData {
  period: string;
  data: TimeSeriesDataPoint[];
  total: number;
  peak: {
    timestamp: string;
    count: number;
  };
}

export interface TopScriptsResponse {
  templates: Array<{
    id: string;
    name: string;
    callType: "inbound" | "outbound" | "both";
    totalCalls: number;
    successRate: number;
    template: string;
  }>;
}

export interface SystemHealth {
  status: "healthy" | "warning" | "critical";
  metrics: {
    activeCallsCount: number;
    failedCallsRate: number;
    retriedCallsRate: number;
    inactiveScriptsCount?: number;
    avgCallDuration: number | string;
    totalFlows?: number;
    publishedFlows?: number;
    draftFlows?: number;
    totalAgents?: number;
    publishedAgents?: number;
  };
  flowStats?: {
    total: number;
    published: number;
    draft: number;
    archived: number;
  };
  agentStats?: {
    total: number;
    published: number;
    unpublished: number;
  };
  providerCredits?: {
    elevenLabs?: {
      status: string;
      tier: string;
      characterCount: number;
      characterLimit: number;
      charactersRemaining: number;
      nextCharacterCountResetUnix: number;
    };
    twilio?: {
      status: string;
      balance?: string | null;
      currency?: string | null;
      message?: string | null;
    };
    telnyx?: {
      status: string;
      availableCredit: string;
      currency: string;
    };
  };
  issues: string[];
}

export interface AgentPerformance {
  id: string;
  agentName: string;
  channel: string;
  isPublished: boolean;
  responseEngineType: string;
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  successRate: number;
  activeCalls: number;
  retriedCalls: number;
}

export interface FlowPerformance {
  id: string;
  name: string;
  status: string;
  scriptId: string | null;
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  successRate: number;
  lastUsedAt: string | null;
  activeCalls: number;
  retriedCalls: number;
}

export interface CallVolumeDataPoint {
  timestamp: string;
  agent: number;
  conversationFlow: number;
  script: number;
  other: number;
}

export interface CallVolumeByResourceResponse {
  period: "hour" | "day" | "week";
  data: CallVolumeDataPoint[];
  totals: {
    agent: number;
    conversationFlow: number;
    script: number;
    other: number;
  };
  peak: {
    timestamp: string;
    count: number;
  };
}

export interface ConversationMessage {
  role: "user" | "bot" | "system" | "agent";
  text?: string;
  content?: string;
  at?: string;
  timestamp?: string;
  metadata?: {
    duration?: number;
    transcript?: string;
    audioUrl?: string;
  };
  templateParameters?: string[];
}

export interface CallRecord {
  id: string;
  callSid: string;
  callerId: string;
  callerName?: string;
  callerEmail?: string;
  from: string;
  to: string;
  phoneNumberFrom?: string;
  phoneNumberTo?: string;
  status: "completed" | "failed" | "busy" | "no-answer" | "voicemail";
  initiatedAt: string;
  endedAt?: string;
  duration?: number;
  agentName?: string;
  scriptName?: string;
  flowName?: string;
  firstMessage?: string;
  conversationTranscript: ConversationMessage[];
  metadata?: {
    callType?: "inbound" | "outbound";
    areaCode?: string;
    city?: string;
    state?: string;
    country?: string;
    carrier?: string;
    trustedCallerAttribution?: {
      displayName?: string;
      callerName?: string;
      callerEmail?: string;
      company?: string;
      title?: string;
      source?: string;
    };
  };
}

export interface CallListRow {
  callSid: string;
  status: string;
  initiatedAt: string;
  createdAt: string;
  callerName?: string;
  callerEmail?: string;
  from: string;
  to: string;
  phoneNumberFrom?: string;
  phoneNumberTo?: string;
  firstMessage?: string;
  trustedCallerAttribution?: {
    callerName: string;
    callerEmail: string;
    company?: string;
    title?: string;
    source?: string;
  };
  metadata?: {
    firstMessage?: string;
    trustedCallerAttribution?: {
      displayName?: string;
      email?: string;
      callerName?: string;
      callerEmail?: string;
      company?: string;
      title?: string;
      source?: string;
    };
  };
}
