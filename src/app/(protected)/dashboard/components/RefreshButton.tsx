"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RetryArrowIcn } from "@/assets/icons/Icons";

interface RefreshButtonProps {
  onRefresh?: () => void | Promise<void>;
}

export default function RefreshButton({
  onRefresh,
}: RefreshButtonProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleClick = async () => {
    try {
      setIsRefreshing(true);

      if (onRefresh) {
        await onRefresh();
      } else {
        router.refresh();
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        className="flex items-center gap-2 cursor-pointer  rounded-md lg:rounded-lg px-1.5 py-0.75 md:px-2 md:py-1 border bg-background shadow-xs hover:bg-accent text-text-dark hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
        onClick={handleClick}
        disabled={isRefreshing}
      >
        <RetryArrowIcn className={` size-4 lg:size-5 ${isRefreshing ? "animate-spin" : ""}`} />
        <h3 className="text-[12px] md:text-[14px] 2xl:text-[16px] font-medium">
          Refresh
        </h3>
      </button>
    </div>
  );
}