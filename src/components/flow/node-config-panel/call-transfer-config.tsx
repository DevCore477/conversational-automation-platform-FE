"use client";

import { Info } from "lucide-react";
import { type FC, memo, useCallback, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useConversationFlowStore } from "@/store/conversation-flow.store";
import { useFlowStore } from "@/store/flow.store";
import { useAuthStore } from "@/store/auth.store";
import { agentsService } from "@/service/agents.service";
import type { Agent } from "@/types/agent.types";
import type { FlowNode } from "@/types/flow.types";

type TransferType = "phone" | "flow" | "agent";

type TransferOption = "cold_transfer" | "warm_transfer";

interface TransferTypeConfig {
  label: string;
  badge: string;
  destinationLabel: string;
  destinationPlaceholder: string;
  typeDescription: string;
  destinationDescription: string;
  transferOptionLabel?: string;
  transferOptionDescription?: string;
}

const TRANSFER_TYPES: Record<TransferType, TransferTypeConfig> = {
  phone: {
    label: "Flow to Human",
    badge: "(Phone number)",
    destinationLabel: "Phone Number",
    destinationPlaceholder: "+1-555-0000",
    typeDescription: "Transfer the call to a human by phone number",
    destinationDescription: "Enter the phone number to transfer to",
    transferOptionLabel: "Transfer Type",
    transferOptionDescription: "Choose between warm or cold transfer",
  },
  flow: {
    label: "Flow to Flow",
    badge: "(Flow ID)",
    destinationLabel: "Flow ID",
    destinationPlaceholder: "flow-id-123",
    typeDescription: "Transfer to another configured flow or bot",
    destinationDescription: "Enter the ID of the flow to transfer to",
    transferOptionLabel: "Transfer Type",
    transferOptionDescription: "Choose between warm or cold transfer",
  },
  agent: {
    label: "Flow to Agent",
    badge: "(Agent ID)",
    destinationLabel: "Agent ID or Pool",
    destinationPlaceholder: "agent-pool-name or agent-id",
    typeDescription: "Transfer to an available agent or agent pool",
    destinationDescription: "Enter the agent ID or pool name",
    transferOptionLabel: "Transfer Type",
    transferOptionDescription: "Choose between warm or cold transfer",
  },
};

const TRANSFER_TYPE_KEYS = Object.keys(TRANSFER_TYPES) as TransferType[];

interface CallTransferConfigProps {
  node: FlowNode;
}

