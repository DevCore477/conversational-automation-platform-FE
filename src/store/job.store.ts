import { create } from "zustand";
import { Job } from "@/types/JobTypes";

interface JobStore {
  selectedJob: Job | null;
  jobs: Job[];
  loading: boolean;
  error: string | null;
  setSelectedJob: (job: Job | null) => void;
  setJobs: (jobs: Job[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearSelectedJob: () => void;
  fetchJobs: () => Promise<void>;
}

export const useJobStore = create<JobStore>((set, get) => ({
  selectedJob: null,
  jobs: [],
  loading: true,
  error: null,

  setSelectedJob: (job) => set({ selectedJob: job }),
  setJobs: (jobs) => set({ jobs }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearSelectedJob: () => set({ selectedJob: null }),

  fetchJobs: async () => {
    const MAX_RETRIES = 3;
    const TIMEOUT_MS = 5000;

    set({ loading: true, error: null });

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

        const response = await fetch("/api/jobs", {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const jobsData: Job[] = data.data.records;
        set({ jobs: jobsData, loading: false });
        return;
      } catch (error) {
        if (attempt === MAX_RETRIES) {
          console.error("Error fetching jobs:", error);
          set({
            // error: "Something went wrong. Please check back later",
            loading: false,
          });
        }
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  },
}));
