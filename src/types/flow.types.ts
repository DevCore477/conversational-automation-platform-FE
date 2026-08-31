// Flow Builder Types and Enums

export enum NodeType {
  Start = "start",
  Conversation = "conversation",
  Function = "function",
  CallTransfer = "transfer_call",
  PressDigit = "press-digit",
  LogicSplit = "logic-split",
  AgentTransfer = "agent-transfer",
  SMS = "sms",
  ExtractVariable = "extract-variable",
  MCP = "mcp",
  Ending = "ending",
  Script = "script",
}

export type ContentType = "static" | "prompt";

// ============================================
// Simplified Variable System Types
// ============================================

// Three simple categories for variables
export enum VariableCategory {
  System = "system", // Auto-provided by system (session_id, caller_number, etc.)
  Prompt = "prompt", // Auto-detected from {{var}} in globalPrompt
  Custom = "custom", // User-defined variables
}

export interface Variable {
  id: string;
  name: string; // e.g., "user_name" - used in {{user_name}}
  displayName: string; // e.g., "User Name" - for UI display
  category: VariableCategory;
  defaultValue?: string;
  description?: string;
  isReadOnly?: boolean; // System variables are read-only
}

export interface VariableExtraction {
  id: string;
  variableName: string;
  extractionType: "regex" | "json_path" | "ai_extraction";
  pattern?: string;
  aiPrompt?: string;
  defaultValue?: string;
}

// ============================================
// Transition Condition Types (for condition builder)
// ============================================

export enum ConditionOperator {
  Equals = "==",
  NotEquals = "!=",
  GreaterThan = ">",
  LessThan = "<",
  GreaterOrEqual = ">=",
  LessOrEqual = "<=",
  Contains = "contains",
  NotContains = "not_contains",
  Exists = "exists",
  NotExists = "not_exists",
  StartsWith = "starts_with",
  EndsWith = "ends_with",
}

export const CONDITION_OPERATOR_LABELS: Record<ConditionOperator, string> = {
  [ConditionOperator.Equals]: "Equals (=)",
  [ConditionOperator.NotEquals]: "Does Not Equal (≠)",
  [ConditionOperator.GreaterThan]: "Greater Than (>)",
  [ConditionOperator.LessThan]: "Smaller Than (<)",
  [ConditionOperator.GreaterOrEqual]: "Greater Than or Equal (≥)",
  [ConditionOperator.LessOrEqual]: "Smaller Than or Equal (≤)",
  [ConditionOperator.Contains]: "Contains (∈)",
  [ConditionOperator.NotContains]: "Does Not Contain",
  [ConditionOperator.Exists]: "Exists (∃)",
  [ConditionOperator.NotExists]: "Does Not Exist",
  [ConditionOperator.StartsWith]: "Starts With",
  [ConditionOperator.EndsWith]: "Ends With",
};

export interface TransitionCondition {
  id: string;
  variableName: string; // e.g., "order_status"
  operator: ConditionOperator;
  value: string; // e.g., "completed"
}

export interface TransitionConditionGroup {
  matchType: "any" | "all"; // Any = OR, All = AND
  conditions: TransitionCondition[];
}

// ============================================
// Global Settings Types
// ============================================

export interface GlobalSettings {
  globalPrompt: string;
  systemVariables: Variable[]; // Auto-provided by system
  promptVariables: Variable[]; // Auto-detected from globalPrompt
  customVariables: Variable[]; // User-defined
}

// ============================================
// Session Context Types
// ============================================

export interface SessionContext {
  sessionId: string;
  callStartTime: string;
  callDuration: number;
  botName: string;
  language: string;
  variables: Record<string, unknown>; // Runtime variable values
  history: ContextHistoryEntry[];
}

export interface ContextHistoryEntry {
  timestamp: string;
  nodeId: string;
  nodeName: string;
  action: "read" | "write" | "evaluate";
  variableName: string;
  previousValue?: unknown;
  newValue?: unknown;
}

// ============================================
// Flow Runner Types
// ============================================

export enum FlowExecutionStatus {
  Idle = "idle",
  Running = "running",
  Paused = "paused",
  Completed = "completed",
  Error = "error",
}

export interface FlowExecutionState {
  status: FlowExecutionStatus;
  currentNodeId: string | null;
  previousNodeId: string | null;
  executionPath: string[]; // List of node IDs visited
  context: SessionContext;
  errors: FlowExecutionError[];
  startTime: string | null;
  endTime: string | null;
}

