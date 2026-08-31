import Image from "next/image";
import Link from "next/link";
import { BlueBlur, PinkBlur, WorkFlowImage } from "@/assets";

export default function IntegrationSection() {
  return (
    <div className="font-dm-sans relative 4xl:py-10 pb-12">
      <div className="pointer-events-none absolute inset-0 z-10">
        <Image
          src={BlueBlur}
          alt="blue-blur"
          className="absolute -top-60 right-0"
        />

        <Image
          src={PinkBlur}
          alt="pink-blur"
          className="absolute -top-30 right-0"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10">
        <Image
          src={PinkBlur}
          alt="pink-blur"
          className="absolute -bottom-60 left-0"
        />

        <Image
          src={BlueBlur}
          alt="blue-blur"
          className="absolute -bottom-10 left-0"
        />
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 md:px-16 flex flex-col lg:flex-row items-center lg:items-start py-10 lg:py-20 4xl:py-20 gap-14 md:gap-20 lg:gap-0 overflow-hidden">
        {/* Left content */}
        <div className="flex-1 flex flex-col gap-7 lg:gap-16 4xl:gap-20">
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold text-xl xl:text-3xl 4xl:text-4xl text-dark-gray">
              Seamlessly Integrate with your tech stack
            </h2>
            <p className="font-light text-slate-gray text-xs lg:text-base 4xl:text-base">
              With native and external connectivity to any CRM, telephony,
              automation platform, and database, building and deploying phone
              agents has never been easier.
            </p>
          </div>

          <Link
            href="/integrations"
            className="flex w-[130px] items-center justify-center gap-2 whitespace-nowrap rounded-[12px] border border-dark-gray bg-dark-gray px-3 py-2 text-[12px] font-medium text-text-light md:text-xs lg:w-[180px] lg:text-sm xl:gap-3 4l:w-[235px] 4xl:text-base"
          >
            See All Integrations
          </Link>
        </div>

        {/* Right content */}
        <div className=" flex-1 flex items-center justify-center lg:mt-16">
          {/* <WorkflowDiagram /> */}
          <Image
            src={WorkFlowImage}
            alt="workflow-image"
            className="w-[270px] xs:w-[340px] h-[190px] xs:h-[260px] sm:w-[300px] sm:h-[210px] md:w-[440px] md:h-[340px] lg:w-[560px] lg:h-[380px] 2xl:w-[640px] 2xl:h-[460px]"
          />
        </div>
      </div>
    </div>
  );
}
