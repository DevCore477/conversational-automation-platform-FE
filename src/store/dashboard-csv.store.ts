import { create } from "zustand";
import { DashboardOverview } from "@/types/dashboard.types";

interface DashboardExportStore {
  exporting: boolean;
  exportOverviewCSV: (overview: DashboardOverview) => void;
}

export const useDashboardExportStore = create<DashboardExportStore>(
  (set) => ({
    exporting: false,

    exportOverviewCSV: (overview) => {
      set({ exporting: true });

      try {
        const { summary, callStats } = overview;

        const rows = [
          ["Metric", "Value"],

          // Summary
          ["Total Calls", summary.totalCalls],

          // Call Stats
          ["Active Calls", callStats.byStatus.active],
          ["Completed Calls", callStats.byStatus.completed],
          ["Failed Calls", callStats.byStatus.failed],
          ["Initiating Calls", callStats.byStatus.initiating],

          // Derived
          ["Success Rate (%)", callStats.successRate.toFixed(1)],
          ["Retried Calls", callStats.byStatus.retried],
        ];

        const csv = rows.map((r) => r.join(",")).join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `dashboard-stats.csv`;

        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);
      } finally {
        set({ exporting: false });
      }
    },
  })
);