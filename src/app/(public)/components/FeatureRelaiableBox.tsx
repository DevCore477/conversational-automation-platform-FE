import Image from "next/image";

import { HexaRGBLogo, RelaiableGif } from "@/assets";

export default function FeatureRelaiableBox() {
  return (
    <div className="flex flex-col bg-surface-light w-full h-[280px] lg:h-[410px] 4xl:h-[430px] rounded-[12px] lg:rounded-[20px] p-2 xs:p-5 overflow-hidden">
      <div className="flex flex-col gap-1 mb-4 xl:mb-8">
        <p className="font-semibold text-base xl:text-lg 4xl:text-[28px] text-dark-gray">
          Reliable and Stable Platform You can trust
        </p>
        <p className="font-medium text-xs md:text-xs xl:text-sm 4xl:text-base text-slate-gray">
          With average 99.99% uptime and effortless fallback. Hexa AI ensures
          your phone callers are always production-ready.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Image
          src={HexaRGBLogo}
          className="w-[32px] 2xl:w-[36px] 4xl:w-[40px] h-[20px] 2xl:h-[24px] 4xl:h-[28px]"
          alt="hexa-rgb"
        />
        <p className="font-medium text-xl 4xl:text-[26px] text-dark-gray">
          Hexa Ai
        </p>
      </div>
      <div className="mb-auto pt-4">
        <div className=" w-full overflow-hidden rounded-full">
          <Image
            src={RelaiableGif}
            alt="reliable-animation"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
