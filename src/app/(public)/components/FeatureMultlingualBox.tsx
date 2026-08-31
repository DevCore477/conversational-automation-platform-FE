import Image from "next/image";
import Link from "next/link";

import { BrazilGif, FeatureMultlingualBG, GermanyGif, UAEGif } from "@/assets";

export default function FeatureMultlingualBox() {
  return (
    <Link href="/multilingual-support" className="cursor-pointer relative block w-full h-[414px] lg:h-[450px] 4xl:h-[500px] rounded-[12px] lg:rounded-[20px] overflow-hidden">
      <Image
        src={FeatureMultlingualBG}
        alt="multi-lingual-bg"
        fill
        className="object-cover"
      />

      {/* Text */}
      <div className="absolute cursor-pointer top-0 left-2 lg:left-0 p-2 xs:p-5 flex flex-col gap-1 text-white z-10">
        <p className=" cursor-pointer font-semibold text-base xl:text-lg 4xl:text-[28px]">
          Multilingual Support
        </p>
        <p className="cursor-pointer font-medium text-xs md:text-xs xl:text-sm 4xl:text-base">
          Support 18+ languages, can dial to any countries phone numbers.
        </p>
      </div>

      {/* Circle 1 - UAE */}
      <div className="absolute cursor-pointer -bottom-[80px] -left-[80px] z-10">
        <div className="relative cursor-pointer w-[210px] lg:w-[220px] xl:w-[260px] h-[210px] lg:h-[220px] xl:h-[260px] rounded-full border border-[#6C757D] bg-[#33333333]">
          <div className="absolute cursor-pointer -top-4 lg:-top-6 4xl:-top-10 left-24 w-[50px] lg:w-[60px] 4xl:w-[80px] h-[50px] lg:h-[60px] 4xl:h-[80px]">
            <Image
              src={UAEGif}
              alt="uae-animation"
              fill
              className="object-cover rounded-full cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Circle 2 - Germany */}
      <div className="cursor-pointer absolute -bottom-[120px] -left-[120px] z-20">
        <div className=" cursor-pointer relative w-[310px] h-[310px] lg:w-[330px] lg:h-[330px] xl:w-[380px] xl:h-[380px] rounded-full border border-[#6C757D] bg-[#33333333]">
          <div className="cursor-pointer absolute top-5 lg:top-20 4xl:top-20 right-4 lg:-right-4 w-[50px] lg:w-[60px] 4xl:w-[80px] h-[50px] lg:h-[60px] 4xl:h-[80px]">
            <Image
              src={GermanyGif}
              alt="germany-animation"
              fill
              className="cursor-pointer object-cover rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Circle 3 - Brazil */}
      <div className="cursor-pointer absolute -bottom-[160px] -left-[160px] z-30">
        <div className="relative cursor-pointer w-[430px] h-[430px] lg:w-[450px] lg:h-[450px] xl:w-[500px] xl:h-[500px] rounded-full border border-[#6C757D] bg-[#33333333]">
          <div className="cursor-pointer absolute top-1 4xl:top-0 right-20 4xl:right-18 w-[50px] lg:w-[60px] 4xl:w-[80px] h-[50px] lg:h-[60px] 4xl:h-[80px]">
            <Image
              src={BrazilGif}
              alt="brazil-animation"
              fill
              className="cursor-pointer object-cover rounded-full"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
