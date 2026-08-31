"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useJobStore } from "@/store/job.store";

import { Building2, Clock, Mail, Map } from "lucide-react";
import Image from "next/image";
import { JobDetailHero } from "@/assets";

const CareersJobDetailsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("id");

  const { selectedJob, setSelectedJob, jobs, fetchJobs } = useJobStore();
  const [localLoading, setLocalLoading] = useState(true);

  // Fetch jobs if not already loaded
  useEffect(() => {
    if (jobs.length === 0) {
      fetchJobs();
    }
  }, [fetchJobs, jobs.length]);

  // Find and set the selected job from URL or existing jobs
  useEffect(() => {
    if (!jobId) {
      router.push("/careers");
      return;
    }

    // First check if we already have it in store
    if (selectedJob?.id === jobId) {
      setLocalLoading(false);
      return;
    }

    // Try to find it from the jobs list
    const foundJob = jobs.find((job) => job.id === jobId);

    if (foundJob) {
      setSelectedJob(foundJob);
      setLocalLoading(false);
    } else if (jobs.length > 0) {
      // Job not found in current list → redirect
      router.push("/careers");
    }
    // If jobs are still loading, wait...
  }, [jobId, jobs, selectedJob?.id, setSelectedJob, router]);

  const formatJobType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  };

  if (localLoading || !selectedJob) {
    return (
      <div className="py-24 relative overflow-hidden">
        <div className="w-11/13 max-w-[1440px] mx-auto md:px-16 relative z-10">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-blue"></div>
              <p className="mt-4 text-slate-gray">Loading job details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const vacancyDetails = [
    { icon: Mail, text: selectedJob.title },
    { icon: Clock, text: formatJobType(selectedJob.type) },
    {
      icon: Building2,
      text:
        selectedJob.workMode === "onsite"
          ? "On-Site"
          : selectedJob.workMode === "remote"
            ? "Remote"
            : "Hybrid",
    },
    { icon: Map, text: selectedJob.location },
  ];

  return (
    <>
      <div className="relative overflow-hidden">
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

        <div className="font-dm-sans w-11/13 max-w-[1440px] mx-auto py-6 md:px-16 md:py-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div className="max-w-xl">
              <h2 className="text-2xl lg:text-3xl 2xl:text-4xl 2xl:leading-12 font-medium text-dark-gray mb-2 md:mb-4 tracking-tight">
                Join us to shape the future of human-technology interaction
              </h2>
              <p className="text-slate-gray 2xl:text-xl">
                We're always looking for talented and driven minds from diverse
                backgrounds to join our team.
              </p>
            </div>
            <div className="py-6 lg:py-16">
              <Image src={JobDetailHero} alt="Job Detail Hero Image" />
            </div>
          </div>
        </div>
      </div>

      <div className="font-dm-sans relative w-11/12 2xl:w-10/12 max-w-[1440px] mx-auto px-2 py-8 md:px-16 md:py-20 lg:py-24 pb-12 md:pb-16 lg:pb-24">
        <h2 className="text-center w-60 mx-auto text-xl md:w-full md:text-2xl lg:text-3xl 2xl:text-4xl font-semibold text-dark-gray tracking-tight">
          {selectedJob.title}
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1">
            <h3 className="text-xl lg:text-2xl 2xl:text-3xl font-semibold text-dark-gray mb-4">
              Vacancy details
            </h3>
            <div className="space-y-3 mt-10 mb-12 flex flex-row flex-wrap gap-2 gap-x-12 md:flex-col">
              {vacancyDetails.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-slate-gray"
                  >
                    <Icon size={20} />
                    <p className="text-base 2xl:text-lg">{item.text}</p>
                  </div>
                );
              })}
            </div>
            <a
              href={selectedJob.applicationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block bg-dark-gray text-white px-8 max-w-44 py-2 rounded-lg font-medium 2xl:text-lg cursor-pointer transition-colors text-center"
            >
              Apply Now
            </a>
          </div>

          {/* Right Column - Display HTML Description */}
          <div className="lg:col-span-2">
            <p className="text-dark-gray text-base lg:text-lg">
              Wish to be part of a strong team of professionals and create
              innovative and challenging projects? So, this opportunity is
              definitely for you!
            </p>
            <div className="">
              <h3 className="text-xl lg:text-2xl  2xl:text-3xl font-semibold text-cyan-blue mb-4 mt-10">
                Our Mission
              </h3>
              <p className="text-dark-gray text-base 2xl:text-lg">
                Hexa Ai are a team of passionate individuals. We understand that
                every business is unique and we will work with the clients to
                maximize the value of enterprise platforms to fit every client's
                unique needs.
              </p>
            </div>

            {/* Render the HTML description directly */}
            <div
              className="mt-8 job-description max-w-none text-dark-gray"
              dangerouslySetInnerHTML={{ __html: selectedJob.description }}
            />

            {/* Display salary information */}
            {selectedJob.salary && (
              <div className="mt-8 p- bg-gray-50 rounded-lg">
                <h4 className="text-lg lg:text-xl 2xl:text-2xl font-medium text-cyan-blue mb-4">
                  Salary Range
                </h4>
                <p className="text-dark-gray text-base 2xl:text-lg">
                  {selectedJob.salary.currency}{" "}
                  {selectedJob.salary.from.toLocaleString()} -{" "}
                  {selectedJob.salary.to.toLocaleString()} per month
                </p>
              </div>
            )}

            <div className="mt-8">
              <h4 className="text-lg lg:text-xl 2xl:text-2xl font-medium text-cyan-blue mb-4">
                Benefits to join us:
              </h4>
              <ul className="list-disc pl-5 text-dark-gray text-base 2xl:text-lg">
                <li>Biannual Salary Increments</li>
                <li>Paid Leaves (Encashable)</li>
                <li>Project based Commission & Incentives</li>
                <li>Monthly Town hall Meet ups</li>
                <li>Annual Dinner & Service Recognition Awards</li>
                <li>Paternity & Maternity Leaves</li>
                <li>Compensatory Leaves</li>
                <li>Company Sponsored Lunches & Dinners</li>
                <li>Structured Career Growth & Learning Opportunities</li>
                <li>Company Sponsored Trips</li>
              </ul>
            </div>

            <div className="mt-8 text-center">
              <a
                href={selectedJob.applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="md:hidden bg-dark-gray text-white px-10 py-2 rounded-lg font-medium lg:text-lg cursor-pointer transition-colors inline-block"
              >
                Apply Now
              </a>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

const CareersJobDetails = () => {
  return (
    <Suspense
      fallback={
        <div className="py-24 relative overflow-hidden">
          <div className="w-11/13 max-w-[1440px] mx-auto md:px-16 relative z-10">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-blue"></div>
                <p className="mt-4 text-slate-gray">Loading job details...</p>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <CareersJobDetailsContent />
    </Suspense>
  );
};

export default CareersJobDetails;
