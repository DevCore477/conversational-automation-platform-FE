"use client";
import Image from "next/image";

import { FeatureVoiceAiBG } from "@/assets";
import { useBreakpoint } from "@/hooks/use-breakpoint";

import AmplitudeBar from "./AmplitudeBar";

export default function FeatureVoiceAiBox() {
  const breakpoint = useBreakpoint();

  return (
    <div className="relative w-full h-[210px] lg:h-[250px] 4xl:h-[300px] rounded-[12px] lg:rounded-[20px] overflow-hidden">
      <Image
        src={FeatureVoiceAiBG}
        alt="agent-voice-bg"
        fill
        className="object-cover"
      />

      <div className="absolute top-0 left-2 lg:left-0 p-2 xs:p-5 flex flex-col gap-1 text-white">
        <p className="font-semibold text-base xl:text-lg 4xl:text-[28px]">
          Voice AI API
        </p>

        <p className="font-medium text-xs md:text-xs xl:text-sm 4xl:text-base max-w-md">
          Natural, smooth and empathetic AI conversations with only 500ms
          latency.
        </p>

        <div className="flex justify-center mt-6">
          <AmplitudeBar
            noOfAmplitudes={
              breakpoint === "sm" || breakpoint === "mobile"
                ? 6
                : breakpoint === "md"
                  ? 5
                  : breakpoint === "lg"
                    ? 6
                    : 8
            }
            isPaused={false}
            pattern={[15, 30, 50, 30, 15]}
          />
        </div>
      </div>
    </div>
  );
}
