import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Period = "hour" | "day" | "week" | "month" | null ;

interface PeriodStore {
  period: Period;
  setPeriod: (period: Period) => void;
}

export const usePeriodStore = create<PeriodStore>()(
  persist(
    (set) => ({
      period: "month",
      setPeriod: (period) => set({ period }),
    }),
    {
      name: "dashboard-period-storage", // persists in localStorage
    }
  )
);