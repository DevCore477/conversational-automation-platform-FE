"use client";

import {
  Activity, AlertTriangle, CheckCircle2, XCircle, Phone, TrendingDown,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/stat-card";
import { type SystemHealth as SystemHealthType } from "@/types/dashboard.types";
import {ElevenLabsIcn, RetryArrowIcn, TelnyxIcn, TimerIcn, TwilioIcn} from "@/assets/icons/Icons"
import { usePeriodStore, type Period } from "@/store/period.store";
import { useEffect, useState } from "react";


interface SystemHealthProps {
  health: SystemHealthType | null;
  isLoading?: boolean;
  isPlatformAdmin?: boolean;
}

const formatDuration = (duration: string) => {
  // string contains seconds, minutes or hours, e.g. "90 seconds", "2 minutes", "1.5 hours"
  const [value, unit] = duration.split(" ");
  const numValue = parseFloat(value);
  if (isNaN(numValue)) {
    return duration;
  }

  switch (unit) {
    case "seconds":
      return `${numValue.toFixed(0)} secs`;
    case "second":
      return `${numValue.toFixed(0)} sec`;
    case "minutes":
      return `${numValue.toFixed(0)} mins`;
    case "minute":
      return `${numValue.toFixed(0)} min`;
    case "hours":
      return `${numValue.toFixed(0)} hrs`;
    case "hour":
      return `${numValue.toFixed(0)} hr`;
    default:
      return duration;
  }
};

export function SystemHealth({
  health: initialHealth,
  isLoading: externalLoading,
  isPlatformAdmin,
}: SystemHealthProps) {

  const { period } = usePeriodStore();
  const [health, setHealth] = useState<SystemHealthType | null>(initialHealth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      setIsLoading(true);
      const effectivePeriod = period || "hour";
      try {
        const token = document.cookie.split("auth-token=")[1]?.split(";")[0];
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/dashboard-stats/system/health?period=${effectivePeriod}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.ok) {
          const data = await response.json();
          setHealth(data);
        } else {
          console.error("[SystemHealth] Failed to fetch:", response.status);
        }
      } catch (error) {
        console.error("[SystemHealth] Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHealth();
  }, [period]);

  if (isLoading || externalLoading) {
    return (
      <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
        <Skeleton className="h-20 w-full mt-4" />
      </div>
    );
  }

  if (!health) {
    return null;
  }

  const getStatusIcon = () => {
    switch (health.status) {
      case "healthy":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "critical":
        return <XCircle className="h-5 w-5 text-danger-soft " />;
      default:
        return <Activity className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = () => {
    const variants = {
      healthy: {
        variant: "default" as const,
        label: "Healthy",
        className: "bg-success text-success-foreground",
      },
      warning: {
        variant: "secondary" as const,
        label: "Warning",
        className: "bg-warning text-warning-foreground",
      },
      critical: {
        variant: "destructive" as const,
        label: "Critical",
        className: "bg-danger-soft text-danger-foreground",
      },
    };
    return variants[health.status] || variants.healthy;
  };

  const statusBadge = getStatusBadge();

  const hasProviderCredits =
    isPlatformAdmin &&
    health.providerCredits &&
    (health.providerCredits.elevenLabs || health.providerCredits.telnyx);

  return (
    <div className="space-y-6 p-4 lg:p-6 rounded-lg border bg-card text-card-foreground">
      <div className="flex flex-col sm:flex-row lg:flex-col 2xl:flex-row 2xl:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h3 className="lg:text-lg 4xl:text-xl text-sidebar-accent dark:text-sidebar-accent-foreground font-medium leading-none tracking-tight">
            System Health
          </h3>
          <span className="text-xs 2xl:text-sm text-sidebar-accent dark:text-sidebar-accent-foreground">(Current system status)</span>
        </div>
        <div className="flex items-center gap-2">
          <h3 className="text-sm lg:text-[18px] text-sidebar-accent dark:text-sidebar-accent-foreground font-medium">System Status:</h3>
          <Badge variant={statusBadge.variant} className={statusBadge.className}>{statusBadge.label} </Badge>
          {getStatusIcon()}
        </div>
      </div>

      <div className={`grid gap-5 ${isPlatformAdmin ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"}`}>
        <StatCard
          title="Active Calls"
          value={health.metrics.activeCallsCount}
          icon={<Phone />}
          valueColor="text-success"
          className="bg-surface-soft/15 dark:bg-sidebar-accent space-y-3"
        />
        <StatCard
          title="Failure Rate"
          value={`${health.metrics.failedCallsRate.toFixed(1)}%`}
          icon={<TrendingDown />}
          valueColor="text-danger-soft"
          className="bg-surface-peach-light dark:bg-sidebar-accent space-y-3"
        />
        <StatCard
          title="Retry Rate"
          value={`${health.metrics.retriedCallsRate.toFixed(1)}%`}
          icon={<RetryArrowIcn />}
          valueColor="text-danger-soft"
          variant={health.metrics.retriedCallsRate > 10 ? "danger" : "success"}
          className="bg-surface-peach-light dark:bg-sidebar-accent space-y-3"
        />
        <StatCard
          title="Avg Duration"
          value={formatDuration(health.metrics.avgCallDuration.toString())}
          icon={<TimerIcn />}
          valueColor="text-cyan-blue"
          className="bg-surface-soft/15 dark:bg-sidebar-accent space-y-3"
        />

        {hasProviderCredits && health.providerCredits?.elevenLabs && (
          <Card className="p-4 relative overflow-hidden bg-surface-soft/15 dark:bg-sidebar-accent">
            <div className="relative z-10 space-y-3">
              <CardHeader className="p-0 pb-1 lg:px-0">
                <div className="flex items-center justify-between">
                  <div
                    className="relative z-10 flex items-center justify-center size-[32px] lg:size-[36px] 2xl:size-[36px] 4xl:size-[44px] rounded-[12px] shadow-md bg-white dark:bg-sidebar-accent-foreground backdrop-blur-sm"
                  >
                    <div className="w-[14px] h-[14px] 2xl:w-[20px] 2xl:h-[20px] 4xl:w-[20px] 4xl:h-[21px] flex items-center justify-center text-sidebar-accent">
                      <ElevenLabsIcn className="size-4" />
                    </div>
                  </div>
                <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Status</span>
                <Badge
                  variant={
                    health.providerCredits.elevenLabs.status === "ok"
                      ? "default"
                      : "destructive"
                  }
                  className={`text-xs ${
                    health.providerCredits.elevenLabs.status === "ok"
                      ? "bg-success text-success-foreground"
                      : "bg-danger-soft text-destructive-foreground"
                  }`}
                >
                  {health.providerCredits.elevenLabs.status
                    .charAt(0)
                    .toUpperCase() +
                    health.providerCredits.elevenLabs.status.slice(1)}
                </Badge>
              </div>
              </div>
              </CardHeader>
              <CardContent className="p-0 mb-1 lg:px-0">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-[14px]! 2xl:text-lg! font-light text-text-dark dark:text-sidebar-accent-foreground ">
                  ElevenLabs Credits
                </CardTitle>
                <span className="text-sm 2xl:text-xl font-medium text-success">
                  {health.providerCredits.elevenLabs.characterLimit > 0
                    ? (
                      (health.providerCredits.elevenLabs.charactersRemaining /
                      health.providerCredits.elevenLabs.characterLimit) *
                      100
                    ).toFixed(1)
                    : "0.0"}
                  %
                </span>
              </div>
              </CardContent>
            </div>
          </Card>
        )}

        {hasProviderCredits && health.providerCredits?.telnyx && (
          <Card className="p-3 relative overflow-hidden bg-surface-soft/15 dark:bg-sidebar-accent">
            <div className="space-y-3">
              <CardHeader className="p-0 pb-1 lg:px-0">
                <div className="flex items-center justify-between">
                  <div
                    className="relative z-10 flex items-center justify-center size-[32px] lg:size-[36px] 2xl:size-[36px] 4xl:size-[44px] rounded-[12px] shadow-md bg-white dark:bg-sidebar-accent-foreground backdrop-blur-sm"
                  >
                    <div className="w-[14px] h-[14px] 2xl:w-[20px] 2xl:h-[20px] 4xl:w-[20px] 4xl:h-[21px] flex items-center justify-center text-sidebar-accent">
                      <TelnyxIcn />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Status</span>
                    <Badge
                      variant={ health.providerCredits.telnyx.status === "ok" ? "default" : "destructive"}
                      className={`text-xs ${
                        health.providerCredits.telnyx.status === "ok"
                          ? "bg-success text-success-foreground"
                          : "bg-danger-soft text-destructive-foreground"
                      }`}
                    >
                      {health.providerCredits.telnyx.status.charAt(0).toUpperCase() + health.providerCredits.telnyx.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 mb-1 lg:px-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[14px]! 2xl:text-lg! font-light text-sidebar-accent dark:text-sidebar-accent-foreground">
                    Telnyx Credits
                  </CardTitle>
                  <span className={`"text-sm 2xl:text-xl font-medium ${
                    health.providerCredits.telnyx.status === "ok" ? "text-success" : "text-danger-soft"
                  }`}>
                    ${health.providerCredits.telnyx.availableCredit}
                  </span>
                </div>
              </CardContent>
            </div>
          </Card>
        )}
      </div>

      <div className="">
      {health.issues && health.issues.length > 0 && (
        <div
          className={`rounded-lg border p-4 ${
            health.status === "critical"
              ? "border-danger bg-danger-light"
              : "border-warning bg-warning-light"
          }`}
        >
          <h4
            className={`font-semibold mb-2 flex items-center gap-2 ${
              health.status === "critical" ? "text-danger" : "text-warning"
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            Issues Detected
          </h4>
          <ul className="space-y-1 text-sm">
            {health.issues.map((issue, index) => (
              <li
                key={index}
                className={
                  health.status === "critical" ? "text-danger" : "text-warning"
                }
              >
                • {issue}
              </li>
            ))}
          </ul>
        </div>
      )}
      </div>
    </div>
  );
}
