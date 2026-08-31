/**
 * Variable Engine
 *
 * A reusable engine for variable substitution, evaluation, and extraction.
 * Supports variable syntax: {{variable_name}} and {{variable_name||default}}
 */

import {
  type SessionContext,
  type GlobalSettings,
  LogicOperator,
  type LogicCondition,
  type VariableExtraction,
} from "@/types/flow.types";

// ============================================
// Configuration
// ============================================

export interface VariableEngineConfig {
  prefix: string;
  suffix: string;
  defaultSeparator: string;
  enableNestedVariables: boolean;
  strictMode: boolean;
}

const DEFAULT_CONFIG: VariableEngineConfig = {
  prefix: "{{",
  suffix: "}}",
  defaultSeparator: "||",
  enableNestedVariables: true,
  strictMode: false,
};

// ============================================
// Variable Substitution
// ============================================

/**
 * Extract all variable names from a template string
 */
export function extractVariableNames(
  template: string,
  config: VariableEngineConfig = DEFAULT_CONFIG,
): string[] {
  const { prefix, suffix, defaultSeparator } = config;
  const escapedPrefix = escapeRegex(prefix);
  const escapedSuffix = escapeRegex(suffix);

  const regex = new RegExp(
    `${escapedPrefix}([^${escapedSuffix}]+)${escapedSuffix}`,
    "g",
  );

  const variables: string[] = [];
  let match;

  while ((match = regex.exec(template)) !== null) {
    const varPart = match[1].split(defaultSeparator)[0].trim();
    if (!variables.includes(varPart)) {
      variables.push(varPart);
    }
  }

  return variables;
}

/**
 * Substitute variables in a template string with values from context
 */
export function substituteVariables(
  template: string,
  context: SessionContext,
  globalSettings?: GlobalSettings,
  config: VariableEngineConfig = DEFAULT_CONFIG,
): { result: string; errors: SubstitutionError[] } {
  const { enableNestedVariables, strictMode } = config;
  const errors: SubstitutionError[] = [];

  // Merge all available variables
  const allVariables = buildVariableMap(context, globalSettings);

  let result = template;
  let iterations = 0;
  const maxIterations = enableNestedVariables ? 10 : 1;

  while (iterations < maxIterations) {
    const previousResult = result;
    result = substituteOnce(result, allVariables, config, errors, strictMode);

    // No more substitutions needed
    if (result === previousResult) {
      break;
    }
    iterations++;
  }

  return { result, errors };
}

function substituteOnce(
  template: string,
  variables: Record<string, unknown>,
  config: VariableEngineConfig,
  errors: SubstitutionError[],
  strictMode: boolean,
): string {
  const { prefix, suffix, defaultSeparator } = config;
  const escapedPrefix = escapeRegex(prefix);
  const escapedSuffix = escapeRegex(suffix);

  const regex = new RegExp(
    `${escapedPrefix}([^${escapedSuffix}]+)${escapedSuffix}`,
    "g",
  );

  return template.replace(regex, (match, content) => {
    const parts: string[] = content.split(defaultSeparator);
    const varName: string = parts[0].trim();
    const defaultValue: string | undefined = parts[1]?.trim();

    // Support dot notation for nested objects
    const value = getNestedValue(variables, varName);

    if (value !== undefined && value !== null) {
      return String(value);
    }

    if (defaultValue !== undefined) {
      return defaultValue;
    }

    if (strictMode) {
      errors.push({
        variable: varName,
        message: `Variable "${varName}" not found`,
        original: match,
      });
    }

    // Return original if not found and not strict
    return match;
  });
}

/**
 * Build a flat map of all available variables
 */
function buildVariableMap(
  context: SessionContext,
  globalSettings?: GlobalSettings,
): Record<string, unknown> {
  const variables: Record<string, unknown> = {};

  // Add system variables from context
  variables["session_id"] = context.sessionId;
  variables["call_start_time"] = context.callStartTime;
  variables["call_duration"] = context.callDuration;
  variables["bot_name"] = context.botName;
  variables["language"] = context.language;

  // Add global system variables
  if (globalSettings?.systemVariables) {
    for (const sysVar of globalSettings.systemVariables) {
      if (!(sysVar.name in variables)) {
        variables[sysVar.name] = sysVar.defaultValue ?? "";
      }
    }
  }

  // Add custom variables from global settings
  if (globalSettings?.customVariables) {
    for (const customVar of globalSettings.customVariables) {
      if (!(customVar.name in variables)) {
        variables[customVar.name] = customVar.defaultValue ?? "";
      }
    }
  }

  // Add runtime context variables (highest priority)
  if (context.variables) {
    Object.assign(variables, context.variables);
  }

  return variables;
}

