"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

import { AgentVoiceBG } from "@/assets";

import DemoAnimation from "../DemoAnimation";

export default function AgentVoiceSection() {
  const AGENT_VOICE_FEATURE = [
    {
      title: "Auto-Sync Knowledge Base",
      description:
        "Your AI agents stay up-to-date effortlessly by syncing directly with your company's knowledge base. No manual updates required ",
    },
    {
      title: "Powerful Call Transfer Feature",
      description:
        "Easily set up warm transfers with handoff messages so the next agent is always prepared. Setup multiple call transfers based on your needs.",
    },
    {
      title: "Easy Appointment Booking",
      description:
        "Let your AI phone agents schedule meetings in seconds with simple, natural language. Integrate tools like Cal.com to ensure appointments are automatically logged.",
    },
    {
      title: "Navigate IVR",
      description:
        "When encounter IVR systems, Hexa Agents has the ability to press the correct digits to the right destination.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="font-dm-sans bg-gradient-to-r from-accent-purple-2 to-accent-purple-4 py-10 lg:py-20">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-16 flex flex-col gap-4 lg:gap-16 4xl:gap-20">
        <h2 className="font-semibold text-xl lg:text-2xl xl:text-3xl 4xl:text-4xl text-dark-gray">
          Powerful AI Voice Agent Creation Features
        </h2>
        <div className="flex flex-col md:flex-row items-start gap-4 lg:gap-0">
          <div className="flex-1/2 flex flex-col gap-1 lg:gap-3 w-full max-w-[550px]">
            {AGENT_VOICE_FEATURE.map((feature, index) => (
              <div key={index}>
                {index !== 0 && (
                  <div className="ml-0 lg:ml-5 lg:mb-3 w-full md:max-w-[300px] lg:max-w-[350px] xl:max-w-[430px] 4xl:max-w-[550px] h-[1px] bg-cyan-blue" />
                )}
                <div
                  className="
                                        group hover:bg-white rounded-[20px] py-3 lg:p-5 w-full md:max-w-[300px] lg:max-w-[350px] xl:max-w-[450px] 4xl:max-w-[550px]
                                        transition-all duration-300 ease-out
                                        hover:shadow-xl"
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <p className="font-normal lg:font-semibold text-sm md:text-base xl:text-xl 4xl:text-[24x] text-dark-gray">
                    {feature.title}
                  </p>

                  <AnimatePresence>
                    {activeIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{
                          duration: 0.4,
                          ease: [0.1, 0.62, 0.23, 0.98],
                        }}
                        className="overflow-hidden"
                      >
                        <motion.p
                          initial={{ y: -5, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -5, opacity: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          className="text-xs md:text-xs xl:text-sm  4xl:text-base text-slate-gray pt-2"
                        >
                          {feature.description}
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
          <div className="relative w-full md:w-[250px] h-[250px] lg:w-[550px] lg:h-[320px] xl:w-[610px] xl:h-[380px]  border rounded-xl border-cyan-blue overflow-hidden mx-auto">
            <Image
              src={AgentVoiceBG}
              alt="agent-voice-bg"
              fill
              className="object-cover"
            />

            {/* Demo animation overlay */}
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <DemoAnimation />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
