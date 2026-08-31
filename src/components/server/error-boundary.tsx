"use client";

import { useEffect } from "react";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
}

/**
 * Reusable error boundary component for Next.js error.tsx files
 *
 * @example
 * ```typescript
 * // app/dashboard/error.tsx
 * 'use client';
 *
 * import { ErrorBoundary } from '@/components/server/error-boundary';
 *
 * export default function DashboardError(props: ErrorBoundaryProps) {
 *   return (
 *     <ErrorBoundary
 *       {...props}
 *       title="Failed to load dashboard"
 *       description="There was a problem loading your dashboard data."
 *     />
 *   );
 * }
 * ```
 */
export function ErrorBoundary({
  error,
  reset,
  title = "Something went wrong",
  description = "There was a problem processing your request.",
}: ErrorBoundaryProps) {
  useEffect(() => {
    // Log error to monitoring service
    console.error("Error boundary caught error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
      <div className="mb-4 rounded-full bg-destructive/20 p-3">
        <svg
          className="h-8 w-8 text-destructive"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h2 className="mb-2 text-xl font-semibold text-destructive">{title}</h2>

      <p className="mb-6 max-w-md text-muted-foreground">{description}</p>

      {error.message && (
        <p className="mb-6 max-w-md text-sm text-muted-foreground">
          Error: {error.message}
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Try again
        </button>

        <button
          onClick={() => window.location.reload()}
          className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          Refresh page
        </button>
      </div>

      {error.digest && (
        <p className="mt-4 text-xs text-muted-foreground">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}
