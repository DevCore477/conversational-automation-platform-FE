"use client";

import { ExternalLink, Cpu } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getResponseEngineFromAgentLike } from "@/lib/agent-normalize";
import {
  countFlowNodes,
  getFlowNodeLabels,
} from "@/lib/flow-node-utils";
import { type ConversationFlow } from "@/types/flow.types";
import {
  type Agent,
  isConversationFlowEngine,
  isLlmEngine,
  isScriptEngine,
  responseEngineLabel,
} from "@/types/agent.types";
import { type CallScript } from "@/types/script.types";

interface ResponseEnginePreviewProps {
  agent: Agent | null;
  flows: ConversationFlow[];
  scripts: CallScript[];
  companyId: string | null;
}

function FlowNodeList({ flow }: { flow: ConversationFlow }) {
  const labels = getFlowNodeLabels(flow);
  if (labels.length === 0) {
    return (
      <p className="mt-2 text-xs text-muted-foreground">No nodes in this flow.</p>
    );
  }
  const max = 12;
  const shown = labels.slice(0, max);
  const rest = labels.length - max;
  return (
    <ul className="mt-2 max-h-40 list-inside list-disc space-y-0.5 overflow-y-auto no-scrollbar text-xs text-muted-foreground">
      {shown.map((label, i) => (
        <li key={`${label}-${i}`} className="truncate">
          {label}
        </li>
      ))}
      {rest > 0 && (
        <li className="list-none text-muted-foreground/80">
          +{rest} more
        </li>
      )}
    </ul>
  );
}

export function ResponseEnginePreview({
  agent,
  flows,
  scripts,
  companyId,
}: ResponseEnginePreviewProps) {
  if (!agent) {
    return (
      <Card className="h-full min-h-[320px] border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Response engine</CardTitle>
          <CardDescription>
            Select an agent to see its conversation flow, script, or LLM
            configuration.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const engine = getResponseEngineFromAgentLike(agent);

  if (isConversationFlowEngine(engine)) {
    const primary = flows.find((f) => f.id === engine.conversation_flow_id);
    const extraIds = engine.conversation_flow_ids ?? [];
    const extras = extraIds
      .map((id) => flows.find((f) => f.id === id))
      .filter(Boolean) as ConversationFlow[];

    return (

      <Card className="flex h-full gap-1 min-h-0 flex-col bg-surface-soft-light p-[5px]">
        <CardHeader className="p-4 bg-sidebar rounded-t-lg">
          <div className="flex items-center gap-2">
            {/* <GitBranch className="h-4 w-4 text-muted-foreground" /> */}
            <CardTitle className="text-base">{responseEngineLabel(engine)}</CardTitle>
          </div>
          <CardDescription>
            Primary flow and any linked flows used by this agent.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col gap-4 space-y-3 py-4 bg-sidebar rounded-b-lg">
          <div className="space-y-3">
            <div>
              {primary ? (
                <div className="">
                  <p className="text-sm font-medium text-muted-foreground">
                    Primary flow
                  </p>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm md:text-base font-medium text-text-dark dark:text-sidebar-accent-foreground">{primary.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {countFlowNodes(primary)} nodes · {primary.status}
                      </p>
                      <FlowNodeList flow={primary} />
                    </div>
                    {companyId && (
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/conversation-flow/${primary.id}?companyId=${companyId}`}
                          className="text-xs md:text-base gap-1 text-[#0EA5E9]"
                        >
                          Open
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <p className="mt-1 text-sm text-amber-600 dark:text-amber-500">
                  Flow not found in this workspace (id:{" "}
                  <code className="rounded bg-muted px-1 text-xs">
                    {engine.conversation_flow_id}
                  </code>
                  ).
                </p>
              )}
            </div>

            {extraIds.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Additional flows
                </p>
                <ScrollArea className="mt-2 h-[min(200px,40vh)] rounded-md border">
                  <ul className="divide-y p-2">
                    {extraIds.map((fid) => {
                      const f = flows.find((x) => x.id === fid);
                      return (
                        <li
                          key={fid}
                          className="flex items-center justify-between gap-2 py-2 text-sm"
                        >
                          <span>
                            {f?.name ?? "Unknown"}{" "}
                            <code className="text-xs text-muted-foreground">
                              {fid.slice(0, 8)}…
                            </code>
                          </span>
                          {f && companyId && (
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/conversation-flow/${f.id}?companyId=${companyId}`} className="gap-1">
                                Open
                              </Link>
                            </Button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </ScrollArea>
              </div>
            )}

            {extras.length === 0 && extraIds.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No additional flow IDs configured.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isScriptEngine(engine)) {
    const script = scripts.find((s) => s.id === engine.script_id);
    return (
      <Card className="flex h-full gap-1 min-h-0 flex-col bg-surface-soft-light p-1">
        <CardHeader className="p-4 bg-sidebar rounded-t-2xl">
          <div className="flex items-center gap-2">
            {/* <FileText className="h-4 w-4 text-muted-foreground" /> */}
            <CardTitle className="text-base">{responseEngineLabel(engine)}</CardTitle>
          </div>
          <CardDescription>
            Call script content for this agent (read-only preview).
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-0 flex-1 space-y-3 pt-4  bg-sidebar rounded-b-2xl">
          {script ? (
            <>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{script.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {script.callType} · {script.model}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/scripts">Scripts</Link>
                </Button>
              </div>
              {script.description && (
                <p className="text-sm text-muted-foreground">
                  {script.description}
                </p>
              )}
              <ScrollArea className="h-[min(360px,50vh)] rounded-md border bg-muted/40 p-3">
                <pre className="whitespace-pre-wrap font-sans text-sm">
                  {script.script}
                </pre>
              </ScrollArea>
            </>
          ) : (
            <p className="text-sm text-amber-600 dark:text-amber-500">
              Script not found (id:{" "}
              <code className="rounded bg-muted px-1 text-xs">
                {engine.script_id}
              </code>
              ).
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (isLlmEngine(engine)) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">{responseEngineLabel(engine)}</CardTitle>
          </div>
          <CardDescription>
            LLM-backed response engine configuration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            <span className="text-muted-foreground">LLM ID:</span>{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              {engine.llm_id}
            </code>
          </p>
        </CardContent>
      </Card>
    );
  }

  return null;
}
