// components/CallDetailDialog.tsx
"use client";

import { format } from "date-fns";
import { Phone } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/get-error-message";
import { callService } from "@/service/call.service";
import { renderTemplateTextWithValues } from "@/lib/whatsapp-template-runtime";
import { type CallRecord, type ConversationMessage,} from "@/types/dashboard.types";


interface CallDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callSid: string;
}

function MessageBubble({ message }: { message: ConversationMessage }) {
  const isAgent = message.role === "agent";
  const time = message.at ? format(new Date(message.at), "h:mm a") : "";

  return (
    <div className={`flex flex-col ${isAgent ? "items-start" : "items-end"} mb-3`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 relative  ${
          isAgent
            ? "bg-surface-soft/10 text-text-dark rounded-lg"
            : "bg-primary text-primary-foreground rounded-lg"
          }`}
      >
        {!isAgent && ( <div className="absolute inset-0 bg-white/40 rounded-lg" />)}
        <p className="text-xs sm:text-sm whitespace-pre-wrap relative z-10">
          {message.templateParameters && message.text
            ? renderTemplateTextWithValues(message.text, message.templateParameters)
            : message.text}
        </p>
        
        {time && (
          <p
            className={`text-[10px] mt-1 ${isAgent ? "text-muted-foreground" : "text-primary-foreground/70"} text-right`}
          >
            {time}
          </p>
        )}
      </div>
      <span
        className={`text-[11px] mt-2 ${ isAgent ? "text-cyan-blue" : "text-success"} font-medium`}
      >
        {isAgent ? "Agent" : "User"}
      </span>
    </div>
  );
}

function getStatusColor(status: string | undefined) {
  if (!status) return null;
  
  const statusLower = status.toLowerCase();
  
  switch (statusLower) {
    case "completed": return <span className="text-success">Completed</span>;
    case "active": return <span className="text-cyan-blue">Active</span>;
    case "initiating": return <span className="text-warning">Initiating</span>;
    case "failed": return <span className="text-danger-soft">Failed</span>;
    default: return <span className="text-gray-600">{status}</span>;
  }
}

export function CallDetailDialog({ open, onOpenChange, callSid }: CallDetailDialogProps) {
  const [call, setCall] = useState<CallRecord | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await callService.getCallRecord(callSid);
      setCall(data);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load call details"));
    } finally {
      setLoading(false);
    }
  }, [callSid]);

  // Reset and load when dialog opens with new callSid
  useEffect(() => {
    if (open && callSid) {
      setCall(null);
      void load();
    }
  }, [open, callSid, load]);

  const messages: ConversationMessage[] =
    Array.isArray(call?.conversationTranscript) ? call.conversationTranscript : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-11/12 !max-w-2xl h-[80vh] gap-1 flex flex-col !p-[5px] bg-surface-soft-light shadow-none">
        <DialogHeader className="p-4 border-b bg-sidebar rounded-t-lg">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-1  justify-between">
            <div className="flex-1">
              <DialogTitle className="text-start font-medium text-sm sm:text-base md:text-lg text-text-dark">
                {call?.metadata?.trustedCallerAttribution?.displayName
                  ?? (call?.metadata?.callType === "outbound"
                    ? call?.phoneNumberTo
                    : call?.phoneNumberFrom ?? "")}
              </DialogTitle>
              <div className="flex flex-col sm:flex-row items-cente sm:gap-5">
                {call?.metadata?.trustedCallerAttribution?.displayName && (
                  <>
                    <div className="flex items-center gap-1">
                      <span className="bg-cyan-blue size-1.5 rounded-full mr-0.5"></span>
                      <span className="text-sm text-cyan-blue">From:</span>
                      <p className="text-xs text-muted-foreground">
                        {call?.metadata?.callType === "outbound" ? call?.phoneNumberFrom : call?.phoneNumberFrom}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="bg-success size-1.5 rounded-full mr-0.5"></span>
                      <span className="text-sm text-success">To:</span>
                      <p className="text-xs text-muted-foreground">
                        {call?.metadata?.callType === "outbound" ? call?.phoneNumberTo : call?.phoneNumberFrom}
                      </p>
                  </div>
                </>
              )}
              </div>
             
            </div>
            <div className="text-sm mb-1 mr-6">
              {call && getStatusColor(call.status)}
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col flex-1 overflow-hidden bg-sidebar rounded-b-lg">
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-background to-muted/20">
            {loading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      i % 2 === 0 ? "justify-start" : "justify-end"
                    }`}
                  >
                    <Skeleton className="h-16 w-64 rounded-2xl" />
                  </div>
                ))}
              </div>
            ) : call ? (
              messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Phone className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm font-medium">No conversation recorded</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    This call has no conversation transcript.
                  </p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <MessageBubble key={index} message={msg} />
                ))
              )
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Call not found</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}