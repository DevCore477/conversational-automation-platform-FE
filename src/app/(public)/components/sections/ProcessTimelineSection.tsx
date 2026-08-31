"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { AgentVoiceBG } from "@/assets";

export type ProcessStep = {
  number: string;
  duration: string;
  title: string;
  description: string;
  tag: string;
  timeline: string;
};

export type ProcessTimelineSectionProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  steps: ProcessStep[];
  className?: string;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const numberVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 15,
      delay: 0.1,
    },
  },
};

export default function ProcessTimelineSection({
  eyebrow,
  title,
  subtitle,
  steps,
  className,
}: ProcessTimelineSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const handleScroll = () => {
      const viewportCenter = window.innerHeight / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;

      stepRefs.current.forEach((ref, index) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const distance = Math.abs(cardCenter - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [steps.length]);

  return (
    <section
      ref={containerRef}
      className={
        className ??
        "relative w-full overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-10 lg:py-20 4xl:py-36"
      }
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-slate-100/50 to-transparent rounded-full" />
      </div>

      <div className="font-dm-sans relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-10 md:mb-12 lg:mb-16 max-w-3xl text-center "
        >
          {eyebrow && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-50/80 px-4 py-1.5 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500" />
              </span>
              <span className="text-sm font-semibold tracking-wider text-purple-700 uppercase">
                {eyebrow}
              </span>
            </motion.div>
          )}

          <p className="mb-1 lg:mb-3 text-sm font-light uppercase tracking-wider text-cyan-blue">
            HOW WE WORK
          </p>

          <h2 className="text-[28px] md:text-3xl lg:text-4xl 2xl:text-5xl 4xl:text-6xl font-medium tracking-tight text-slate-900">
            <span className="bg-gradient-to-r from-cyan-blue to-neon-pink bg-clip-text text-transparent">
              {title}
            </span>
          </h2>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-slate-gray font-light text-center 2xl:text-lg 4xl:text-xl w-full lg:max-w-lg 2xl:max-w-2xl mx-auto mt-2 lg:leading-relaxed"
            >
              {subtitle}
            </motion.p>
          )}
        </motion.header>

        {/* Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative"
        >
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-200">
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-gradient-to-b from-purple-400 via-violet-400 to-purple-500"
            />
          </div>

          <div className="space-y-8 md:space-y-0">
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1;
              const isActive = index === activeIndex;

              return (
                <motion.div
                  key={step.number}
                  variants={itemVariants}
                  ref={(el) => {
                    stepRefs.current[index] = el;
                  }}
                  className={`relative ${isLast ? "" : "mb-8 md:mb-16"}`}
                >
                  {/* Timeline node */}
                  <div className="absolute left-8 z-10 -translate-x-1/2">
                    <motion.div
                      variants={numberVariants}
                      className={`relative flex size-9 md:size-11 items-center justify-center overflow-hidden rounded-full text-sm font-bold ring-3 shadow-lg transition-all duration-700 ease-in-out  md:text-lg ${
                        isActive
                          ? "text-white ring-white shadow-purple-500/25"
                          : "bg-white text-slate-300 ring-white shadow-slate-200/50"
                      }`}
                    >
                      {isActive && (
                        <Image
                          src={AgentVoiceBG}
                          alt=""
                          fill
                          className="absolute inset-0 object-cover z-0"
                        />
                      )}
                      <span className="relative z-10">{step.number}</span>
                    </motion.div>
                  </div>

                  {/* Content card */}
                  <div className="ml-16 md:ml-20">
                    <div
                      className={`group relative rounded-2xl border p-4 transition-all duration-700 ease-in-out md:p-6 ${
                        isActive
                          ? "border-purple-400/40 shadow-lg shadow-purple-500/10"
                          : "border-slate-200 bg-white shadow-sm hover:border-purple-300 hover:shadow-[0_0_24px_rgba(168,85,247,0.15)]"
                      }`}
                    >
                      <div className="absolute inset-0 overflow-hidden rounded-2xl">
                        <Image
                          src={AgentVoiceBG}
                          alt="gradient-bg"
                          fill
                          className={`object-cover z-0 transition-opacity duration-700 ease-in-out ${
                            isActive ? "opacity-100" : "opacity-0"
                          }`}
                        />
                      </div>

                      <div className="relative z-10 space-y-2">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold transition-all duration-500 ease-in-out ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {step.timeline}
                        </span>
                        <h3
                          className={`font-semibold md:text-lg 4xl:text-xl transition-colors duration-500 ease-in-out ${
                            isActive ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {step.title}
                        </h3>
                        <p
                          className={`text-sm leading-relaxed md:text-sm transition-colors duration-500 ease-in-out ${
                            isActive ? "text-white/80" : "text-slate-500"
                          }`}
                        >
                          {step.description}
                        </p>
                        <div
                          className={`transition-all duration-500 ease-in-out overflow-hidden ${
                            isActive
                              ? "max-h-12 opacity-100 pt-1"
                              : "max-h-0 opacity-0 pt-0"
                          }`}
                        >
                          <span className="inline-flex items-center ml-0.5 mb-1 gap-1 rounded-xl bg-white/20 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/30">
                            {step.tag}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
