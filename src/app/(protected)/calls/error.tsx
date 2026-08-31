"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CallsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Calls page error:", error);
  }, [error]);

  return (
    <main className="flex-1 space-y-6 p-6">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="rounded-full bg-destructive/10 p-4 mb-6">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>

        <h2 className="text-2xl font-bold mb-2">Failed to load calls</h2>

        <p className="text-muted-foreground max-w-md mb-6">
          There was a problem loading the calls page. Please try again.
        </p>

        <Button onClick={reset} variant="default">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try again
        </Button>
      </div>
    </main>
  );
}
