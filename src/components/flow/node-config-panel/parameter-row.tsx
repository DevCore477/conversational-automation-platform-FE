"use client";

import { Plus, X } from "lucide-react";
import { type FC, memo, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { ToolParamSchema, ToolSchemaTarget } from "./schema-helpers";

const TYPE_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "string", label: "String" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" },
  { value: "object", label: "Object" },
  { value: "array", label: "Array" },
];

const NAME_LABELS: Record<
  ToolSchemaTarget,
  { label: string; placeholder: string }
> = {
  toolParameters: { label: "Parameter Name", placeholder: "Parameter name" },
  toolReturns: { label: "Field name", placeholder: "Slot / field name" },
};

export interface ParameterRowHandlers {
  onUpdateName: (path: string[], oldKey: string, newKey: string) => void;
  onUpdateField: (
    path: string[],
    key: string,
    updates: Partial<ToolParamSchema>,
  ) => void;
  onToggleRequired: (key: string) => void;
  onRemove: (path: string[], key: string) => void;
  onAddNested: (
    path: string[],
    parentKey: string,
    currentParam: ToolParamSchema,
  ) => void;
}

interface ParameterRowProps {
  schemaTarget: ToolSchemaTarget;
  paramKey: string;
  param: ToolParamSchema;
  /** Top-level required list, threaded down for legacy parity. */
  required: string[];
  path?: string[];
  depth?: number;
  handlers: ParameterRowHandlers;
}

export const ParameterRow: FC<ParameterRowProps> = memo(
  ({
    schemaTarget,
    paramKey,
    param,
    required,
    path = [],
    depth = 0,
    handlers,
  }) => {
    const [draftName, setDraftName] = useState(paramKey);
    const [draftDescription, setDraftDescription] = useState(
      param.description ?? "",
    );

    // Keep drafts in sync when external state mutates this row's identity / description.
    useEffect(() => {
      setDraftName(paramKey);
    }, [paramKey]);
    useEffect(() => {
      setDraftDescription(param.description ?? "");
    }, [param.description]);

    const isTopLevel = path.length === 0;
    const isRequired = required.includes(paramKey);
    const hasNested = param.type === "object" && param.properties;
    const { label: nameLabel, placeholder: namePlaceholder } =
      NAME_LABELS[schemaTarget];
    const fullPath = [...path, paramKey];

    const commitName = () => {
      if (!isTopLevel) return;
      if (draftName === paramKey) return;
      handlers.onUpdateName(path, paramKey, draftName);
    };

    const commitDescription = () => {
      if (draftDescription === (param.description ?? "")) return;
      handlers.onUpdateField(path, paramKey, {
        description: draftDescription,
      });
    };

    return (
      <div className="space-y-3">
        <div
          className="rounded-lg border border-border bg-muted/30 p-3"
          style={{ marginLeft: depth * 16 }}
        >
          <div className="flex justify-end mb-3">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
              onClick={() => handlers.onRemove(path, paramKey)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 min-w-0">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                {nameLabel}
              </label>
              <Input
                value={draftName}
                placeholder={namePlaceholder}
                className="text-sm font-mono w-full"
                showLeftBorder={false}
                onChange={(e) => setDraftName(e.target.value)}
                onBlur={commitName}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitName();
                }}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Type
              </label>
              <Select
                value={param.type || "string"}
                onValueChange={(val) =>
                  handlers.onUpdateField(path, paramKey, { type: val })
                }
              >
                <SelectTrigger
                  className="h-10 text-sm w-full"
                  showLeftBorder={false}
                >
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 col-span-2">
              <label className="text-xs font-medium text-muted-foreground">
                Description
              </label>
              <Input
                value={draftDescription}
                showLeftBorder={false}
                placeholder="Description"
                className="text-sm w-full"
                onChange={(e) => setDraftDescription(e.target.value)}
                onBlur={commitDescription}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitDescription();
                }}
              />
            </div>

            <div className="flex items-center gap-4 col-span-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRequired}
                  onChange={() => handlers.onToggleRequired(paramKey)}
                  className="h-4 w-4 rounded border-border"
                />
                Required
              </label>

              {param.type === "object" && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs"
                  onClick={() => handlers.onAddNested(path, paramKey, param)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Nested
                </Button>
              )}
            </div>
          </div>
        </div>

        {hasNested && (
          <div className="ml-4 border-l-2 border-purple-300 pl-3 space-y-3">
            {Object.entries(param.properties!).map(([nestedKey, nestedParam]) => (
              <ParameterRow
                key={nestedKey}
                schemaTarget={schemaTarget}
                paramKey={nestedKey}
                param={nestedParam}
                required={required}
                path={fullPath}
                depth={depth + 1}
                handlers={handlers}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);

ParameterRow.displayName = "ParameterRow";
