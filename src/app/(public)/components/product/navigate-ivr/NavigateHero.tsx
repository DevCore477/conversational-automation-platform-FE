"use client";

import { useState, useEffect } from "react";
import Button from "../../Button";
import { HexaRGBLogo } from "@/assets";
import Image from "next/image";
import Link from "next/link";

const NavigateHero = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setIsAnimating((prev) => !prev), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-white py-10 lg:py-20 4xl:py-32">
      {/* Background Decorative Gradient */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(153,131,191,0.06)_100%)]"
        aria-hidden
      />

      <div className="relative  w-full max-w-7xl mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-2 2xl:gap-16">
          {/* Left Side: Content */}
          <div className="font-dm-sans order-1 flex flex-col justify-start">
            <span className="mb-4 hidden lg:block font-dm-sans text-xs font-light uppercase tracking-[0.2em] text-slate-gray 2xl:text-sm">
              BUILD
            </span>
            <Link href="/" className="lg:hidden cursor-pointer mb-3 mx-auto">
              <Image src={HexaRGBLogo} width={60} height={40} alt="hexa-icon" />
            </Link>
            <h1
              className={`text-center lg:text-start text-3xl 2xl:text-4xl 3xl:text-[44px] 4xl:text-[48px] lg:leading-10 2xl:leading-11 4xl:leading-14 font-medium text-dark-gray`}
            >
              {" "}
              Effortlessly{" "}
              <span className="bg-linear-to-r from-cyan-blue to-neon-pink bg-clip-text text-transparent">
                Navigate IVR Systems{" "}
              </span>
              with Hexa AI
            </h1>
            <p
              className={`text-center lg:text-start w-full 2xl:max-w-md 4xl:max-w-lg mt-4 text-sm lg:text-base 4xl:text-xl font-light text-slate-gray leading-snug`}
            >
              {" "}
              Ensure your AI agent can handle IVR systems like a pro. Hexa AI
              Navigate IVR feature allows your agent to press digits
              automatically, routing calls to the right department without
              delays.
            </p>
          </div>

          {/* Right Side: Visual Mockup */}
          <div className="relative order-2 flex justify-center">
            <div className="relative flex h-[350px] md:h-[350px] lg:h-[400px] 2xl:h-[500px] w-full items-center justify-center overflow-hidden rounded-[32px] bg-[#F9F9FB] shadow-[0px_20px_50px_rgba(14,165,233,0.05)] border border-white">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              >
                <source src="/videos/Product/Navigate IVR/NavigateHero.webm" type="video/webm" />
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NavigateHero;
