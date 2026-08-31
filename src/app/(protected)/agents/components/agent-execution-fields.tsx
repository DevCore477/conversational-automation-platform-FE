"use client";

import { ListOrdered, Waypoints,Layers } from "lucide-react";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { type CreateAgentFormValues } from "../schemas/agent.schema";

const EXECUTION_MODES = [
  {
    value: "flex" as const,
    title: "Flex Mode",
    description:
      "Keeps one shared context across your flow so replies can adapt as the conversation moves between nodes.",
    Icon: Waypoints,
    iconWrapClass: "bg-sidebar text-[#505050] dark:text-white",
    buttonBg: "bg-surface-soft/15",
    selectedBg: "border-surface-soft/50 bg-surface-soft/25",
  },
  {
    value: "rigid" as const,
    title: "Rigid Mode",
    description:
      "Moves through your flow in sequence and stays aligned with each step before continuing—suited to tightly scripted paths.",
    Icon: Layers,
    iconWrapClass: "bg-sidebar text-[#505050] dark:text-white",
    buttonBg: "bg-surface-peach-light",
    selectedBg: "border-surface-peach/70 bg-surface-peach/25",
  },
];

/**
 * Execution mode (flex / rigid) and global system prompt — persisted as `mode` and `globalPrompt` on the agent.
 */
export function AgentExecutionFields() {
  const { control } = useFormContext<CreateAgentFormValues>();

  return (
    <>
      <FormField
        control={control}
        name="mode"
        render={({ field }) => (
          <FormItem className="space-y-">
            <FormLabel className="text-base font-medium">
              Execution Mode
            </FormLabel>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" role="radiogroup" aria-label="Execution mode">
              {EXECUTION_MODES.map(
                ({ value, title, description, Icon, iconWrapClass, buttonBg, selectedBg, }) => {
                  const selected = field.value === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => field.onChange(value)}
                      className={cn(
            "flex w-full gap-4 rounded-xl border p-4 text-left transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            selected
              ? selectedBg
              : cn("border-border", buttonBg),
          )}
                    >
                      <div
                        className={cn(
                          "flex size-8 md:size-12 shrink-0 items-center justify-center rounded-md md:rounded-xl shadow",
                          iconWrapClass,
                        )}
                      >
                        <Icon className="size-5 md:size-6" strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="font-medium text-sm leading-tight">{title}</p>
                        <p className="text-xs text-muted-foreground leading-snug">
                          {description}
                        </p>
                      </div>
                    </button>
                  );
                },
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="globalPrompt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Global Prompt</FormLabel>
            <FormControl>
              <Textarea
                placeholder="System instructions for this agent (persona, constraints, transcription hints, etc.)"
                className="text-sm 4xl:text-base min-h-[80px] resize-y"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
