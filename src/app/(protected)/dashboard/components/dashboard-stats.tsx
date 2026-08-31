"use client";

import { useEffect, useState } from "react";
import { AlertCircle, TrendingUp, CircleX  } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useThemeStore } from "@/store/theme.store";
import { type DashboardOverview } from "@/types/dashboard.types";
import { StatCard } from "@/components/stat-card";
import {CalendarIcn, CallIcn} from "@/assets/icons/Icons"
import { usePeriodStore, type Period } from "@/store/period.store";
import { apiGet } from "@/lib/dashboard/api-client";

const DEFAULT_WAVE_COLOR = "#c57dff";

interface DashboardStatsProps {
  overview: DashboardOverview | null;
  isLoading?: boolean;
  error?: string | null;
  isPlatformAdmin?: boolean;
}

export function DashboardStats({
  overview: initialOverview,
  isLoading: externalLoading,
  error,
  isPlatformAdmin = false,
}: DashboardStatsProps) {
  const { theme, fetchTheme } = useThemeStore();
  const { period } = usePeriodStore();

  const [overview, setOverview] = useState<DashboardOverview | null>(initialOverview);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!theme?.primaryColor) {
      fetchTheme();
    }
  }, [theme, fetchTheme]);

  const fetchStats = async (selectedPeriod: Period | null) => {
    setIsLoading(true);

    try {
      const url = selectedPeriod ? `/dashboard-stats/overview?period=${selectedPeriod}` : "/dashboard-stats/overview";
      const data = await apiGet<DashboardOverview>(url);
      setOverview(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(period);
  }, [period]);

  const waveColor = isPlatformAdmin
    ? DEFAULT_WAVE_COLOR
    : theme?.primaryColor || DEFAULT_WAVE_COLOR;
  const showWave = true;
  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <p className="text-sm font-medium">{error}</p>
      </div>
    );
  }

  // const callTitle = typeof window !== 'undefined' && window.innerWidth < 540 ? "No Of Calls" : "Number Of Calls";
  // const successTitle = typeof window !== 'undefined' && window.innerWidth < 540 ? "Success" : "Success Rate";
  // const successSubTitle = typeof window !== 'undefined' && window.innerWidth < 540 ? "completed" : "completed calls";

  if (isLoading || !overview) {
    return (
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
    );
  }

  const { summary, callStats, recentActivity } = overview;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Number Of Calls"
        subtitle={`${callStats.byStatus.active} currently active`}
        value={summary.totalCalls}
        icon={<CallIcn className="size-5 text-cyan-blue" />}
        showWave={showWave}
        waveColor={waveColor}
      />
      <StatCard
        title="Success Rate"
        subtitle={`${callStats.byStatus.completed} completed calls`}
        value={`${callStats.successRate.toFixed(1)}%`}
        icon={<TrendingUp className="size-5 text-success" />}
        variant="success"
        showWave={showWave}
        waveColor={waveColor}
      />
      <StatCard
        title="Initiating"
        subtitle={` Starting calls`}
        value={callStats.byStatus.initiating}
        icon={<CalendarIcn className="size-5 text-warning" />}
        variant="danger"
        showWave={showWave}
        waveColor={waveColor}
      />
      <StatCard
        title="Failed Calls"
        // value={recentActivity.last24Hours}
        value={callStats.byStatus.failed}
        subtitle={`${callStats.byStatus.retried} retried attempts`}
        icon={<CircleX className="size-5 text-danger-soft" />}
        variant="info"
        showWave={showWave}
        waveColor={waveColor}
      />
    </div>
  );
}
