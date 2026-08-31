import Image from "next/image";

import { FeatureScalabilityBG } from "@/assets";

import ScalablePhoneAnimation from "./ScalablePhoneAnimation";

export default function FeatureScalabilityBox() {
  return (
    <div className="relative w-full h-[414px] lg:h-[450px] 4xl:h-[500px] rounded-[12px] lg:rounded-[20px] overflow-hidden">
      {/* Background */}
      <Image
        src={FeatureScalabilityBG}
        alt="scalability-bg"
        fill
        className="object-cover"
      />

      {/* Text */}
      <div className="absolute top-0  left-2 lg:left-0 p-2 xs:p-5 flex flex-col gap-1 text-white z-10">
        <p className="font-semibold text-base xl:text-lg 4xl:text-[28px]">
          Scalability
        </p>
        <p className="font-medium text-xs md:text-xs xl:text-sm 4xl:text-base">
          Effortlessly handle millions of calls with scalable concurrent
          calling.
        </p>
      </div>

      {/* Phone animation */}
      <div className="absolute bottom-10 md:bottom-8 lg:bottom-12 4xl:bottom-15 left-1/2  -translate-x-1/2 z-10">
        <ScalablePhoneAnimation />
      </div>
    </div>
  );
}
