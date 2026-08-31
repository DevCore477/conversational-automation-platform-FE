import type { BackendToolReturns } from "@/types/flow.types";

export type ToolSchemaTarget = "toolParameters" | "toolReturns";

export interface ToolParamSchema {
  type: string;
  description?: string;
  properties?: Record<string, ToolParamSchema>;
}

export interface ToolSchemaShape {
  type: "object";
  properties: Record<string, ToolParamSchema>;
  required: string[];
}

export const EMPTY_RETURNS: BackendToolReturns = {
  type: "object",
  properties: {},
  required: [],
};

/** Recursively merges `updates` into the property at `path/key`. */
export const mergePropAtPath = (
  props: Record<string, ToolParamSchema>,
  path: string[],
  key: string,
  updates: Partial<ToolParamSchema>,
): Record<string, ToolParamSchema> => {
  if (path.length === 0) {
    const existing = props[key];
    return {
      ...props,
      [key]: {
        type: updates.type ?? existing?.type ?? "string",
        description: updates.description ?? existing?.description,
        properties: updates.properties ?? existing?.properties,
      },
    };
  }
  const [head, ...rest] = path;
  return {
    ...props,
    [head]: {
      ...props[head],
      properties: mergePropAtPath(
        props[head]?.properties ?? {},
        rest,
        key,
        updates,
      ),
    },
  };
};

/** Removes a property at `path/key`, returning a new properties object. */
export const removePropAtPath = (
  props: Record<string, ToolParamSchema>,
  path: string[],
  key: string,
): Record<string, ToolParamSchema> => {
  if (path.length === 0) {
    const next = { ...props };
    delete next[key];
    return next;
  }
  const [head, ...rest] = path;
  return {
    ...props,
    [head]: {
      ...props[head],
      properties: removePropAtPath(props[head]?.properties ?? {}, rest, key),
    },
  };
};

/**
 * Renames a top-level property while preserving insertion order.
 * Also updates the matching entry in the `required` list.
 */
export const renameTopLevelProp = (
  props: Record<string, ToolParamSchema>,
  required: string[],
  oldKey: string,
  newKey: string,
): { properties: Record<string, ToolParamSchema>; required: string[] } => {
  const properties: Record<string, ToolParamSchema> = {};
  Object.entries(props).forEach(([k, v]) => {
    properties[k === oldKey ? newKey : k] = v;
  });
  return {
    properties,
    required: required.map((k) => (k === oldKey ? newKey : k)),
  };
};

/** Returns a key not already present in `props`, derived from `base`. */
export const generateUniqueKey = (
  props: Record<string, ToolParamSchema>,
  base = "new_param",
): string => {
  if (!(base in props)) return base;
  let counter = 1;
  while (`${base}_${counter}` in props) counter++;
  return `${base}_${counter}`;
};