/**
 * Get a nested value from an object using dot notation
 * e.g., getNestedValue({ user: { name: "John" } }, "user.name") => "John"
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = obj;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    if (
      typeof current === "object" &&
      part in (current as Record<string, unknown>)
    ) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return current;
}

// ============================================
// Expression Evaluation (for Logic Split)
// ============================================

export interface EvaluationResult {
  success: boolean;
  result: boolean;
  error?: string;
}

/**
 * Evaluate a condition expression with variable substitution
 */
export function evaluateCondition(
  condition: LogicCondition,
  context: SessionContext,
  globalSettings?: GlobalSettings,
  config: VariableEngineConfig = DEFAULT_CONFIG,
): EvaluationResult {
  try {
    // Substitute variables in operands
    const leftResult = substituteVariables(
      condition.leftOperand,
      context,
      globalSettings,
      config,
    );
    const rightResult = substituteVariables(
      condition.rightOperand,
      context,
      globalSettings,
      config,
    );

    const leftValue = parseValue(leftResult.result);
    const rightValue = parseValue(rightResult.result);

    const result = compareValues(leftValue, rightValue, condition.operator);

    return { success: true, result };
  } catch (error) {
    return {
      success: false,
      result: false,
      error:
        error instanceof Error ? error.message : "Unknown evaluation error",
    };
  }
}

/**
 * Evaluate a simple expression string like "{{age}} > 18"
 */
export function evaluateExpression(
  expression: string,
  context: SessionContext,
  globalSettings?: GlobalSettings,
  config: VariableEngineConfig = DEFAULT_CONFIG,
): EvaluationResult {
  try {
    // First substitute variables
    const { result: substituted, errors } = substituteVariables(
      expression,
      context,
      globalSettings,
      config,
    );

    if (errors.length > 0 && config.strictMode) {
      return {
        success: false,
        result: false,
        error: `Missing variables: ${errors.map((e) => e.variable).join(", ")}`,
      };
    }

    // Parse and evaluate the expression
    const result = safeEvaluate(substituted);

    return { success: true, result: Boolean(result) };
  } catch (error) {
    return {
      success: false,
      result: false,
      error: error instanceof Error ? error.message : "Invalid expression",
    };
  }
}

/**
 * Parse a string value to its appropriate type
 */
