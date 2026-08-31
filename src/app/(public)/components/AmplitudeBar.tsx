"use client";

import type React from "react";

interface AmplitudeBarProps {
  isPaused: boolean;
  noOfAmplitudes: number; // Number of times to repeat the full pattern
  widthClass?: string;
  bgColor?: string;
  pattern?: number[];
  responsivePatterns?: {
    default: number[];
    lg: number[];
    md: number[];
    mobile: number[];
  };
}

export default function AmplitudeBar({
  isPaused,
  noOfAmplitudes,
  widthClass = "w-[6px]",
  bgColor = "bg-black",
  pattern = [14, 22, 34, 22, 14],
  responsivePatterns,
}: AmplitudeBarProps) {
  const activePattern = responsivePatterns?.default ?? pattern;
  const totalBars = activePattern.length * noOfAmplitudes;

  return (
    <div className="flex items-center gap-[2px]">
      {Array.from({ length: totalBars }).map((_, i) => {
        const defaultHeight = activePattern[i % activePattern.length];
        const lgHeight = responsivePatterns?.lg[i % responsivePatterns.lg.length];
        const mdHeight = responsivePatterns?.md[i % responsivePatterns.md.length];
        const mobileHeight =
          responsivePatterns?.mobile[i % responsivePatterns.mobile.length];

        return (
          <span
            key={i}
            className={`
              ${widthClass} rounded-full ${bgColor}
              animate-wave
              ${isPaused ? "paused" : ""}
            `}
            style={{
              "--bar-height": `${defaultHeight}px`,
              "--bar-height-lg": `${lgHeight ?? defaultHeight}px`,
              "--bar-height-md": `${mdHeight ?? defaultHeight}px`,
              "--bar-height-mobile": `${mobileHeight ?? defaultHeight}px`,
              animationDelay: `${i * 0.08}s`,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}
