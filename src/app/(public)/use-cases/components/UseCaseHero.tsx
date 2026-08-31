"use client";

import Image from "next/image";
import type { UseCaseHeroProps } from "./use-case.types";
import AmplitudeBar from "../../components/AmplitudeBar";
import { HexaRGBLogo } from "@/assets";
import Link from "next/link";

/**
 * Split hero (copy + image) or centered copy-only when `image` is omitted.
 * Matches public landing spacing: container widths, typography scale, DM Sans via globals.
 */
export default function UseCaseHero({
  title,
  description,
  image,
  children,
  showAmplitude = false,
}: UseCaseHeroProps) {
const copyBlock = (
    <div
      className={`space-y-2 mb-4 ${image ? "text-left" : "text-center mx-auto max-w-4xl"}`}
    >
      <Link href="/" className="lg:hidden flex items-center justify-center cursor-pointer mb-3 mx-auto">
        <Image src={HexaRGBLogo} width={60} height={40} alt="hexa-icon" />
      </Link>
      <h1
        className={`font-dm-sans text-3xl xl:text-3xl 2xl:text-4xl 3xl:text-[44px] 4xl:text-[48px] lg:leading-9 2xl:leading-11 4xl:leading-14  font-medium text-dark-gray text-center leading-snu lg:max-w-xl 4xl:max-w-5xl tracking-tight ${image ? "lg:text-left lg:max-w-none 4xl:max-w-none" : ""}`}
      >
        <span className="bg-linear-to-r from-bright-red to-cyan-blue bg-clip-text text-transparent">
          Artificial Intelligence
        </span><br />
        {title}
      </h1>
      <p
        className={`font-dm-sans w-full text-sm lg:text-base 4xl:text-xl text-center lg:text-left font-thin text-slate-gray leading-snug max-w-md mx-auto ${image ? "lg:max-w-xl" : "mx-auto text-center"} ${image ? "lg:text-left" : ""}`}
      >
        {description}
      </p>
      {children ? (
        <div
          className={image ? "" : "flex flex-wrap justify-center gap-3 pt-2"}
        >
          {children}
        </div>
      ) : null}
    </div>
  );

  if (!image) {
    return (
      <section className="relative w-full overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] max-h-[520px] bg-gradient-to-b from-transparent to-[rgba(153,131,191,0.1)]"
          aria-hidden
        />
        <div className="relative w-11/12 md:w-10/12 lg:w-11/12 2xl:w-10/12 mx-auto py-12 md:py-16 lg:py-20 xl:py-24">
          {copyBlock}
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] max-h-[600px] bg-[linear-gradient(180deg,rgba(255,255,255,0)_48.08%,rgba(153,131,191,0.1)_100%)]"
        aria-hidden
      />
      <div className="relative w-full lg:max-w-7xl mx-auto px-6 md:px-16 py-10 lg:py-20 4xl:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-6 lg:gap-12 xl:gap-16 items-start">
          {copyBlock}
          <div className="relative w-full rounded-[20px] lg:max-h-[400px]">
            <Image
              src={image.src}
              alt={image.alt}
              priority
              className={`w-full h-auto object-contain rounded-[20px] min-h-[250px] md:min-h-[380px] max-w-[500px] lg:max-h-[400px] mx-auto ${image.className ?? ""}`}
              sizes="(min-width: 1024px) 500px, 92vw"
            />

            {showAmplitude && (
              <div className="absolute bottom-10 lg:bottom-20 -left-5 lg:-left-12 z-10">
                <div className=" bg-white py-2 px-4  lg:py-4 lg:px-6 rounded-full shadow-md w-full max-w-32 lg:max-w-52">

                <AmplitudeBar
                  noOfAmplitudes={6}
                  isPaused={false}
                  pattern={[9, 13, 25, 15, 9]}
                  />
              </div>
              </div>
            )}

          </div> 
        </div> 
      </div> 
    </section> 
  );
} 
