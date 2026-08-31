import { Skeleton } from "@/components/ui/skeleton";

/**
 * Scripts Page Loading State
 */
export default function ScriptsLoading() {
  return (
    <main className="flex-1 space-y-6 p-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
          >
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    </main>
  );
}
