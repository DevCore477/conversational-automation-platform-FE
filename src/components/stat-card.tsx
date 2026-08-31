"use client";

import { cn } from "@/lib/utils";
import { WaveBackground } from "@/components/wave-background";
import type { StaticImageData } from "next/image";

type StatCardVariant = "default" | "success" | "danger" | "info";

interface StatCardProps {
  title: string;
  subtitle?: string;
  value: string | number;
  icon: React.ReactNode;
  variant?: StatCardVariant;
  className?: string;
  showWave?: boolean;
  waveColor?: string;
  valueColor?: string;
  bgGif?: string | StaticImageData;
  bgOpacity?: number;
}

const variantStyles: Record<StatCardVariant, string> = {
  default: "text-blue-500 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30",
  success: "text-green-500 dark:text-green-400 bg-green-100 dark:bg-green-900/30",
  danger: "text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30",
  info: "text-blue-500 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30",
};


export function StatCard({
  title,
  subtitle = "",
  value,
  icon,
  variant = "default",
  className,
  showWave = false,
  waveColor,
  valueColor = "text-sidebar-accent-foreground",
  bgGif,
  bgOpacity,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-4",
        !showWave && variantStyles[variant],
        className,
      )}
    >
      {bgGif && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgGif})` }}
          />
          <div
            className="absolute inset-0 bg-white"
            style={{ opacity: bgOpacity ?? 0.75 }}
          />
        </>
      )}

      {!bgGif && showWave && (
        <WaveBackground waveColor={waveColor} className="rounded-lg" />
      )}
      <div
        className={cn(
          "relative z-10 flex items-center justify-center size-[32px] lg:size-[36px] 2xl:size-[36px] 4xl:size-[44px] rounded-[12px] shadow-md bg-white dark:bg-sidebar-accent-foreground backdrop-blur-sm",
        )}
      >
        <div className="size-4 2xl:size-6 4xl:w-[20px] 4xl:h-[21px] flex items-center justify-center text-sidebar-accent drop-shadow">
          {icon}
        </div>
      </div>

      <div className="relative z-10 flex flex-row justify-between items-center w-full mt-3">
        <div className="flex flex-col items-flex-start gap-0.5">
          <span
            className={cn(
              showWave
                ? "text-white tracking-tight leading-tight"
                : "tracking-tight leading-tight text-sidebar-accent dark:text-sidebar-accent-foreground",
              "text-[16px] 2xl:text-lg",
            )}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {title}
          </span>
          {subtitle && (
            <span
              className={cn(
                "font-normal leading-[18px]",
                "text-[12px] 2xl:text-[12px] 4xl:text-[14px]",
                "text-[#303030] dark:text-white",
              )}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {subtitle}
            </span>
          )}
        </div>

        <span
          className={cn(
            showWave
              ? "text-white font-medium tracking-tight leading-none"
              : "font-mediu tracking-tight leading-none text-foreground",
            "text-[20px] 2xl:text-[24px] 4xl:text-[34px] ", valueColor
          )}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}
