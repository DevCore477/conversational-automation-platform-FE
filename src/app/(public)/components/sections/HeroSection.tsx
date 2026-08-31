import Image from "next/image";

import { HexaPhone, HexaRGBLogo } from "@/assets";

import AmplitudeBar from "../AmplitudeBar";
import HeroActions from "./HeroActions";
// import { useRouteScroll } from "../ScrollToElement";

export default function HeroSection() {
  // const { routeToSection } = useRouteScroll();
  return (
    <div className="font-dm-sans min-h-screen flex flex-col justify-center items-center pt-10 lg:pt-20 pb-5 lg:pb-10 4xl:pt-32 px-4 md:px-16 overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-1 justify-center items-center ">
        <Image
          className="lg:hidden mb-3"
          src={HexaRGBLogo}
          width={65}
          height={44}
          alt="hexa-icon"
        />
        <h1 className="text-3xl xl:text-[40px] 4xl:text-[56px] font-medium text-dark-gray lg:max-w-2xl 4xl:max-w-4xl text-center leading-snug">
          Enterprise-Ready
          <span className="bg-linear-to-r from-bright-red to-cyan-blue bg-clip-text text-transparent">
            {" "}
            Voice AI Agents{" "}
          </span>
          for Automated Phone Calls
        </h1>
        <p className="text-xs md:text-base xl:text-xl 4xl:text-[26px] font-light text-slate-gray max-w-md 4xl:max-w-2xl text-center">
          Deploy AI voice agents for inbound & outbound calls, appointment booking, support routing, and analytics — without adding headcount.
        </p>
      </div>

      <HeroActions />

      <div className="relative flex items-center justify-center w-full max-w-6xl">
        {/* Amplitude Bar with side images */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex items-center opacity-10">
            {/* Amplitude Bar */}
            <AmplitudeBar
              isPaused={false}
              noOfAmplitudes={1}
              widthClass="w-[30px] md:w-[40px] lg:w-[48px] xl:w-[72px]"
              bgColor="bg-cyan-blue"
              responsivePatterns={{
                mobile: [80, 90, 100, 110, 120, 110, 100, 90, 80],
                md: [
                  130, 140, 150, 160, 170, 180, 190, 180, 170, 160, 150, 140,
                  130,
                ],
                lg: [
                  140, 150, 160, 170, 180, 190, 200, 210, 220, 210, 200, 190,
                  180, 170, 160, 150, 140,
                ],
                default: [
                  200, 215, 230, 245, 260, 275, 290, 305, 320, 305, 290, 275,
                  260, 245, 230, 215, 200,
                ],
              }}
            />
          </div>
        </div>

        {/* Phone Image Container */}
        <div className="relative z-10">
          <Image
            src={HexaPhone}
            alt="hexa-phone"
            priority
            sizes="(min-width: 1024px) 480px, 260px"
            className="w-[260px] h-[380px] lg:w-[480px] lg:h-[760px]"
          />
        </div>
      </div>
    </div>
  );
}
