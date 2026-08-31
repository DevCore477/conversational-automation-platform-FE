import type { BackendFlowPayload } from "@/types/flow.types";

import supportSalesPayload from "./default-template.json";
import appointmentBookingPayload from "./appointment-booking-template.json";

/** One flow template users can start from on the conversation flow screen */
export interface FlowTemplate {
  id: string;
  name: string;
  description?: string;
  payload: BackendFlowPayload;
}

/**
 * Registry of flow templates. Add more JSON files and entries here as needed.
 * Each template is selectable from the conversation flow screen.
 */
export const FLOW_TEMPLATES: FlowTemplate[] = [
  {
    id: "support-sales",
    name: "Support & Sales Flow (Legacy)",
    description:
      "Welcome, intents (support / sales / human), support capture, sales pricing/demo, handover and fallback. Legacy format.",
    payload: supportSalesPayload as BackendFlowPayload,
  },
  {
    id: "appointment-booking",
    name: "Appointment Booking Flow (New)",
    description:
      "Complete appointment booking flow with doctor selection, pet info, medication, and summary. New format with edges inside nodes.",
    payload: appointmentBookingPayload as BackendFlowPayload,
  },
];

export function getTemplateById(id: string): FlowTemplate | undefined {
  return FLOW_TEMPLATES.find((t) => t.id === id);
}

export function getTemplateIds(): string[] {
  return FLOW_TEMPLATES.map((t) => t.id);
}
