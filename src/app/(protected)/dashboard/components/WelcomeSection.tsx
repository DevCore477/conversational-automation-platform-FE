"use client";

import React from "react";
import { SlidersHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { usePeriodStore, type Period } from "@/store/period.store";
import { ExportCSVButton } from "./ExportCSVButton";
import GifButton from "@/components/GifButton";

type Props = {
  overview: any;
  recentActivity: any[];
  scripts: any;
  agents: any[];
  flows: any[];
  scriptPerf: any[];
};

const WelcomeSection = ({
  overview,
  recentActivity,
  scripts,
  agents,
  flows,
  scriptPerf,
}: Props) => {
  const { period, setPeriod } = usePeriodStore();

  const handlePeriodChange = (selectedPeriod: Period) => {
    setPeriod(selectedPeriod);
  };

const displayPeriod = period ? period.charAt(0).toUpperCase() + period.slice(1) : "All";

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 w-full">
      <div>
        <h2 className="text-xl lg:text-3xl font-medium tracking-tight">
          Welcome Back !
        </h2>

        <p className="text-xs lg:text-base text-muted-foreground">
          Here&apos;s what&apos;s happening with your AI calls today.
        </p>
      </div>

      <div className="w-auto flex items-center justify-end gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <GifButton
              label={displayPeriod}
              icon={<SlidersHorizontal className="size-4 md:size-5" />}
            />
            {/* <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-full flex-row-reverse h-10 pr-1 pl-2 dark:text-accent-foreground"
            >
              <span className="flex items-center justify-center size-7 rounded-full bg-surface-light dark:bg-accent">
                <SlidersHorizontal className="size-4 text-text-dark dark:text-sidebar-accent-foreground" />
              </span>

              {displayPeriod}
            </Button> */}
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handlePeriodChange(null)}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handlePeriodChange("hour")}>
              Hour
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => handlePeriodChange("day")}>
              Day
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => handlePeriodChange("week")}>
              Week
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => handlePeriodChange("month")}>
              Month
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ExportCSVButton
          overview={overview}
          recentActivity={recentActivity}
          scripts={scripts}
          agents={agents}
          flows={flows}
          scriptPerf={scriptPerf}
        />
      </div>
    </div>
  );
};

export default WelcomeSection;