export const CallTransferConfig: FC<CallTransferConfigProps> = memo(({ node }) => {
  const updateNode = useFlowStore((s) => s.updateNode);
  const flowMetadata = useFlowStore((s) => s.flow.metadata);
  const flows = useConversationFlowStore((s) => s.flows);
  const user = useAuthStore((s) => s.user);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);

  const companyId = user?.companyId;
  const currentFlowId = flowMetadata?.flowId;

  useEffect(() => {
    if (companyId) {
      setIsLoadingAgents(true);
      agentsService.findByCompany(companyId).then((data) => {
        setAgents(data);
        setIsLoadingAgents(false);
      }).catch(() => {
        setIsLoadingAgents(false);
      });
    }
  }, [companyId]);

  const explicitType = node.data.transferType as TransferType | undefined;
  const transferDestination = (node.data.transferDestination as string) ?? "";
  const transferOption = (node.data.transferOption as TransferOption) ?? "cold_transfer";
  const warmTransfer = Boolean(node.data.warmTransfer);
  const instructionContent = (node.data.content as string) ?? "";
  const availableFlows = currentFlowId ? flows.filter((f) => f.id !== currentFlowId) : flows;
  const config = explicitType ? TRANSFER_TYPES[explicitType] : null;
  const selectValue = explicitType ?? "phone";
  const isFlowType = selectValue === "flow";
  const isAgentType = selectValue === "agent";

  const patchData = useCallback(
    (patch: Partial<FlowNode["data"]>) => {
      const sanitizedPatch: Partial<FlowNode["data"]> = {};
      if ('transferType' in patch) {
        sanitizedPatch.transferType = patch.transferType;
      }
      if ('transferDestination' in patch) {
        sanitizedPatch.transferDestination = patch.transferDestination;
      }
      if ('transferOption' in patch) {
        sanitizedPatch.transferOption = patch.transferOption;
        sanitizedPatch.warmTransfer = (patch.transferOption as TransferOption) === 'warm_transfer';
      }
      if ('warmTransfer' in patch) {
        sanitizedPatch.warmTransfer = patch.warmTransfer;
        sanitizedPatch.transferOption = patch.warmTransfer ? 'warm_transfer' : 'cold_transfer';
      }
      if ('content' in patch) {
        sanitizedPatch.content = patch.content;
      }
      if ('transferNotes' in patch) {
        sanitizedPatch.transferNotes = patch.transferNotes;
      }
      updateNode(node.id, { data: { ...node.data, ...sanitizedPatch } });
    },
    [node.id, node.data, updateNode],
  );

  return (
    <div className="space-y-4 border border-orange-200 dark:border-orange-800 rounded-lg p-4 bg-orange-50/50 dark:bg-orange-950/20">
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="text-sm font-medium cursor-help flex items-center gap-1"
            >
              Transfer Settings
              <Info className="h-4 w-4 text-muted-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs text-xs">
            <p>
              Configure where to transfer the call: to a human, another flow,
              an agent, or another agent.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="space-y-2">
        <Label htmlFor="transfer-type" className="text-sm font-medium">
          Transfer Type
        </Label>
        <Select
          value={selectValue}
          onValueChange={(value) => patchData({ transferType: value })}
        >
          <SelectTrigger id="transfer-type" className="w-full" showLeftBorder={false}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TRANSFER_TYPE_KEYS.map((type) => {
              const opt = TRANSFER_TYPES[type];
              return (
                <SelectItem key={type} value={type}>
                  <div className="flex items-center gap-2">
                    <span>{opt.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {opt.badge}
                    </span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {config?.typeDescription ?? ""}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="transfer-destination" className="text-sm font-medium">
          {config?.destinationLabel ?? "Destination"}
        </Label>
        {isFlowType && (
          <Select
            value={transferDestination || ""}
            onValueChange={(value) =>
              patchData({ transferDestination: value || undefined })
            }
          >
            <SelectTrigger id="transfer-destination" className="w-full" showLeftBorder={false}>
              <SelectValue placeholder="Select a flow" />
            </SelectTrigger>
            <SelectContent>
              {availableFlows.map((flow) => (
                <SelectItem key={flow.id} value={flow.id}>
                  {flow.name}
                </SelectItem>
              ))}
              {availableFlows.length === 0 && (
                <div className="p-2 text-xs text-muted-foreground">
                  No other flows available
                </div>
              )}
            </SelectContent>
          </Select>
        )}
        {isAgentType && (
          <Select
            value={transferDestination || ""}
            onValueChange={(value) =>
              patchData({ transferDestination: value || undefined })
            }
            disabled={isLoadingAgents}
          >
            <SelectTrigger id="transfer-destination" className="w-full" showLeftBorder={false}>
              <SelectValue placeholder={isLoadingAgents ? "Loading..." : "Select an agent"} />
            </SelectTrigger>
            <SelectContent>
              {agents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.agentName}
                </SelectItem>
              ))}
              {agents.length === 0 && !isLoadingAgents && (
                <div className="p-2 text-xs text-muted-foreground">
                  No agents available
                </div>
              )}
            </SelectContent>
          </Select>
        )}
        {!isFlowType && !isAgentType && (
          <Input
            id="transfer-destination"
            showLeftBorder={false}
            value={transferDestination}
            onChange={(e) =>
              patchData({
                transferDestination: e.target.value.trim() || undefined,
              })
            }
            placeholder={config?.destinationPlaceholder ?? "Enter destination"}
            className="text-sm"
          />
        )}
        <p className="text-xs text-muted-foreground">
          {config?.destinationDescription ?? ""}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="transfer-instruction" className="text-sm font-medium">
          Say this during transfer
        </Label>
        <Textarea
          id="transfer-instruction"
          value={instructionContent}
          onChange={(e) =>
            patchData({ content: e.target.value })
          }
          placeholder="e.g., 'Sure, let me connect you with our support team. Please hold.'"
          className="text-sm min-h-[80px]"
        />
        <p className="text-xs text-muted-foreground">
          Message the AI reads to the caller before transferring
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="transfer-option" className="text-sm font-medium">
          Transfer Option
        </Label>
        <Select
          value={transferOption}
          onValueChange={(value) => patchData({ transferOption: value as TransferOption })}
        >
          <SelectTrigger id="transfer-option" className="w-full" showLeftBorder={false}>
            <SelectValue placeholder="Select transfer type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cold_transfer">
              <div className="flex items-center gap-2">
                <span>Cold Transfer</span>
                <span className="text-xs text-muted-foreground">
                  (Direct transfer without briefing)
                </span>
              </div>
            </SelectItem>
            <SelectItem value="warm_transfer">
              <div className="flex items-center gap-2">
                <span>Warm Transfer</span>
                <span className="text-xs text-muted-foreground">
                  (Agent briefs recipient before transferring)
                </span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Choose between warm or cold transfer
        </p>
      </div>
    </div>
  );
});

CallTransferConfig.displayName = "CallTransferConfig";