function parseValue(value: string): string | number | boolean {
  // Check for boolean
  if (value.toLowerCase() === "true") {
    return true;
  }
  if (value.toLowerCase() === "false") {
    return false;
  }

  // Check for number
  const num = Number(value);
  if (!isNaN(num) && value.trim() !== "") {
    return num;
  }

  // Remove quotes if present
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

/**
 * Compare two values using the specified operator
 */
function compareValues(
  left: string | number | boolean,
  right: string | number | boolean,
  operator: LogicOperator,
): boolean {
  switch (operator) {
    case LogicOperator.Equals:
      return String(left) === String(right);
    case LogicOperator.NotEquals:
      return String(left) !== String(right);
    case LogicOperator.GreaterThan:
      return Number(left) > Number(right);
    case LogicOperator.LessThan:
      return Number(left) < Number(right);
    case LogicOperator.GreaterThanOrEqual:
      return Number(left) >= Number(right);
    case LogicOperator.LessThanOrEqual:
      return Number(left) <= Number(right);
    case LogicOperator.Contains:
      return String(left).includes(String(right));
    case LogicOperator.StartsWith:
      return String(left).startsWith(String(right));
    case LogicOperator.EndsWith:
      return String(left).endsWith(String(right));
    case LogicOperator.IsEmpty:
      return left === "" || left === null || left === undefined;
    case LogicOperator.IsNotEmpty:
      return left !== "" && left !== null && left !== undefined;
    default:
      return false;
  }
}

/**
 * Safely evaluate a simple expression without using eval
 */
function safeEvaluate(expression: string): boolean {
  // Tokenize and parse simple expressions
  const comparisonRegex = /^(.+?)\s*(==|!=|>=|<=|>|<|===|!==)\s*(.+)$/;
  const match = expression.match(comparisonRegex);

  if (match) {
    const left = parseValue(match[1].trim());
    const operator = match[2];
    const right = parseValue(match[3].trim());

    switch (operator) {
      case "==":
      case "===":
        return String(left) === String(right);
      case "!=":
      case "!==":
        return String(left) !== String(right);
      case ">":
        return Number(left) > Number(right);
      case "<":
        return Number(left) < Number(right);
      case ">=":
        return Number(left) >= Number(right);
      case "<=":
        return Number(left) <= Number(right);
    }
  }

  // Handle boolean expressions
  const boolValue = parseValue(expression.trim());
  return Boolean(boolValue);
}

// ============================================
// Variable Extraction
// ============================================

export interface ExtractionResult {
  success: boolean;
  value: unknown;
  error?: string;
}

/**
 * Extract a variable value from text using the specified extraction config
 */
export function extractVariable(
  text: string,
  extraction: VariableExtraction,
): ExtractionResult {
  try {
    switch (extraction.extractionType) {
      case "regex":
        return extractWithRegex(text, extraction.pattern || "");
      case "json_path":
        return extractWithJsonPath(text, extraction.pattern || "");
      case "ai_extraction":
        // AI extraction would be handled by the backend
        return {
          success: false,
          value: null,
          error: "AI extraction requires backend support",
        };
      default:
        return {
          success: false,
          value: null,
          error: "Unknown extraction type",
        };
    }
  } catch (error) {
    return {
      success: false,
      value: extraction.defaultValue ?? null,
      error: error instanceof Error ? error.message : "Extraction failed",
    };
  }
}

function extractWithRegex(text: string, pattern: string): ExtractionResult {
  const regex = new RegExp(pattern);
  const match = text.match(regex);

  if (match) {
    // Return first capture group if exists, otherwise full match
    return { success: true, value: match[1] ?? match[0] };
  }

  return { success: false, value: null, error: "No match found" };
}

function extractWithJsonPath(text: string, path: string): ExtractionResult {
  try {
    const json = JSON.parse(text);
    const value = getNestedValue(json, path);

    if (value !== undefined) {
      return { success: true, value };
    }

    return { success: false, value: null, error: `Path "${path}" not found` };
  } catch {
    return { success: false, value: null, error: "Invalid JSON" };
  }
}

// ============================================
// Variable Validation
// ============================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  usedVariables: string[];
  missingVariables: string[];
}

/**
 * Validate a template string for variable usage
 */
export function validateTemplate(
  template: string,
  availableVariables: string[],
  config: VariableEngineConfig = DEFAULT_CONFIG,
): ValidationResult {
  const usedVariables = extractVariableNames(template, config);
  const missingVariables = usedVariables.filter(
    (v) => !availableVariables.includes(v),
  );
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for missing variables
  if (missingVariables.length > 0) {
    if (config.strictMode) {
      errors.push(`Missing variables: ${missingVariables.join(", ")}`);
    } else {
      warnings.push(`Variables not defined: ${missingVariables.join(", ")}`);
    }
  }

  // Check for syntax errors
  const syntaxErrors = checkVariableSyntax(template, config);
  errors.push(...syntaxErrors);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    usedVariables,
    missingVariables,
  };
}

function checkVariableSyntax(
  template: string,
  config: VariableEngineConfig,
): string[] {
  const errors: string[] = [];
  const { prefix, suffix } = config;

  // Count prefix and suffix occurrences
  const prefixCount = (
    template.match(new RegExp(escapeRegex(prefix), "g")) || []
  ).length;
  const suffixCount = (
    template.match(new RegExp(escapeRegex(suffix), "g")) || ([] as string[])
  ).length;

  if (prefixCount !== suffixCount) {
    errors.push(
      `Mismatched variable delimiters: ${prefixCount} "${prefix}" and ${suffixCount} "${suffix}"`,
    );
  }

  return errors;
}

// ============================================
// Helper Functions
// ============================================

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Get the type of a variable value
 */
export function inferVariableType(value: unknown): string {
  if (value === null || value === undefined) {
    return "string";
  }
  if (typeof value === "boolean") {
    return "boolean";
  }
  if (typeof value === "number") {
    return "number";
  }
  if (Array.isArray(value)) {
    return "array";
  }
  if (typeof value === "object") {
    return "object";
  }
  return "string";
}

/**
 * Format a variable value for display
 */
export function formatVariableValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
}

// ============================================
// Types
// ============================================

export interface SubstitutionError {
  variable: string;
  message: string;
  original: string;
}
