import { Skeleton } from "@/components/ui/skeleton";

/**
 * Dashboard Loading State
 *
 * This component is automatically shown by Next.js when the page
 * is loading data. It provides immediate visual feedback.
 */
export default function DashboardLoading() {
  return (
    <main className="flex-1 space-y-6 p-6">
      {/* Welcome Message Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <Skeleton className="size-10 mb-3" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="size-10" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Recent Activity Skeleton */}
      <div className=" w-full rounded-lg border bg-card p-6 shadow-sm ">
        <div className="grid lg:grid-cols-4 gap-6 mb-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
        <div className="space-y-3">
          {/* Title */}
          <Skeleton className="h-5 w-32" />
    
          {/* Chart */}
          <div className="relative ">
            {/* Y-axis grid lines */}
            <div className="absolute left-0 right-0 top-0 space-y-[calc((200px-40px)/4)]">
              <div className="border-t border-border/50" />
              <div className="border-t border-border/50" />
              <div className="border-t border-border/50" />
              <div className="border-t border-border/50" />
            </div>
      
            {/* Area bars */}
            <div className="flex items-end gap-1 h-[200px] relative z-10">
              {[...Array(12)].map((_, i) => {
                const heights = [25, 45, 80, 110, 150, 180, 170, 140, 100, 60, 30, 20];
                return (
                  <Skeleton  key={i}  className="flex-1 rounded-t-md" style={{ height: `${heights[i]}px` }}/>
                );
              })}
            </div>
          </div>
    
          {/* X-axis */}
          <div className="flex justify-between pt-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </div>
      
      {/* System Health Skeleton */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-64" />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
          <Skeleton className="h-20 w-full mt-4" />
        </div>
        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="mb-3">
            <Skeleton className="h-10 w-64" />
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Top Scripts Skeleton */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-96 mb-6" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    </main>
  );
}
