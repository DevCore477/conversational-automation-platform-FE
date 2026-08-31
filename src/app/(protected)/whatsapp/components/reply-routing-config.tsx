"use client";

import { useEffect, useState } from "react";
import { Bot, ChevronDown, ChevronRight } from "lucide-react";

import { OpenAIModel } from "@/common/enums/model.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { agentsService } from "@/service/agents.service";
import { flowService } from "@/service/flow.service";
import api from "@/lib/axios";
import { useCompanyStore } from "@/store/company.store";
import type { Agent } from "@/types/agent.types";
import type { ConversationFlow } from "@/types/flow.types";
import type { ReplyRouting, ReplyRoutingMode } from "@/types/whatsapp.types";

const ROUTING_MODES: { value: ReplyRoutingMode; label: string }[] = [
  { value: "ai", label: "AI Reply" },
  { value: "agent", label: "Agent" },
  { value: "flow", label: "Flow" },
  { value: "script", label: "Script" },
  { value: "database_default", label: "Database Default" },
];

interface CallScript {
  id: string;
  name: string;
}

interface ReplyRoutingConfigProps {
  value: ReplyRouting;
  onChange: (routing: ReplyRouting) => void;
}

export function ReplyRoutingConfig({ value, onChange }: ReplyRoutingConfigProps) {
  const [open, setOpen] = useState(false);
  const { company } = useCompanyStore();
  const companyId = company?.id;

  const [agents, setAgents] = useState<Agent[]>([]);
  const [flows, setFlows] = useState<ConversationFlow[]>([]);
  const [scripts, setScripts] = useState<CallScript[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);

    const fetchAll = async () => {
      const scriptsEndpoint = companyId
        ? `/call-scripts/company/${companyId}`
        : "/call-scripts";

      await Promise.allSettled([
        agentsService.findAll(companyId).then(setAgents).catch(() => {}),
        flowService.getPublished(companyId ?? "").then(setFlows).catch(() => {}),
        api.get(scriptsEndpoint)
          .then((r) => {
            if (Array.isArray(r.data)) setScripts(r.data);
          })
          .catch(() => {}),
      ]);
      setLoading(false);
    };

    void fetchAll();
  }, [open, companyId]);

  const mode = value.routingMode ?? "";

  const update = (patch: Partial<ReplyRouting>) => {
    onChange({ ...value, ...patch });
  };

  const handleModeChange = (newMode: string) => {
    if (newMode === "" || newMode === "none") {
      onChange({});
      return;
    }
    onChange({
      routingMode: newMode as ReplyRoutingMode,
      ...(newMode === "agent" ? { agentId: value.agentId ?? "" } : { agentId: null }),
      ...(newMode === "flow" ? { flowId: value.flowId ?? "" } : { flowId: null }),
      ...(newMode === "script" ? { scriptId: value.scriptId ?? "" } : { scriptId: null }),
      ...(newMode === "ai" ? { aiModel: value.aiModel ?? "", aiSystemPrompt: value.aiSystemPrompt ?? "" } : {}),
    });
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        <Bot className="h-4 w-4" />
        Reply Routing
        {mode && ROUTING_MODES.some((m) => m.value === mode) && (
          <span className="text-xs text-primary font-normal">
            ({ROUTING_MODES.find((m) => m.value === mode)?.label ?? mode})
          </span>
        )}
      </button>

      {open && (
        <div className="space-y-3 rounded-lg border p-3">
          <div className="space-y-2">
            <Label>Routing Mode</Label>
            <Select value={mode} onValueChange={handleModeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Default (no routing)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Default (no routing)</SelectItem>
                {ROUTING_MODES.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-4">
              <Spinner className="h-4 w-4" />
            </div>
          )}

          {mode === "agent" && !loading && (
            <div className="space-y-2">
              <Label>Agent</Label>
              <Select
                value={value.agentId ?? ""}
                onValueChange={(v) => update({ agentId: v })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.agentName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {mode === "flow" && !loading && (
            <div className="space-y-2">
              <Label>Flow</Label>
              <Select
                value={value.flowId ?? ""}
                onValueChange={(v) => update({ flowId: v })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a flow" />
                </SelectTrigger>
                <SelectContent>
                  {flows.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {mode === "script" && !loading && (
            <div className="space-y-2">
              <Label>Script</Label>
              <Select
                value={value.scriptId ?? ""}
                onValueChange={(v) => update({ scriptId: v })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a script" />
                </SelectTrigger>
                <SelectContent>
                  {scripts.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {mode === "ai" && (
            <>
              <div className="space-y-2">
                <Label>AI Model</Label>
                <Select
                  value={value.aiModel ?? ""}
                  onValueChange={(v) => update({ aiModel: v })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={OpenAIModel.GPT_4O_MINI}>
                      GPT-4o Mini
                    </SelectItem>
                    <SelectItem value={OpenAIModel.GPT_5_NANO}>
                      GPT-5 Nano
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>System Prompt</Label>
                <Textarea
                  placeholder="Optional system prompt for the AI..."
                  value={value.aiSystemPrompt ?? ""}
                  onChange={(e) => update({ aiSystemPrompt: e.target.value })}
                  maxLength={16000}
                  className="min-h-[80px]"
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
