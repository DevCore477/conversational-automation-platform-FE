"use client";

import React from "react";
import { 
  GoogleSheet, Slack, GoogleDrive, Hubspot, 
  Gmail, Calendly, Airtable, SalesForce , energy, CursorArrow
} from "@/assets";
import FeatureCard from "./FeatureCard";

const HowItWorks = () => {
  const scatteredIcons = [
    { id: 1, pos: "top-[28%] left-[30%]", img: GoogleSheet, group: "first-four" },  
    { id: 2, pos: "top-[42%] left-[58%]", img: Slack, group: "first-four" },       
    { id: 3, pos: "top-[55%] left-[85%]", img: GoogleDrive, group: "first-four" }, 
    { id: 4, pos: "top-[87%] left-[30%]", img: Hubspot, group: "first-four" },     

    { id: 5, pos: "top-[28%] left-[85%]", img: Gmail, group: "second-four" },     
    { id: 6, pos: "top-[55%] left-[30%]", img: Calendly, group: "second-four" },    
    { id: 7, pos: "top-[87%] left-[85%]", img: Airtable, group: "second-four" },  
    { id: 8, pos: "top-[70%] left-[58%]", img: SalesForce, group: "second-four" },      
  ];

  return (
    <>
      <div className="relative w-full overflow-hidden py-10 lg:py-20 mx-auto">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/multilingual-bg-animation.webm" type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-white/93" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 flex flex-col items-center">  
        {/* Section Header */}
        <h2 className="mb-8 lg:mb-16 text-center font-dm-sans text-xl lg:text-2xl xl:text-3xl 4xl:text-4xl font-semibold text-dark-gray leading-tight">
          How it works
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-6">
          
          {/* Step 1: Trigger */}
          <FeatureCard
            variant="primary"
            title="Select a trigger"
            description="A trigger is an event kicking off your AI agent — like a new email in your Gmail inbox."
          >
            <div className="flex w-full flex-col items-center gap-6">
              <div className="flex w-[90%] items-center gap-3 rounded-md bg-white p-2 shadow-sm transition-transform hover:scale-105">
                <img src={energy.src} alt="energy" className="size-8 object-contain" />
                <span className="font-dm-sans text-sm font-light text-dark-gray">When this happens...</span>
              </div>
              <div className="relative h-12 w-0.5 bg-slate-gray">
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-gray"></div>
              </div>
              <div className="flex w-[90%] items-center gap-3 rounded-md bg-white p-2 shadow-sm transition-transform hover:scale-105">
                <img src={CursorArrow.src} alt="cursor arrow" className="size-8 object-contain" />
                <span className="font-dm-sans text-sm font-light text-dark-gray">Do this</span>
              </div>
            </div>
          </FeatureCard>

          {/* Step 2: Connections */}
          <FeatureCard
            variant="tertiary"
            title="Connect your apps"
            description="Hundreds of integrations available."
          >
            <div className="relative aspect-square w-full overflow-hidden">
              <div className="absolute inset-0">
                {scatteredIcons.map((icon) => (
                  <div 
                    key={icon.id}
                    className={`absolute ${icon.pos} -translate-x-1/2 -translate-y-1/2 
                      ${icon.group === "first-four" ? "animate-cinematic-1" : "animate-cinematic-2"}`}
                  >
                    <div className="animate-icon-bounce">
                      <div className="flex size-12 items-center justify-center rounded-xl bg-white shadow-xl transition-transform hover:rotate-12">
                        <img src={icon.img.src} alt="app" className="h-full w-full rounded-2xl object-contain" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FeatureCard>

          {/* Step 3: Instructions */}
          <FeatureCard
            variant="secondary"
            title="Let AI do the work"
            description="Give custom instructions to your agent, all in natural language."
          >
            <div className="w-full gap-4 space-y-2 mx-4">
              <span className="mb-2 font-dm-sans text-[12px] font-medium uppercase tracking-widest text-dark-gray">Email body</span>
              <div className="mt-1 inline-block rounded-lg bg-white px-3 py-2 font-dm-sans text-xs lg:text-sm 4xl:text-lg text-dark-gray shadow-md transition-all hover:-translate-y-1">
                Write a personalized email to the
              </div>
              <div className="inline-block rounded-lg bg-white px-3 py-2 font-dm-sans text-xs lg:text-sm 4xl:text-lg text-dark-gray shadow-md transition-all hover:-translate-y-1">
                lead, using the info you found
              </div>
              <div className="inline-block rounded-lg bg-white px-3 py-2 font-dm-sans text-xs lg:text-sm 4xl:text-lg text-dark-gray shadow-md transition-all hover:-translate-y-1">
                about them.
              </div>
            </div>
          </FeatureCard>
        </div>
      </div>

      <style jsx>{`
        @keyframes g1 {
          0%, 5% { opacity: 0; transform: translate(-50%, -50%) scale(0.3); }
          12% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
          15%, 85% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          95%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(1.1); }
        }

        @keyframes g2 {
          0%, 45% { opacity: 0; transform: translate(-50%, -50%) scale(0.3); }
          52% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
          55%, 85% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          95%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(1.1); }
        }

        @keyframes iconBounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }

        .animate-cinematic-1 {
          animation: g1 8s infinite cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-cinematic-2 {
          animation: g2 8s infinite cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-icon-bounce {
          animation: iconBounce 3s infinite ease-in-out;
        }
      `}</style>
    
    </div>
    </>
  );
};

export default HowItWorks;