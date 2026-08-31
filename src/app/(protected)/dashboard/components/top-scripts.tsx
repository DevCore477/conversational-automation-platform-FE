"use client";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { type TopScriptsResponse } from "@/types/dashboard.types";
import { CallIcn } from "@/assets/icons/Icons";
import { usePeriodStore, type Period } from "@/store/period.store";
import { useEffect, useState } from "react";

interface TopScriptsProps {
  scripts: TopScriptsResponse | null;
  isLoading?: boolean;
}

const bgColors = ["bg-success", "bg-warning", "bg-cyan-blue"];
const textColors = ["text-success", "text-warning", "text-cyan-blue"];

export function TopScripts({
  scripts: initialScripts,
  isLoading: externalLoading,
}: TopScriptsProps) {
  const { period } = usePeriodStore();
  const [scriptsData, setScriptsData] = useState<TopScriptsResponse | null>(initialScripts || null);
  const [isLoading, setIsLoading] = useState(true);

   // Fetch top scripts when period changes
  useEffect(() => {
    const fetchTopScripts = async () => {
      setIsLoading(true);
      const effectivePeriod = period || "hour";
      try {
        const token = document.cookie.split("auth-token=")[1]?.split(";")[0];
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/dashboard-stats/scripts/top?limit=5&period=${effectivePeriod}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.ok) {
          const data = await response.json();
          setScriptsData(data);
        } else {
          console.error("[TopScripts] Failed to fetch:", response.status);
        }
      } catch (error) {
        console.error("[TopScripts] Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopScripts();
  }, [period]);

  const scripts = scriptsData?.templates || [];

  if (isLoading || externalLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!scripts || scripts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-8 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground lg:text-base">No Templates available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {scripts.map((script, index) => {
        const bgColor = bgColors[index % bgColors.length];
        const textColor = textColors[index % textColors.length];

        return (
          <div
            key={script.id}
            className="flex items-start gap-4 p-4 rounded-2xl border bg-surface-soft/10 transition-colors"
          >
            {/* Vertical line */}
            <div className={`w-[4px] h-13 rounded-2xl ${bgColor}`}></div>

            {/* Content */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap gap-1 sm:flex-nowrap xs:items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm lg:text-base text-sidebar-accent dark:text-sidebar-accent-foreground font-medium">
                    {script.name}
                  </h4>
                </div>
                <Badge variant="outline" className="capitalize ">{script.template}</Badge>
              </div>

              <div className="flex flex-col gap-1 xs:flex-row items-cente justify-between sm:gap-4 text-xs sm:text-sm lg:text-base text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CallIcn className={`size-3 sm:size-4 ${textColor}`} />
                  <span>
                    Total Calls:<span className={textColor}> {script.totalCalls}</span>
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-success">
                    {script.successRate.toFixed(1)}% success
                  </span>
                </div>
              </div>
              {/* <Progress value={script.successRate} className="h-2 bg-success" /> */}
            </div>
          </div>
        );
      })}
    </div>
  );
}
