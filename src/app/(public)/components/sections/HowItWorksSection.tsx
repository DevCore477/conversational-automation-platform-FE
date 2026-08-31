"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { AgentVoiceBG } from "@/assets";

export type HowItWorksStep = {
  title: string;
  description: string;
  icon: ReactNode;
};

export type HowItWorksSectionProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  steps: HowItWorksStep[];
};

// function renderIcon(icon: ReactNode) {
//   if (!icon) return null;
//   if (typeof icon === "object" && icon !== null && "src" in icon) {
//     const img = icon as { src: string; alt?: string };
//     return (
//       // eslint-disable-next-line @next/next/no-img-element
//       <img src={img.src} alt="" className="size-full object-contain" />
//     );
//   }
//   return icon;
// }

export default function HowItWorksSection({
  eyebrow = "How It Works",
  title,
  subtitle,
  steps,
}: HowItWorksSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="font-dm-sans w-full max-w-7xl mx-auto px-6 md:px-16 py-10 lg:py-20">
      <header className="mx-aut mb-16 text-center md:text-start">
        <p className="text-sm font-light text-cyan-blue uppercase tracking-wider mb-3">
          {eyebrow}
        </p>
        <h2 className="text-xl lg:text-2xl xl:text-3xl 4xl:text-4xl font-semibold text-dark-gray">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm text-slate-gray md:text-base">
            {subtitle}
          </p>
        )}
      </header>

      <div className="flex flex-col gap-5 md:flex-row flex-wrap lg:flex-nowrap">
        {steps.map((step, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={step.title}
              onMouseEnter={() => setActiveIndex(index)}
              className={`group relative flex cursor-pointer flex-col rounded-3xl border transition-all duration-500 ease-out ${
                isActive
                  ? "overflow-hidden border-surface-soft p-5 lg:p-8 shadow-lg flex-[1.5] min-h-65 md:min-h-85 md:min-w-52 lg:max-w-96"
                  : "bg-white border-slate-200 p-4 lg:p-7 hover:border-surface-soft flex-1 min-h-50 md:min-h-85 md:min-w-48 lg:max-w-80"
              }`}
            >
              {isActive && (
                <Image src={AgentVoiceBG} alt="gradient-bg" fill className="object-cover z-0" />
              )}
              <span
                className={`absolute left-5 lg:left-6 top-6 text-3xl lg:text-5xl font-extrabold tabular-nums leading-none transition-colors duration-300 ${
                  isActive ? "text-slate-100" : "text-slate-200 group-hover:text-[var(--surface-soft)]"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className={`mt-auto ${isActive ? "relative z-10" : ""}`}>
                {/* <div
                  className={`mb-4 flex size-10 md:size-12 items-center justify-center rounded-2xl transition-all duration-300`}
                >
                  {renderIcon(step.icon)}
                </div> */}
                <div className="size-11 mb-4 bg-[#F9F9F9] rounded-lg  shadow-md text-dark-gray flex items-center justify-center ">
                  {step.icon}
                </div>

                <h3
                  className={`mb-1 lg:mb-2.5 text-lg 4xl:text-xl font-semibold leading-snug ${
                    isActive ? "text-white" : "text-dark-gray"
                  }`}
                >
                  {step.title}
                </h3>

                {isActive && (
                  <p className="pt-1 text-sm leading-relaxed text-white/80 max-w-sm">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
