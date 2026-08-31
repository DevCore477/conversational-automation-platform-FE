import { Skeleton } from "@/components/ui/skeleton";

export default function RewardsLoading() {
  return (
    <main className="flex-1 space-y-6 p-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6 shadow-sm">
            <Skeleton className="h-8 w-8 mb-4" />
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </main>
  );
}
