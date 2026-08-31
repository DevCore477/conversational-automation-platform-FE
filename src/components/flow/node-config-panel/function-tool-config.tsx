"use client";

import { Info, Plus } from "lucide-react";
import { type FC, type ReactNode, memo, useCallback, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { useFlowStore } from "@/store/flow.store";
import type { BackendToolReturns, FlowNode } from "@/types/flow.types";

import {
  ParameterRow,
  type ParameterRowHandlers,
} from "./parameter-row";
import {
  EMPTY_RETURNS,
  generateUniqueKey,
  mergePropAtPath,
  removePropAtPath,
  renameTopLevelProp,
  type ToolParamSchema,
  type ToolSchemaShape,
  type ToolSchemaTarget,
} from "./schema-helpers";

interface FunctionToolConfigProps {
  node: FlowNode;
}

export const FunctionToolConfig: FC<FunctionToolConfigProps> = memo(({ node }) => {
  const updateNode = useFlowStore((s) => s.updateNode);

  const toolParams = node.data.toolParameters as
    | ToolSchemaShape
    | undefined;
  const toolReturnsFull = node.data.toolReturns as BackendToolReturns | undefined;

  const toolProperties = toolParams?.properties ?? {};
  const toolRequired = toolParams?.required ?? [];
  const returnProperties = toolReturnsFull?.properties ?? {};
  const returnRequired = toolReturnsFull?.required ?? [];
  const returnsDescription = toolReturnsFull?.description ?? "";

  const patchData = useCallback(
    (patch: Partial<FlowNode["data"]>) => {
      updateNode(node.id, { data: { ...node.data, ...patch } });
    },
    [node.id, node.data, updateNode],
  );

  const persistSchema = useCallback(
    (target: ToolSchemaTarget, next: ToolSchemaShape) => {
      if (target === "toolParameters") {
        patchData({ toolParameters: next });
        return;
      }
      patchData({
        toolReturns: {
          ...next,
          ...(returnsDescription ? { description: returnsDescription } : {}),
        },
      });
    },
    [patchData, returnsDescription],
  );

  const buildHandlers = useCallback(
    (
      target: ToolSchemaTarget,
      props: Record<string, ToolParamSchema>,
      required: string[],
    ): ParameterRowHandlers => ({
      onUpdateName: (path, oldKey, newKey) => {
        if (path.length !== 0) return;
        const renamed = renameTopLevelProp(props, required, oldKey, newKey);
        persistSchema(target, { type: "object", ...renamed });
      },
      onUpdateField: (path, key, updates) => {
        persistSchema(target, {
          type: "object",
          properties: mergePropAtPath(props, path, key, updates),
          required,
        });
      },
      onToggleRequired: (key) => {
        persistSchema(target, {
          type: "object",
          properties: props,
          required: required.includes(key)
            ? required.filter((k) => k !== key)
            : [...required, key],
        });
      },
      onRemove: (path, key) => {
        persistSchema(target, {
          type: "object",
          properties: removePropAtPath(props, path, key),
          required: required.filter((k) => k !== key),
        });
      },
      onAddNested: (path, parentKey, currentParam) => {
        const existing = currentParam.properties ?? {};
        const newKey = generateUniqueKey(existing, "nested_param");
        const newProperties = {
          ...existing,
          [newKey]: { type: "string", description: "" },
        };
        persistSchema(target, {
          type: "object",
          properties: mergePropAtPath(props, path, parentKey, {
            properties: newProperties,
          }),
          required,
        });
      },
    }),
    [persistSchema],
  );

  const paramHandlers = useMemo(
    () => buildHandlers("toolParameters", toolProperties, toolRequired),
    [buildHandlers, toolProperties, toolRequired],
  );
  const returnHandlers = useMemo(
    () => buildHandlers("toolReturns", returnProperties, returnRequired),
    [buildHandlers, returnProperties, returnRequired],
  );

  const handleAddProperty = (target: ToolSchemaTarget) => {
    const props = target === "toolParameters" ? toolProperties : returnProperties;
    const required = target === "toolParameters" ? toolRequired : returnRequired;
    const key = generateUniqueKey(props);
    persistSchema(target, {
      type: "object",
      properties: { ...props, [key]: { type: "string", description: "" } },
      required: [...required, key],
    });
  };

  const handleReturnsDescription = (description: string) => {
    const cur = toolReturnsFull ?? EMPTY_RETURNS;
    patchData({
      toolReturns: {
        ...cur,
        description: description.trim() || undefined,
      },
    });
  };

  return (
    <div className="space-y-4 border border-purple-200 dark:border-purple-800 rounded-lg p-4 bg-purple-50/50 dark:bg-purple-950/20">
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="text-sm font-medium cursor-help flex items-center gap-1"
            >
              Tool Definition
              <Info className="h-4 w-4 text-muted-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs text-xs">
            <p>
              The Name is the function name that will be called, and Parameters
              define the arguments the function accepts.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tool-name" className="text-xs font-normal">
          Name
        </Label>
        <Input
          id="tool-name"
          showLeftBorder={false}
          value={(node.data.toolName as string) || ""}
          onChange={(e) =>
            patchData({ toolName: e.target.value.trim() || undefined })
          }
          placeholder="e.g., get_weather"
          className="text-sm font-mono w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tool-description" className="text-xs font-normal">
          Description
        </Label>
        <Input
          id="tool-description"
          showLeftBorder={false}
          value={(node.data.toolDescription as string) || ""}
          onChange={(e) =>
            patchData({ toolDescription: e.target.value.trim() || undefined })
          }
          placeholder="e.g., Get weather for a city"
          className="text-sm w-full"
        />
      </div>

      <div className="space-y-3">
        <SchemaHeader
          label="Parameters"
          onAdd={() => handleAddProperty("toolParameters")}
        />
        <SchemaList
          target="toolParameters"
          properties={toolProperties}
          required={toolRequired}
          handlers={paramHandlers}
          emptyMessage='No parameters. Click "Add" to create one.'
        />
        {Object.keys(toolProperties).length > 0 && (
          <SchemaPreview
            label="Preview JSON Schema"
            schema={{
              type: "object",
              properties: toolProperties,
              required: toolRequired,
            }}
          />
        )}
      </div>

      <div className="space-y-3 pt-2 border-t border-purple-200/60 dark:border-purple-800/60">
        <div className="flex items-center gap-2 flex-wrap">
          <Label className="text-xs font-normal">Return values</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="text-muted-foreground cursor-help inline-flex"
                aria-label="About return values"
              >
                <Info className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs text-xs">
              <p>
                Fields the executor merges into session slots for the next
                nodes. Reference them as{" "}
                <code className="font-mono">{"{{field_name}}"}</code>. If the
                runtime maps names (for example{" "}
                <code className="font-mono">status</code> →{" "}
                <code className="font-mono">delivery_status</code>), note that
                in each field&apos;s description.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="space-y-1">
          <Label
            htmlFor="returns-summary"
            className="text-xs font-normal text-muted-foreground"
          >
            Summary (optional)
          </Label>
          <Textarea
            id="returns-summary"
            value={returnsDescription}
            onChange={(e) => handleReturnsDescription(e.target.value)}
            placeholder="Describe what the tool returns and how slots merge..."
            className="text-sm min-h-[56px]"
          />
        </div>

        <SchemaHeader
          label="Output fields"
          onAdd={() => handleAddProperty("toolReturns")}
        />
        <SchemaList
          target="toolReturns"
          properties={returnProperties}
          required={returnRequired}
          handlers={returnHandlers}
          emptyMessage={
            <>
              No return fields. Add fields that the next node can use as{" "}
              <code className="font-mono text-[10px]">{"{{variables}}"}</code>.
            </>
          }
        />
        {(Object.keys(returnProperties).length > 0 ||
          returnsDescription.trim().length > 0) && (
          <SchemaPreview
            label="Preview returns JSON"
            schema={{
              ...(returnsDescription.trim()
                ? { description: returnsDescription }
                : {}),
              type: "object",
              properties: returnProperties,
              required: returnRequired,
            }}
          />
        )}
      </div>
    </div>
  );
});

FunctionToolConfig.displayName = "FunctionToolConfig";

interface SchemaHeaderProps {
  label: string;
  onAdd: () => void;
}

const SchemaHeader: FC<SchemaHeaderProps> = ({ label, onAdd }) => (
  <div className="flex items-center justify-between">
    <Label className="text-xs font-normal">{label}</Label>
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="h-7 text-xs"
      onClick={onAdd}
    >
      <Plus className="h-3 w-3 mr-1" />
      Add
    </Button>
  </div>
);

interface SchemaListProps {
  target: ToolSchemaTarget;
  properties: Record<string, ToolParamSchema>;
  required: string[];
  handlers: ParameterRowHandlers;
  emptyMessage: ReactNode;
}

const SchemaList: FC<SchemaListProps> = ({
  target,
  properties,
  required,
  handlers,
  emptyMessage,
}) => {
  if (Object.keys(properties).length === 0) {
    return (
      <p className="text-xs text-muted-foreground italic">{emptyMessage}</p>
    );
  }
  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto">
      {Object.entries(properties).map(([key, param]) => (
        <ParameterRow
          key={key}
          schemaTarget={target}
          paramKey={key}
          param={param}
          required={required}
          handlers={handlers}
        />
      ))}
    </div>
  );
};

interface SchemaPreviewProps {
  label: string;
  schema: Record<string, unknown>;
}

const SchemaPreview: FC<SchemaPreviewProps> = ({ label, schema }) => (
  <details className="text-xs">
    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
      {label}
    </summary>
    <pre className="mt-2 p-2 bg-muted rounded text-[10px] overflow-x-auto max-w-full break-all whitespace-pre-wrap">
      {JSON.stringify(schema, null, 2)}
    </pre>
  </details>
);
