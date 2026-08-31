"use client";
import React, { useState } from "react";

const LegalTabs = ({ tabsData, defaultTab = 0 }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 md:px-16 pb-12 md:py-8 lg:pb-32">
      <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-3 gap-6">

        {/* LEFT TABS */}
        <div className="md:col-span-2 lg:col-span-1 space-y-2 h-[400px] overflow-y-auto hide-scrollbar p-2" >

          {tabsData.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`font-dm-sans 4xl:text-xl relative w-full max-w-88 text-left px-4 py-2 text-dark-gray rounded-lg transition-all duration-200 
                ${ activeTab === index ? "bg-white shadow-md shadow-blue-200 pl-8 py-3.5" : "" }`}
            >
              {activeTab === index && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-[5px] rounded-full bg-cyan-blue" />
              )}
              {tab.title}
            </button>
          ))}
        </div>

        {/* RIGHT CONTENT */}
        <div className="md:col-span-3 lg:col-span-2">
          <div className="font-dm-sans bg-white border border-cyan-blue text-slate-gray rounded-xl p-6  h-[500px] overflow-y-auto hide-scrollbar" >
            
            {tabsData[activeTab].content}
          </div>
        </div>

        <style>
          {`
            .hide-scrollbar::-webkit-scrollbar { display: none;}
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}
        </style>
      </div>
    </div>
  );
};

export default LegalTabs;