import { Metadata } from "next";
import { Suspense } from "react";

import { getDashboardData, getCallsVolumeByResource } from "@/lib/data";
import {
  type CallActivity,
  type SystemHealth,
  type TopScriptsResponse,
  type CallVolumeByResourceResponse,
} from "@/types/dashboard.types";
import { decodeAuthTokenPayload, isPlatformAdminPayload } from "@/lib/server-auth-token";
import { cookies } from "next/headers";

import { DashboardStats } from "./components/dashboard-stats";
import { RecentActivity } from "./components/recent-activity";
import { SystemHealth as SystemHealthComponent } from "./components/system-health";
import { TopScripts } from "./components/top-scripts";
import { CallAnalytics } from "./components/call-analytics";
import { MatchedHeightColumns } from "./components/matched-height-columns";
import WelcomeSection from "./components/WelcomeSection";
import CallPerformance from "./components/call-performance";


export const metadata: Metadata = {
  title: "Dashboard | Hexa AI",
  description: "Overview of your AI calling dashboard",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  // const selectedPeriod = searchParams.period ?? null;
  const {
    overview,
    recentActivity,
    health,
    scripts,
    agents,
    flows,
    scriptPerf,
  } = await getDashboardData();

  let callVolume: CallVolumeByResourceResponse | null = null;
  try {
    callVolume = await getCallsVolumeByResource("hour");
  } catch (error) {
    console.error("[DashboardPage] Failed to fetch call volume:", error);
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  const jwtPayload = token ? decodeAuthTokenPayload(token) : null;
  const isPlatformAdmin = isPlatformAdminPayload(jwtPayload);
  return (
    <main className="flex-1 space-y-6 p-4 lg:p-6 ">
      {/* Welcome Message */}
      <div className="flex items-center justify-between gap-6">
        <WelcomeSection  
          overview={overview}
          recentActivity={recentActivity}
          scripts={scripts}
          agents={agents}
          flows={flows}
          scriptPerf={scriptPerf}
        />
      </div>

      {/* Row 1: 4 Stat Cards */}
      <Suspense >
        <DashboardStats overview={overview} isPlatformAdmin={isPlatformAdmin} />
      </Suspense>

      {/* Row 2: Analytics Charts with Tabs (66/33 split) */}
      <Suspense fallback={<CallAnalyticsSkeleton />}>
        <div className="hidden lg:block rounded-2xl border text-card-foreground shadow-sm bg-surface-soft-light p-[5px]">
          <CallAnalytics
            agents={agents}
            flows={flows}
            scriptPerf={scriptPerf}
            initialCallVolume={callVolume}
          />
        </div>
      </Suspense>
      <Suspense>
        <div className="lg:hidden">
          <CallPerformance
            agents={agents}
            flows={flows}
            scriptPerf={scriptPerf}
            initialCallVolume={callVolume}
          />
        </div>
      </Suspense>

      {/* Row 3: System Health sets row height; Top Templates matches it and scrolls */}
      <MatchedHeightColumns
        left={
          <Suspense fallback={<SystemHealthSkeleton />}>
            <SystemHealthSection
              health={health}
              isPlatformAdmin={isPlatformAdmin}
            />
          </Suspense>
        }
        right={
          <Suspense fallback={<TopScriptsSkeleton />}>
            <TopScriptsSection scripts={scripts} />
          </Suspense>
        }
      />

      {/* Row 4: Recent Activity (full width) */}
      <Suspense fallback={<RecentActivitySkeleton />}>
        <RecentActivitySection calls={recentActivity} />
      </Suspense>
    </main>
  );
}

async function RecentActivitySection({ calls }: { calls: CallActivity[] }) {
  return (
    <div className="flex flex-col rounded-3xl border  bg-card text-card-foreground shadow-sm h-full min-h-[380px]">
      <div className="flex items-center justify-between space-y-1.5 p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h3 className="lg:text-lg 4xl:text-xl text-sidebar-accent dark:text-sidebar-accent-foreground font-medium leading-none tracking-tight">
            Recent Call Activity
          </h3>
          <span className="text-[12px] sm:text-[14px] text-sidebar-accent dark:text-sidebar-accent-foreground ">(Latest calls and their status)</span>
        </div>
        {/* <RefreshButton  /> */}
      </div>
      <div className="p-4 lg:p-6 pt-0 overflow-y-auto no-scrollbar max-h-[300p]">
        <RecentActivity calls={calls} />
      </div>
    </div>
  );
}

async function TopScriptsSection({ scripts }: { scripts: TopScriptsResponse }) {
  return (
    <div className="flex h-full min-h-0 flex-col rounded-lg border bg-card text-card-foreground shadow-sm lg:min-h-0">
      <div className="flex items-center justify-between p-4 lg:p-6">
        <h3 className="lg:text-lg 4xl:text-xl text-sidebar-accent dark:text-sidebar-accent-foreground font-medium leading-none tracking-tight">
          Top Performing Templates
        </h3>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4 lg:p-6 pt-0 no-scrollbar">
        <TopScripts scripts={scripts} />
      </div>
    </div>
  );
}

async function SystemHealthSection({
  health,
  isPlatformAdmin,
}: {
  health: SystemHealth | null;
  isPlatformAdmin: boolean;
}) {
  return (
    <SystemHealthComponent
      health={health}
      isPlatformAdmin={isPlatformAdmin}
    />
  );
}


// function DashboardStatsSkeleton() {
//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//       {[...Array(4)].map((_, i) => (
//         <div
//           key={i}
//           className="rounded-lg border bg-card p-3 text-card-foreground shadow-sm"
//         >
//           <div className="h-4 w-24 bg-muted animate-pulse rounded mb-2" />
//           <div className="h-8 w-16 bg-muted animate-pulse rounded" />
//         </div>
//       ))}
//     </div>
//   );
// }

function CallAnalyticsSkeleton() {
  return <div className="h-[500px] w-full bg-muted animate-pulse rounded-lg" />;
}

function RecentActivitySkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 w-full bg-muted animate-pulse rounded" />
      ))}
    </div>
  );
}

function TopScriptsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-20 w-full bg-muted animate-pulse rounded" />
      ))}
    </div>
  );
}

function SystemHealthSkeleton() {
  return <div className="h-64 w-full bg-muted animate-pulse rounded" />;
}
