import Image from "next/image";

import { AgentVoiceBG, GDPR, Hipaa } from "@/assets";

export default function FeatureComplaintBox() {
  return (
    <div className="relative w-full h-[210px] 4xl:h-[230px] rounded-[12px] lg:rounded-[20px] overflow-hidden">
      <Image
        src={AgentVoiceBG}
        alt="agent-voice-bg"
        fill
        className="object-cover"
      />
      <div className="absolute flex flex-col gap-1 top-0 left-2 lg:left-0 p-2 xs:p-5 text-white">
        <p className="font-semibold text-base xl:text-lg 4xl:text-[28px]">
          Fully Complaint Platform
        </p>
        <p className="font-medium text-xs md:text-xs xl:text-sm 4xl:text-base">
          Hexa Ai is SOC 2 Type 1&2, HIPAA, and GDPR compliant, meeting all
          industry compliance standards.
        </p>
        <div className="flex justify-between sm:justify-start xs:gap-4 lg:gap-8 items-center mt-1">
          <div className="mr-2 w-20 md:w-16 lg:w-20 h-20 md:h-16 lg:h-20 rounded-full flex items-center justify-center bg-white">
            <Image
              src={Hipaa}
              className="w-[52px] md:w-8 lg:w-[52px] h-[52px] md:h-8 lg:h-[52px]"
              alt="hipaa-img"
            />
          </div>
          <div className="w-[88px] md:w-[70px] lg:w-[88px] h-[88px] md:h-[70px] lg:h-[88px] rounded-full border-[6px] border-white flex items-center justify-center">
            <p className="font-bold text-lg md:text-xs lg:text-lg text-center leading-none">
              AICPA{"\n"}SOC 2
            </p>
          </div>
          <Image
            src={GDPR}
            className="h-24 w-24 md:w-[74px] lg:w-24 md:h-[74px] lg:h-24"
            alt="gdpr-pic"
          />
        </div>
      </div>
    </div>
  );
}
