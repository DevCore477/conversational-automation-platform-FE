import { Skeleton } from "@/components/ui/skeleton";

/**
 * Conversation Flow Page Loading State
 */
export default function ConversationFlowLoading() {
  return (
    <main className="flex-1 space-y-6 p-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Buttons Skeleton */}
      <div className="flex justify-end gap-2">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Current Live Flow Skeleton */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <Skeleton className="h-6 w-40 mb-4" />
        <Skeleton className="h-20 w-full" />
      </div>

      {/* Templates Section Skeleton */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>

      {/* Flows List Skeleton */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>

      {/* Info Card Skeleton */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </main>
  );
}
