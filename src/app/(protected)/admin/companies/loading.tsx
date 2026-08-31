import { Skeleton } from "@/components/ui/skeleton";

/**
 * Admin Companies Page Loading State
 */
export default function AdminCompaniesLoading() {
  return (
    <main className="flex-1 space-y-6 p-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-44" />
        </div>
      </div>

      {/* Stats Card Skeleton */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-8 w-20" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    </main>
  );
}
