"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import KnowledgeBaseImg from "@/assets/Product/Knowledge Base/Knowledge Base.png";
import CustomerServiceImg from "@/assets/Product/Knowledge Base/Customer Service.png";
import HandIcon from "@/assets/Product/Knowledge Base/HandIcon.png";
import Button from "../../Button";
import { HexaRGBLogo } from "@/assets";
import Link from "next/link";

const KnowledgeHero = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timings = [1500, 800, 1000, 400, 2000, 1000];
    let timeout;
    const advance = () => {
      setPhase((prev) => (prev + 1) % 6);
    };
    timeout = setTimeout(advance, timings[phase]);
    return () => clearTimeout(timeout);
  }, [phase]);

  return (
    <section className="relative w-full overflow-hidden bg-white py-10 lg:py-20 4xl:py-32">
      {/* Background Decorative Gradient */}
      <div className="relative w-full max-w-7xl mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-2 4xl:gap-16">
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
              Power your AI Agent <br />
              with{" "}
              <span className="bg-linear-to-r from-cyan-blue to-neon-pink bg-clip-text text-transparent">
                Knowledge Base
              </span>
            </h1>
            <p
              className={`text-center lg:text-start w-full 2xl:max-w-md 4xl:max-w-lg 4xl:[400px] mt-4 text-sm lg:text-base 4xl:text-xl font-light text-slate-gray leading-snug`}
            >
              {" "}
              Ensure your AI agent delivers precise, up-to-date responses every
              time. Hexa Ai Knowledge Base feature seamlessly integrates
              webpages, documents, and custom content to keep your agent
              informed and efficient.
            </p>
          </div>

          {/* Right Side: Visual Mockup */}
          <div className="relative order-2 flex justify-center ">
            <div className="relative flex h-[300] md:h-[400px] 2xl:h-[500px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#F9F9FB]  shadow-[0px_20px_50px_rgba(14,165,233,0.05)] border border-white">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              >
                <source src="/videos/Product/Knowledge Base/KnowledgeHero.webm" type="video/webm" />
              </video>

              {/* Content wrapper */}
              <div className="relative z-10 flex w-full max-w-[450px] items-center justify-center">
                {/* Knowledge Base Card */}
                <div className="relative">
                  <div
                    className={`transform transition-all duration-700 origin-top-left
                                        ${phase === 0 ? "scale-[0.30] opacity-0" : "scale-[1.15] opacity-100"}`}
                  >
                    <Image
                      src={KnowledgeBaseImg}
                      alt="Knowledge Base"
                      priority
                      width={240}
                      height={240}
                      className="h-auto w-[160px] sm:w-[240px] drop-shadow-2xl"
                    />
                  </div>

                  {/* Animated Hand Cursor */}
                  <div
                    className={`absolute pointer-events-none z-20 transform transition-all origin-top-left
                                            ${
                                              phase >= 2
                                                ? "top-[20px] right-[-15px] opacity-100 scale-100"
                                                : "top-[20px] right-[-80px] opacity-0 scale-100"
                                            }`}
                    style={{
                      transitionDuration: phase >= 2 ? "1000ms" : "700ms",
                      transitionTimingFunction: "ease-in-out",
                    }}
                  >
                    <Image
                      src={HandIcon}
                      alt="Pointer"
                      width={32}
                      height={32}
                      className="drop-shadow-lg"
                    />
                  </div>
                </div>

                {/* Customer Service Card - appears after hand click */}
                <div
                  className={`absolute left-[130px] sm:left-[230px] top-[40px] sm:top-[50px] transition-all origin-top-left
                                        ${
                                          phase >= 4 && phase <= 5
                                            ? "opacity-100 scale-100"
                                            : "opacity-0 scale-[0.40] pointer-events-none"
                                        }`}
                  style={{
                    transitionDuration: "500ms",
                    transitionTimingFunction:
                      "cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                >
                  <Image
                    src={CustomerServiceImg}
                    alt="Customer Service"
                    width={280}
                    height={280}
                    className="h-auto w-[180px] sm:w-[280px] drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KnowledgeHero;