export interface FlowExecutionError {
  nodeId: string;
  message: string;
  type: "variable_not_found" | "invalid_expression" | "execution_error";
  timestamp: string;
}

// ============================================
// Node Data Extensions for Variables
// ============================================

export interface NodeVariableConfig {
  inputVariables?: string[];
  outputVariables?: VariableExtraction[];
}

// Keep LogicOperator for backward compatibility
export enum LogicOperator {
  Equals = "==",
  NotEquals = "!=",
  GreaterThan = ">",
  LessThan = "<",
  GreaterThanOrEqual = ">=",
  LessThanOrEqual = "<=",
  Contains = "contains",
  StartsWith = "startsWith",
  EndsWith = "endsWith",
  IsEmpty = "isEmpty",
  IsNotEmpty = "isNotEmpty",
}

export interface LogicCondition {
  id: string;
  transitionId: string;
  expression: string;
  operator: LogicOperator;
  leftOperand: string;
  rightOperand: string;
}

export type TransitionType = "condition" | "prompt";

export interface NodeTransition {
  id: string;
  label: string;
  targetNodeId: string | null;
  transitionType?: TransitionType; // How to determine if this transition is taken
  condition?: string; // Legacy: simple expression string
  conditions?: TransitionConditionGroup; // Structured condition builder
  prompt?: string; // AI prompt to determine when to take this transition
}

export interface FlowNode {
  id: string;
  type: NodeType;
  label: string;
  position: { x: number; y: number };
  data: {
    content?: string;
    title?: string;
    contentType?: ContentType;
    transitions: NodeTransition[];
    /** Backend-shaped fields for BE payload */
    intentScope?: string[];
    fallbackNodeId?: string;
    intentTransitions?: { on_intent: string; to: string }[];
    captureSlot?: string;
    listenNext?: string;
    isEnd?: boolean;
    toolName?: string;
    /** Schema for values merged into the session after the tool runs (matches `flow.tools[].returns`). */
    toolReturns?: BackendToolReturns;
    startSpeaker?: "agent" | "user";
    interruptionSensitivity?: number;
    [key: string]: unknown;
  };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  // Optional handle IDs to bind edges to specific transition handles
  sourceHandle?: string | null;
  targetHandle?: string | null;
}

// ============================================
// Backend payload types (BE contract)
// ============================================

/** Listen mode: intent routing, slot capture, or simple next */
export interface BackendListenIntent {
  intent_scope: string[];
  fallback: string; // node id
}

export interface BackendListenCapture {
  capture_slot: string;
  next: string; // node id
}

export interface BackendListenNext {
  next: string; // node id
}

export type BackendListen =
  | BackendListenIntent
  | BackendListenCapture
  | BackendListenNext;

export interface BackendIntentTransition {
  on_intent: string;
  to: string; // node id
}

export interface BackendTransitionCondition {
  type: "prompt";
  prompt: string;
}

export interface BackendEdge {
  id: string;
  condition: string;
  destination_node_id: string;
  transition_condition: BackendTransitionCondition;
}

export interface BackendInstruction {
  text: string;
  type: "prompt" | "static";
}

export interface BackendToolParameters {
  type: string;
  properties: Record<string, { type: string; description?: string }>;
  required?: string[];
}

/** Tool result shape for slot merge / `{{variables}}` in downstream nodes (JSON Schema–style). */
export type BackendToolReturns = BackendToolParameters & {
  description?: string;
};

export interface BackendTool {
  name: string;
  description?: string;
  parameters?: BackendToolParameters;
  /** Declares fields the executor merges into session slots after the tool runs. */
  returns?: BackendToolReturns;
  executor_key?: string;
}

/** Tool catalog entry at `flow.tools[]` (schema + executor). */
export type BackendToolCatalogEntry = BackendTool;

/**
 * Tool invocation on a `type: "tool"` node: maps argument names to slot/template strings
 * (e.g. `{ "location": "{{location}}" }`).
 */
export interface BackendToolInvocation {
  name: string;
  parameters?: Record<string, string>;
}

/**
 * Transfer call node — used when `type === "transfer_call"`.
 * Contains a singular `edge` for the fallback path, plus transfer configuration.
 */
export interface TransferCallNode {
  instruction?: BackendInstruction;
  name: string;
  id: string;
  type: "transfer_call";
  display_position?: { x: number; y: number };
  transfer_destination: { type: string; number?: string };
  edge: BackendEdge;
  transfer_option?: {
    type: "cold_transfer" | "warm_transfer";
    show_transferee_as_caller?: boolean;
    enable_bridge_audio_cue?: boolean;
  };
  global_node_setting?: { condition: string };
}

