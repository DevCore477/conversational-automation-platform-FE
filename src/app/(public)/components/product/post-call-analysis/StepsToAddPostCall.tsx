"use client";

import { useState, useEffect } from "react";
import Texticon from "@/assets/Product/Post Call Analysis/Texticon.png";
import SelectorIcon from "@/assets/Product/Post Call Analysis/SelectorIcon.png";
import { Hash, MoveDown, MoveUp, Plus, X } from "lucide-react";
import FeatureCard from "../../FeatureCard";

const StepsToAddPostCall = () => {
  const [showGifs, setShowGifs] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowGifs(true), 100);
    return () => clearTimeout(timer);
  }, []);
  return (
    <section className="py-10 lg:py-20 bg-white">
      <div className="font-dm-sans w-full max-w-7xl mx-auto px-6 md:px-16">
        <h2 className="text-center md:text-start text-xl lg:text-2xl xl:text-3xl 4xl:text-4xl font-semibold text-dark-gray mb-8 lg:mb-12 tracking-tight">
          Step by step to add post call analysis{" "}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Step 1 */}
          <FeatureCard
            variant="primary"
            title="Navigate to Post-Call Analysis" description="Create an agent or select an agent from template. Go to the agent detail page and click on the &quot;Post-Call Analysis&quot; tab."
          >
            <div className="relative z-10 bg-white rounded-lg shadow-md p-5 w-full max-w-[280px]">
              <div className="flex items-center justify-between mb-2 pb-2 border-b">
                <span className="text-slate-gray font-medium text-[13px]">
                  Post Call Analysis
                </span>
                <div className="size-4.5 rounded bg-warning flex items-center justify-center shadow">
                  <Plus className="size-3.5 text-white" strokeWidth="3"/>
                </div>
              </div>
              <p className="text-[10px] text-slate-gray mb-2 leading-relaxed">
                Define the information that you need to extract from the call.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-3 bg-[#EDEDED]/50 rounded-sm px-3 py-0.5">
                  <span className="text-[17px] font-bold text-dark-gray"> B </span>
                  <span className="text-[10px] font-medium text-slate-gray"> Boolean </span>
                </div>
                <div className="flex items-center gap-3 bg-[#EDEDED]/50 rounded-sm px-3 py-1.5">
                  <img src={Texticon.src} alt="Text" className="size-3.5 object-contain" />
                  <span className="text-[10px] font-medium text-slate-gray">Text</span>
                </div>
                <div className="flex items-center gap-3 bg-[#EDEDED]/50 rounded-sm px-3 py-1.5">
                  <Hash className="w-3.5 h-3.5 text-dark-gray" />
                  <span className="text-[10px] font-medium text-slate-gray"> Number </span>
                </div>
                <div className="flex items-center gap-3 bg-[#EDEDED]/50 rounded-sm px-3 py-1.5">
                  <img src={SelectorIcon.src} alt="Selector" className="size-3.5 object-contain"/>
                  <span className="text-[10px] font-medium text-slate-gray">Selector</span>
                </div>
              </div>
            </div>
          </FeatureCard>

          {/* Step 2 */}
          <FeatureCard
            variant="secondary"
            title="Choose Analysis Category Type"
            description="Select the analysis type Boolean for yes/no, Text, Number, or Selector for categorization, and configure it in the description."
          >
            <div className="relative z-10 bg-white rounded-lg shadow-md  px-4 w-full max-w-[280px]">
              <div className="flex items-center justify-between mt-3 mb-2 pb-2 border-b">
                <div className="flex items-center gap-2">
                  <img src={Texticon.src} alt="Text" className="w-4 h-4 object-contain"  />
                  <span className="text-slate-gray font-semibold text-sm">
                    Text
                  </span>
                </div>
                <div className="size-4.5 rounded bg-warning flex items-center justify-center">
                  <X className="size-3.5 text-white" strokeWidth="3"/>
                </div>
              </div>

              <div className="mb-2">
                <label className="text-[10px] text-slate-gray mb-1 block tracking-wider ">
                  Name
                </label>
                <div className="bg-[#FAF9FA]/50 border border-gray-200 rounded-sm px-2 py-0.5">
                  <span className="text-[11px] text-slate-gray">Email</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-[9px] text-slate-gray mb-1 block tracking-wider  ">
                  Description
                </label>
                <div className="bg-[#FAF9FA]/50 border border-gray-200 rounded-sm px-2 pt-0.5 min-h-12 relative">
                  <p className="text-[9px] leading-relaxed -ml-1 text-slate-gray font-normal">
                    Extract the customer email
                  </p>
                </div>
              </div>

              <div className="flex gap-1 justify-start mb-2">
                <div className="px-3 bg-slate-gray py-1.5 rounded-2xl text-[8px] font-semibold text-white text-center border border-gray-200/50 cursor-pointer">
                  Cancel
                </div>
                <div className="px-4 bg-warning py-1.5 rounded-2xl text-[8px] font-semibold text-white! text-center cursor-pointer">
                  Save
                </div>
              </div>
            </div>
          </FeatureCard>

          {/* Step 3 */}
          <FeatureCard
            variant="tertiary"
            title="Consume the analysis data" description="After analysis, access results via Dashboard or use webhooks/APIs for integration into workflows or external systems."
          >
            <div className="relative z-10 bg-white rounded-lg shadow-md py-3 px-4 w-full max-w-[280px]">
              <div className="flex items-center justify-between mb-2 pb-2 border-b">
                <div className="flex items-center gap-1">
                  <span className="text-[9px] text-slate-gray font-semibold flex items-center gap-1.5 translate-y-[0.5px]">
                    Use
                    <div className="flex items-center gap-0.5">
                      <div className="bg-gray-200 rounded- w-3 flex items-center justify-center">
                        <MoveUp className="w-2 h-3"/>
                      </div>
                      <div className="bg-gray-200 rounded- w-3 flex items-center justify-center">
                        <MoveDown className="w-2 h-3"/>
                      </div>
                    </div>
                    to navigate
                  </span>
                </div>
                <div className="size-4.5 rounded bg-warning flex items-center justify-center">
                  <X className="size-3.5 text-white" strokeWidth="3"/>
                </div>
              </div>

              <div className="mb-2">
                <p className="text-[10px] text-dark-gray font-bold mb-1">
                  04/01/26, 15:59:36 Phone Call - Inbound
                </p>
                <div className="flex h-6 items-center gap-0.5 overflow-hidden p-2 shadow-md bg-white w-full max-w-24 rounded-xl">
                  {[
                    20, 42, 55, 40, 65, 38, 70, 30, 44, 42, 65, 48, 76, 40,
                    46, 64, 24, 52, 32, 20,
                  ].map((h, i) => (
                    <span
                      key={i}
                      className="w-[2px] flex-shrink-0 rounded-full bg-black translate-x-"
                      style={{
                        height: `${Math.round(h * 0.2)}px`,
                        transformOrigin: "center",
                        animation: `pumpBar 1.2s ease-in-out ${i * 0.05}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="">
                <p className="text-[11px] font-medium text-dark-gray mb-2">
                  Conversation Analysis
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-slate-gray bg-[#EFEFEF] rounded-sm text-[10px] px-2 py-1">
                    <span className="">Call Successful</span>
                    <span className="">Complete</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-gray bg-[#EFEFEF] rounded-sm text-[10px] px-2 py-1 ">
                    <span className="">Call Status</span>
                    <span className="">Ended</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-gray bg-[#EFEFEF] rounded-sm text-[10px] px-2 py-1">
                    <span className="">User Sentiment</span>
                    <span className="">Positive</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-gray bg-[#EFEFEF] rounded-sm text-[10px] px-2 py-1">
                    <span className="">Disconnection Reason</span>
                    <span className="">User hang up</span>
                  </div>
                </div>
              </div>
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
};

export default StepsToAddPostCall;
