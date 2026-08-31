import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Company Settings Page Loading State
 */
export default function CompanySettingsLoading() {
  return (
    <main className="flex-1 space-y-6 p-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-10" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
          >
            <Skeleton className="h-10 w-10 " />
            <div className="flex items-center justify-between mt-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>

      {/* Company form Skeleton */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Company Information Skeleton */}
        <div className=" rounded-lg border bg-card p-6 shadow-sm space-y-3">
          <div className="space-y-3">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-32 float-end" />
        </div>

        {/* Company Users Skeleton */}
        <div className=" rounded-lg border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-4 w-80" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-24" />
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-4">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-10 w-24" />
            </div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Themes Tab */}
        <TabsContent value="themes" className="space-y-4">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
