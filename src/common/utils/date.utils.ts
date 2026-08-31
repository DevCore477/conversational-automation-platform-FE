import { format } from "date-fns";

/**
 * Standard date format patterns used across the application
 */
export const DateFormat = {
  SHORT: "MMM d, yyyy",
  MEDIUM: "MMM dd, yyyy",
  LONG: "MMMM d, yyyy",
  DATETIME: "MMM d, yyyy HH:mm",
  TIME: "h:mm a",
  ISO: "yyyy-MM-dd",
} as const;

/**
 * Formats a date using date-fns format string
 * @param date - Date string, Date object, or undefined
 * @param formatStr - Format pattern (default: MEDIUM)
 * @returns Formatted date string or "-" if date is undefined
 */
export function formatDate(
  date: string | Date | undefined | null,
  formatStr: string = DateFormat.MEDIUM,
): string {
  if (!date) return "-";
  try {
    return format(new Date(date), formatStr);
  } catch {
    return "-";
  }
}

/**
 * Formats a date to short format (e.g., "Jan 5, 2024")
 */
export function formatDateShort(
  date: string | Date | undefined | null,
): string {
  return formatDate(date, DateFormat.SHORT);
}

/**
 * Formats a date to long format (e.g., "January 5, 2024")
 */
export function formatDateLong(date: string | Date | undefined | null): string {
  return formatDate(date, DateFormat.LONG);
}

/**
 * Formats a date with time (e.g., "Jan 5, 2024 14:30")
 */
export function formatDateTime(date: string | Date | undefined | null): string {
  return formatDate(date, DateFormat.DATETIME);
}

/**
 * Checks if a date is in the past (expired)
 */
export function isExpired(date: string | Date | undefined | null): boolean {
  if (!date) return false;
  try {
    return new Date(date) < new Date();
  } catch {
    return false;
  }
}

/**
 * Checks if a date is today
 */
export function isToday(date: string | Date | undefined | null): boolean {
  if (!date) return false;
  try {
    const d = new Date(date);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  } catch {
    return false;
  }
}

/**
 * Formats a duration in seconds to a readable string
 * e.g., 65 -> "1m 5s", 45 -> "45s"
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`;
}
