"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AdminCompaniesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin Companies page error:", error);
  }, [error]);

  return (
    <main className="flex-1 space-y-6 p-6">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="rounded-full bg-destructive/10 p-4 mb-6">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>

        <h2 className="text-2xl font-bold mb-2">Failed to load companies</h2>

        <p className="text-muted-foreground max-w-md mb-6">
          There was a problem loading the companies. This might be due to a
          network issue or temporary server problem.
        </p>

        {error.message && (
          <div className="rounded-lg bg-muted p-4 mb-6 max-w-lg">
            <p className="text-sm text-muted-foreground font-mono">
              Error: {error.message}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button onClick={reset} variant="default">
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>

          <Button onClick={() => window.location.reload()} variant="outline">
            Refresh page
          </Button>
        </div>

        {error.digest && (
          <p className="mt-6 text-xs text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
