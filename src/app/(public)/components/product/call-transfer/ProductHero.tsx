"use client";
import { useState, useEffect } from "react";
import { Cursor, HexaRGBLogo } from "@/assets";
import Button from "../../Button";
import Image from "next/image";
import Link from "next/link";

const ProductHero = () => {
  const [showTransfer, setShowTransfer] = useState(false);
  const [showTransferCard, setShowTransferCard] = useState(false);
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowTransfer((prev) => {
        const next = !prev;
        if (next) {
          // Start scaling up, wait for it to finish (1500ms), then show card
          setTimeout(() => setShowTransferCard(true), 1500);
        } else {
          // Hide card immediately, then scale down
          setShowTransferCard(false);
        }
        return next;
      });
    }, 4000); // Increased interval to account for staggering

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (showTransfer) {
      timer = setTimeout(() => {
        setShowCursor(true);
      }, 700);
    } else {
      setShowCursor(false);
    }

    return () => clearTimeout(timer);
  }, [showTransfer]);

  return (
    <section className="relative w-full overflow-hidden bg-white py-10 lg:py-20 4xl:py-32">
      {/* Background Decorative Gradient */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(153,131,191,0.06)_100%)]"
        aria-hidden
      />

      <div className="relative  w-full max-w-7xl mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-2 4xl:gap-16">
          {/* Left Side: Content */}
          <div className="font-dm-sans order-1 flex flex-col justify-start lg:items-start ">
            <span className="mb-4 hidden lg:block font-dm-sans text-xs font-light uppercase tracking-[0.2em] text-slate-gray 2xl:text-sm">
              BUILD
            </span>
            <Link href="/" className="lg:hidden cursor-pointer mb-3 mx-auto">
              <Image src={HexaRGBLogo} width={60} height={40} alt="hexa-icon" />
            </Link>
            <h1
              className={`text-center lg:text-start text-3xl 2xl:text-4xl 3xl:text-[44px] 4xl:text-[48px] lg:leading-10 2xl:leading-11 4xl:leading-15 font-medium text-dark-gray`}
            >
              {" "}
              Power your AI Agent <br />
              with{" "}
              <span className="bg-linear-to-r from-cyan-blue to-neon-pink bg-clip-text text-transparent">
                Call Transfer
              </span>
            </h1>
            <p
              className={`text-center lg:text-start w-full 2xl:max-w-md 4xl:max-w-lg mt-4 text-sm lg:text-base 4xl:text-xl font-light text-slate-gray leading-snug`}
            >
              {" "}
              Streamline customer calls with Hexa AI's fast,
              context-rich, and personalized AI-powered call
              transfer options.
            </p>
          </div>

          {/* Right Side: Visual Mockup */}
          <div className="relative order-2 flex justify-center ">
            <div className="relative flex h-[300] md:h-[400px] 2xl:h-[500px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#F9F9FB] lg:h-full shadow-[0px_20px_50px_rgba(14,165,233,0.05)] border border-white">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              >
                <source src="/videos/gif/ProductHero.webm" type="video/webm" />
              </video>

              {/* Content Layer (Cards) */}
              <div className="relative z-10 flex items-center justify-center -translate-y-8 -translate-x-4 md:-translate-y-12 md:-translate-x-12 lg:-translate-y-20 lg:-translate-x-17">
                {/* Functions Card */}
                <div
                  onClick={() => !showTransfer && setShowTransfer(true)}
                  className={` absolute  origin-top-left  transition-all duration-700 ease-in-out bg-white rounded-2xl shadow-xl p-5 z-10 cursor-pointer 
                                ${showTransfer ? "w-64 sm:w-72 transform rotate-0 scale-90" : "w-64 sm:w-72 transform rotate-0 scale-50 hover:scale-90"}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600 font-semibold text-xs tracking-tight">
                      Functions
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent double toggle
                      }}
                      className="relative bg-amber-400 p-1 rounded hover:bg-amber-300 transition-colors"
                    >
                      <div className="absolute -top-12 left-0">
                        { showCursor  && (
                          <img src={Cursor.src} alt="Cursor" className="size-32 ease-in-out" />
                        )}
                        </div>
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={4}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="text-[9px] text-gray-400 mb-5 leading-relaxed pr-6">
                    Enable your agent with capabilities such as calendar
                    bookings, call termination...
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 bg-[#F4F4F5] p-2.5 rounded-lg">
                      <svg
                        className="w-3.5 h-3.5 text-black"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span className="text-[10px] font-medium text-gray-600">
                        Phone call
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-[#F4F4F5] p-2.5 rounded-lg">
                      <svg
                        className="w-3.5 h-3.5 text-black"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-[10px] font-medium text-gray-600">
                        Calendar
                      </span>
                    </div>
                  </div>
                </div>

                {/* Transfer Call Card */}
                <div
                  className={`relative w-80 md:2-96 bg-white rounded-xl shadow-2xl border border-gray-100 p-5 z-20 
                                    transition-all duration-[1000ms] ease-in-out
                                    translate-x-40 translate-y-20
                                    sm:translate-x-28 sm:translate-y-30
                                    md:translate-x-52 md:translate-y-38
                                    scale-45 sm:scale-55 md:scale-70 origin-top-left
                                    ${showTransferCard ? "opacity-100 translate-y-20 " : "opacity-0 translate-y-28 pointer-events-none"}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                      Transfer Call
                    </h3>
                    <button
                      onClick={() => setShowTransfer(false)}
                      className="w-6 h-6 rounded-lg bg-amber-400 flex items-center justify-center text-white hover:bg-amber-300 transition-colors"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="mb-6">
                    <label className="text-[10px] font-bold text-gray-400 tracking-widest block mb-2">
                      Transfer to
                    </label>
                    <div className="bg-white rounded-md p-2 border border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">
                        + 571 1234 2345
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-3">
                      Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-100 border border-gray-100 rounded-md p-3 flex items-center justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-gray-900 block">
                            Cold Transfer
                          </span>
                          <span className="text-[8px] text-gray-400 block leading-[1.2]">
                            AI transfers without speaking
                          </span>
                        </div>
                        <div className="size-3 min-w-3 rounded-full  bg-white"></div>
                      </div>
                      <div className="bg-white border-2 border-blue-500 rounded-md p-3 flex items-center justify-between shadow-sm">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-gray-900 block">
                            Warm Transfer
                          </span>
                          <span className="text-[8px] text-gray-400 block leading-[1.2]">
                            AI briefs the next agent after transfer
                          </span>
                        </div>
                        <div className=" size-3 min-w-3 rounded-full bg-blue-500"></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                      Handoff Message
                    </label>
                    <div className="bg-white rounded-md p-2 border border-gray-100 min-h-[80p]">
                      <span className="text-[11px] text-gray-400 leading-tight">
                        Say hello to the agent and summarize the user problem to
                        him.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductHero;
