"use client";

import { type ConversationFlow } from "@/types/flow.types";
import { type CallScript } from "@/types/script.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FlowListPickerProps {
  flows: ConversationFlow[];
  value: string | undefined;
  onChange: (id: string) => void;
  /** When saved id is not in `flows` yet */
  fallbackId?: string;
  fallbackLabel?: string;
  heading?: string;
  subheading?: string;
}

export function FlowListPicker({
  flows,
  value,
  onChange,
  fallbackId,
  fallbackLabel,
  heading = "Conversation flows",
  subheading = "Select the flow this agent will use.",
}: FlowListPickerProps) {

  const options: { id: string; name: string; isFallback: boolean }[] = flows.map(
    (f) => ({ id: f.id, name: f.name, isFallback: false })
  );
  
  if (fallbackId && !options.some((opt) => opt.id === fallbackId)) {
    options.unshift({
      id: fallbackId,
      name: fallbackLabel ?? `Unknown flow (${fallbackId.slice(0, 8)}…)`,
      isFallback: true,
    });
  }

  const selectedFlow = options.find((opt) => opt.id === value);

  if (options.length === 0) {
    return (
      <div className="space-y-2">
        <div>
          <h4 className="text-sm font-medium text-foreground">{heading}</h4>
          <p className="text-xs text-muted-foreground">{subheading}</p>
        </div>
        <p className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
          No conversation flows yet. Create one under Conversation Flow, then
          refresh.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div>
        <h4 className="text-sm font-medium text-foreground">{heading}</h4>
        <p className="text-xs text-muted-foreground">{subheading}</p>
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full max-w-58 xs:max-w-84 sm:max-w-full" >
          <SelectValue placeholder="Select a conversation flow">
            {selectedFlow?.name}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem 
              key={option.id} 
              value={option.id}
              className={option.isFallback ? "text-amber-600 dark:text-amber-500" : ""}
            >
              {option.name}
              {option.isFallback && " (Missing)"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface ScriptListPickerProps {
  scripts: CallScript[];
  value: string | undefined;
  onChange: (id: string) => void;
  fallbackId?: string;
  fallbackLabel?: string;
  heading?: string;
  subheading?: string;
}

export function ScriptListPicker({
  scripts,
  value,
  onChange,
  fallbackId,
  fallbackLabel,
  heading = "Call scripts",
  subheading = "Select the script this agent will use.",
}: ScriptListPickerProps) {

  const options: { id: string; name: string; isFallback: boolean }[] = scripts.map(
    (s) => ({ id: s.id, name: s.name, isFallback: false })
  );
  
  if (fallbackId && !options.some((opt) => opt.id === fallbackId)) {
    options.unshift({
      id: fallbackId,
      name: fallbackLabel ?? `Unknown script (${fallbackId.slice(0, 8)}…)`,
      isFallback: true,
    });
  }

  const selectedScript = options.find((opt) => opt.id === value);

  if (options.length === 0) {
    return (
      <div className="space-y-2">
        <div>
          <h4 className="text-sm font-medium text-foreground">{heading}</h4>
          <p className="text-xs text-muted-foreground">{subheading}</p>
        </div>
        <p className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
          No call scripts yet. Create one under Scripts, then refresh.
        </p>
      </div>
    );
  }

   return (
    <div className="space-y-2">
      <div>
        <h4 className="text-sm font-medium text-foreground">{heading}</h4>
        <p className="text-xs text-muted-foreground">{subheading}</p>
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full max-w-60 xs:max-w-84 sm:max-w-full">
          <SelectValue placeholder="Select a call script">
            {selectedScript?.name}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem 
              key={option.id} 
              value={option.id}
              className={option.isFallback ? "text-amber-600 dark:text-amber-500" : ""}
            >
              {option.name}
              {option.isFallback && " (Missing)"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
