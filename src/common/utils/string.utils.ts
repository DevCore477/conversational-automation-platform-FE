export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Converts a snake_case string to Title Case
 * e.g., "user_name" -> "User Name"
 */
export function toDisplayName(snakeCase: string): string {
  return snakeCase
    .split("_")
    .filter(Boolean)
    .map((word) => capitalize(word))
    .join(" ");
}

/**
 * Converts a string to snake_case
 * e.g., "User Name" -> "user_name"
 */
export function toSnakeCase(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

/**
 * Converts a string to camelCase
 * e.g., "user_name" -> "userName"
 */
export function toCamelCase(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
}

/**
 * Truncates a string to a specified length
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}
