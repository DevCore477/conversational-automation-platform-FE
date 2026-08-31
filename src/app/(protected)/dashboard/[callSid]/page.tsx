"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Phone } from "lucide-react";
import { type ConversationMessage } from "@/types/dashboard.types";
import { format } from "date-fns";

interface TranscriptMessage {
  role: "agent" | "user";
  text: string;
}

interface CallRecord {
  callSid: string;
  status: string;
  companyId: string | null;
  phoneNumberFrom: string;
  phoneNumberTo: string;
  conversationTranscript: TranscriptMessage[];
}

function MessageBubble({ message }: { message: ConversationMessage }) {
  const isAgent = message.role === "agent";
  const time = message.at ? format(new Date(message.at), "h:mm a") : "";

  return (
    <div className={`flex ${isAgent ? "justify-start" : "justify-end"} mb-3`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
          isAgent
            ? "bg-muted text-foreground rounded-bl-md"
            : "bg-primary text-primary-foreground rounded-br-md"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        {time && (
          <p
            className={`text-[10px] mt-1 ${
              isAgent ? "text-muted-foreground" : "text-primary-foreground/70"
            } text-right`}
          >
            {time}
          </p>
        )}
      </div>
    </div>
  );
}

const CallDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const callSid = params.callSid as string;

  const [callRecord, setCallRecord] = useState<CallRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get auth token from cookies
  const getAuthToken = () => {
    const cookies = document.cookie.split("; ");
    const authCookie = cookies.find((row) => row.startsWith("auth-token="));
    return authCookie ? authCookie.split("=")[1] : null;
  };

  useEffect(() => {
    const fetchCallDetails = async () => {
      if (!callSid) return;

      setIsLoading(true);
      setError(null);

      const token = getAuthToken();

      if (!token) {
        setError("Authentication token not found. Please login again.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/calls/records/${callSid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized. Please login again.");
          }
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data = await response.json();
        setCallRecord(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCallDetails();
  }, [callSid]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Header always visible */}
        <div className="flex items-center gap-4 p-4 border-b">
          <button onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
          </button>

          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Phone className="h-5 w-5 text-muted-foreground" />
            </div>
            <p>{callSid}</p>
          </div>
        </div>

        <div className="p-6">
          <p>Loading call details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !callRecord) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex items-center gap-4 p-4 border-b">
          <button onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
          </button>

          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Phone className="h-5 w-5 text-muted-foreground" />
            </div>
            <p>{callSid}</p>
          </div>
        </div>

        <div className="p-6">
          <p className="text-danger-soft">{error || "Call not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex items-center gap-4 p-4 border-b">
          <button onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
          </button>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Phone className="h-5 w-5 text-muted-foreground" />
            </div>
            <p>{callRecord.phoneNumberFrom}</p>
          </div>
          <div className="">
            <p>{callRecord.status}</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-background to-muted/20">
          {callRecord.conversationTranscript &&
          callRecord.conversationTranscript.length > 0 ? (
            <div className="space-y-1">
              {callRecord.conversationTranscript.map((message, index) => (
                <MessageBubble key={index} message={message} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Phone className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm font-medium">No conversation recorded</p>
              <p className="mt-1 text-sm text-muted-foreground">
                This call has no conversation transcript.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CallDetailsPage;
