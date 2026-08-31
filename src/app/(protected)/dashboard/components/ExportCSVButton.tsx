// components/export-csv-button.tsx

"use client";

import { Button } from "@/components/ui/button";
import { downloadCSV } from "@/lib/dashboard/export-csv";
import { Upload } from "lucide-react";
import { buildDashboardCSV } from "@/lib/dashboard/build-dashboard-csv";
import GifButton from "@/components/GifButton";

interface ExportCSVButtonProps {
  overview: any;
  recentActivity: any[];
  scripts: any;
  agents: any[];
  flows: any[];
  scriptPerf: any[];
}

export function ExportCSVButton({
  overview,
  recentActivity,
  scripts,
  agents,
  flows,
  scriptPerf,
}: ExportCSVButtonProps) {
  const handleExport = () => {
    const csvData = buildDashboardCSV({
      overview,
      recentActivity,
      scripts,
      agents,
      flows,
      scriptPerf,
    });

    downloadCSV(csvData, "dashboard-report.csv");
  };

  return (
    <>
      <GifButton
        label="Export Data"
        icon={<Upload className="size-4 md:size-5" />}
        onClick={handleExport}
      />
      {/* <Button
        onClick={handleExport}
        variant="outline"
        size="sm"
        className="gap-2 rounded-full flex-row-reverse h-10 pr-1 dark:text-accent-foreground"
      >
        <span className="flex items-center justify-center size-7 rounded-full bg-surface-light dark:bg-accent">
          <Upload className="size-4" />
        </span>
        Export Data
      </Button> */}
    </>
  );
}