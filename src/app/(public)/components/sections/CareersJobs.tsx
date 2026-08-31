"use client";
import { useEffect } from "react";
import { useJobStore } from '@/store/job.store';
import { MapPin } from "lucide-react";
import { Job } from "@/types/JobTypes";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const CareersJobs = () => {
  const { jobs, loading, error, fetchJobs, setSelectedJob } = useJobStore();
  const router = useRouter();

  // Format salary range
  const formatSalary = (from: number, to: number, currency: string) => {
    const formatNumber = (num: number) => {
      if (num >= 1000) {
        return (num / 1000).toFixed(0) + "K";
      }
      return num.toString();
    };
    return `${formatNumber(from)}${formatNumber(to) !== formatNumber(from) ? ` - ${formatNumber(to)}` : ""} ${currency}`;
  };

  // Format time ago
  const getTimeAgo = (createdAt: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60)
    );
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours === 1) return "1hr ago";
    if (diffInHours < 24) return `${diffInHours}hrs ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // Format job type display
  const formatJobType = (type: string) => {
    return type.split("_").map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(" ");
  };

  // Check if job is active
  const isJobActive = (status: string): boolean => {
    return status === "active";
  };

  const handleViewJob = (job: Job) => {
    setSelectedJob(job); // Store job in Zustand store
    router.push(`/careers-job-details?id=${job.id}`);
  };

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <>
      <div className="py-10 lg:py-20 relative overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/gif/ProductDiff.webm" type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-white/79"></div>

        <div className="font-dm-sans w-full max-w-7xl mx-auto px-6 md:px-16 relative z-10">
          <h2 className="text-center text-xl lg:text-2xl xl:text-3xl 4xl:text-4xl font-medium text-dark-gray mb-12 tracking-tight">
            Find the role that best fits you!
          </h2>

          {error ? (
            <div className="text-center py-12">
              <p className="text-danger-soft">{error}</p>
            </div>
          ) : loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i}
                  className="bg-card dark:bg-card-foreground rounded-xl p-4 lg:px-6 lg:py-7 shadow-sm space-y-4"
                >
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-5 w-20 dark:bg-primary" />
                    <Skeleton className="h-4 w-16 dark:bg-primary" />
                  </div>

                  <Skeleton className="h-6 w-3/4 dark:bg-primary" />
                  <div className="flex gap-3">
                    <Skeleton className="h-4 w-full max-w-24 dark:bg-primary" />
                    <Skeleton className="h-4 w-full max-w-24 dark:bg-primary" />
                    <Skeleton className="h-4 w-full max-w-24 dark:bg-primary" />
                  </div>

                  <Skeleton className="h-6 w-24 dark:bg-primary" />
                </div>
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div key={job.id}
                  className="bg-card dark:bg-card-foreground rounded-xl space-y-2 p-4 lg:px-6 lg:py-7 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2">
                    <h3 className={`font-medium ${ isJobActive(job.status) ? "text-cyan-blue" : "text-muted-text" }`}>
                      {isJobActive(job.status) ? "Open Role" : "Closed Role"}
                    </h3>

                    <span className="ml-2 size-1.5 rounded-full bg-cyan-blue" />
                    <span className="text-muted-text text-sm">{getTimeAgo(job.createdAt)}</span>
                  </div>

                  <h2 className="text-base 2xl:text-lg 4xl:text-xl text-dark-gray font-medium">
                    {job.title}
                  </h2>

                  <div className="flex items-center gap-2 text-[12px] 2xl:text-[14px] flex-wrap">
                    <h3 className="text-slate-gray">
                      {formatJobType(job.type)}
                    </h3>

                    <span className="flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-cyan-blue" />
                      <span className="text-slate-gray">
                        {formatSalary(
                          job.salary.from,
                          job.salary.to,
                          job.salary.currency
                        )}
                      </span>
                    </span>

                    <span className="flex items-center gap-1">
                      <MapPin size={16} className="text-cyan-blue" />
                      <span className="text-slate-gray">{job.location || job.company?.name}</span>
                    </span>
                  </div>

                  {isJobActive(job.status) ? (
                    <button
                      onClick={() => handleViewJob(job)}
                      className="text-cyan-blue text-sm 2xl:text-base font-semibold hover:underline mt-3"
                    >
                      View & Apply
                    </button>
                  ) : (
                    <h3 className="text-muted-text font-semibold">
                      Position Filled
                    </h3>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-text">
                No job openings available at the moment. Please check back later!
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CareersJobs;