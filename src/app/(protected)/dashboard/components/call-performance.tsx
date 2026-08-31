"use client";

import { useEffect, useMemo, useState } from "react";
import { usePeriodStore } from "@/store/period.store";
import { apiGet } from "@/lib/dashboard/api-client";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { type AgentPerformance, type FlowPerformance, type ScriptPerformance, type CallVolumeByResourceResponse,} from "@/types/dashboard.types";
import { Skeleton } from "@/components/ui/skeleton";

interface CallPerformanceProps {
  agents: AgentPerformance[];
  flows: FlowPerformance[];
  scriptPerf: ScriptPerformance[];
  initialCallVolume: CallVolumeByResourceResponse | null;
}

const chartConfig = {
  calls: { label: "Total Calls" },
  agent: { label: "Agent", color: "#3b82f6" },
  flow: { label: "Flow", color: "#22c55e" },
  script: { label: "Script", color: "#f59e0b" },
} satisfies ChartConfig;

const CallPerformance = ({ initialCallVolume }: CallPerformanceProps) => {
  const { period } = usePeriodStore();

  const [callVolume, setCallVolume] = useState<CallVolumeByResourceResponse | null>( initialCallVolume, );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVolume = async () => {
      setIsLoading(true);
      try {
        const url = period
          ? `/dashboard-stats/calls/volume/by-resource?period=${period}`
          : `/dashboard-stats/calls/volume/by-resource`;
        const data = await apiGet<CallVolumeByResourceResponse>(url);
        setCallVolume(data);
      } catch (err) {
        console.error("[CallPerformance] Failed to fetch call volume:", err);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchVolume();
  }, [period]);

  const totals = useMemo(() => {
    const t = callVolume?.totals;
    const agentCalls = t?.agent ?? 0;
    const flowCalls = t?.conversationFlow ?? 0;
    const scriptCalls = t?.script ?? 0;

    return {
      agentCalls,
      flowCalls,
      scriptCalls,
      totalCalls: agentCalls + flowCalls + scriptCalls,
    };
  }, [callVolume]);

  const chartData = useMemo(
    () => [
      { name: "Agent", calls: totals.agentCalls, fill: "#3b82f6" },
      { name: "Flow", calls: totals.flowCalls, fill: "#22c55e" },
      { name: "Script", calls: totals.scriptCalls, fill: "#f59e0b" },
    ],
    [totals],
  );

  const hasData = totals.totalCalls > 0;

  return (
    <div className="rounded-2xl border text-card-foreground shadow-sm bg-surface-soft-light p-1.25 space-y-2">
      <div className="bg-card rounded-t-xl px-4 pt-4 pb-2">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="lg:text-lg 4xl:text-xl text-sidebar-accent dark:text-sidebar-accent-foreground font-medium leading-none tracking-tight">
              Call Performance
            </h3>
            <span className="text-[12px] sm:text-[14px] text-sidebar-accent dark:text-sidebar-accent-foreground">
              Total calls by resource
            </span>
          </div>
          <div className="text-right">
            <div className="font-semibold leading-none">
              {totals.totalCalls.toLocaleString()}
            </div>
            <span className="text-xs sm:text-[12px] text-muted-foreground">
              Total Calls
            </span>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-b-xl px-4 pt-2 pb-4">
        {isLoading ? (
          <div className="flex h-72 items-center justify-center text-muted-foreground gap-8">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-60 w-8" />
            ))}
          </div>
        ) : !hasData ? (
          <div className="flex h-72 items-center justify-center text-muted-foreground">
            No call data available yet
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-72 w-full">
            <BarChart data={chartData} margin={{ top: 12 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent indicator="line" hideLabel />} />
              <Bar dataKey="calls" radius={[4, 4, 0, 0]} barSize={30}>
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </div>
    </div>
  );
};

export default CallPerformance;