export interface BackendNode {
  id: string;
  name: string;
  type: "conversation" | "end" | "ending" | "tool" | "transfer_call";
  edges?: BackendEdge[];
  instruction?: BackendInstruction;
  start_speaker?: "agent" | "user";
  display_position?: { x: number; y: number };
  interruption_sensitivity?: number;
  /** Conversation nodes: optional slot capture (backend snake_case). */
  capture_slot?: string;
  tool?: BackendTool | BackendToolInvocation;
  call_transfer?: {
    type: "phone" | "flow" | "agent" | "agent-to-agent";
    destination: string;
    warm_transfer?: boolean;
    notes?: string;
  };
  transfer_destination?: { type: string; number?: string };
  edge?: BackendEdge;
  transfer_option?: {
    type: "cold_transfer" | "warm_transfer";
    show_transferee_as_caller?: boolean;
    enable_bridge_audio_cue?: boolean;
  };
  global_node_setting?: { condition: string };
}

export interface BackendFlow {
  nodes: BackendNode[];
  start_node_id: string;
  start_speaker?: "agent" | "user";
  /** Declares callable tools (schemas). Invocations live on `type: "tool"` nodes. */
  tools?: BackendToolCatalogEntry[];
}

export interface BackendNodePayload {
  say: { template: string };
  listen?: BackendListen;
  transitions?: BackendIntentTransition[];
  end?: boolean;
  tool?: { name: string };
  title?: string; // Node title/name
  position?: { x: number; y: number }; // Node position on canvas
}

export type BackendNodes = Record<string, BackendNodePayload>;

export type BackendIntents = Record<string, { rules: string[] }>;

/** Slot names used in the flow (capture_slot), each with initial value (e.g. "") */
export type BackendSlots = Record<string, string>;

/** Payload shape the backend accepts */
export interface BackendFlowPayload {
  start: string;
  flow?: BackendFlow; // New format with nodes having edges inside
  nodes?: BackendNodes; // Legacy format
  /** All capture_slot names used in nodes, with empty string value (built when saving; may be omitted in legacy/template payloads) */
  slots?: BackendSlots;
  intents: BackendIntents;
}

// ============================================
// Flow Data (internal + BE-compatible fields)
// ============================================

export interface FlowData {
  nodes: FlowNode[];
  edges: FlowEdge[];
  metadata?: {
    name?: string;
    description?: string;
    createdAt?: string;
    /** Map of node IDs to their custom titles */
    nodeTitles?: Record<string, string>;
    /** The backend flow ID (set when loading from API/template) */
    flowId?: string;
  };
  /** Intents for BE payload: intent id → { rules: string[] } */
  intents?: BackendIntents;
}

export interface SelectedNode {
  id: string;
  data: FlowNode;
}

export const NODE_TYPE_LABELS: Record<NodeType, string> = {
  [NodeType.Start]: "Start",
  [NodeType.Conversation]: "Conversation",
  [NodeType.Function]: "Function",
  [NodeType.CallTransfer]: "Call Transfer",
  [NodeType.PressDigit]: "Press Digit",
  [NodeType.LogicSplit]: "Logic Split",
  [NodeType.AgentTransfer]: "Agent Transfer",
  [NodeType.SMS]: "SMS",
  [NodeType.ExtractVariable]: "Extract Variable",
  [NodeType.MCP]: "MCP",
  [NodeType.Ending]: "Ending",
  [NodeType.Script]: "Script",
};

// ============================================
// Conversation Flow API (backend entity)
// ============================================

export type FlowStatus = "draft" | "published" | "archived";

export interface ConversationFlow {
  id: string;
  companyId: string;
  scriptId: string | null;
  name: string;
  status: FlowStatus;
  version: number;
  flow: BackendFlowPayload;
  flowData?: BackendFlow; // New format
  /** When the flow was last published (null if never published) */
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  /**
   * Soft-delete timestamp. Null for active flows.
   * Used by GET /flows/company/:companyId/trash where deletedAt != null.
   */
  deletedAt: string | null;
}

export interface CreateFlowDto {
  name: string;
  scriptId?: string | null;
  flow: BackendFlowPayload;
}

export interface UpdateFlowDto {
  flow: BackendFlowPayload;
}

export interface ValidateFlowResponse {
  valid: boolean;
  startNode?: string;
  nodes?: string[];
}
