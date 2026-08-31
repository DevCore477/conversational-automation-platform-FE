"use client";
import Image from "next/image";
import { useState, useMemo } from "react";
import { HexaRGBLogo } from "@/assets";
import SearchInput from "../SearchInput";
import IntegrationCard from "./IntegrationCard";
import { integrationsData, categories, type Integration } from "@/common/constants/integrations";
import CategorySlider from "../CategorySlider";
import Link from "next/link";

export default function Integrations() {
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>("Automation");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category as (typeof categories)[number]);
    setSearchQuery("");
  };

  const currentCategoryData = integrationsData[selectedCategory];
  const allIntegrations: Integration[] = currentCategoryData?.integrations || [];

  const filteredIntegrations = useMemo(() => {
    if (!searchQuery.trim()) return allIntegrations;

    const query = searchQuery.toLowerCase().trim();
    return allIntegrations.filter((app) =>
      app.name.toLowerCase().includes(query)
    );
  }, [allIntegrations, searchQuery]);

  return (
    <>
      {/* Header Section */}
      <div className="font-dm-sans w-full max-w-7xl mx-auto min-h-max flex flex-col items-center justify-center text-center px-6 pt-10 lg:py-20 4xl:py-32 pb-8">
        <Link href="/" className="lg:hidden cursor-pointer mx-auto">
          <Image src={HexaRGBLogo} width={65} height={44} alt="hexa-icon" />
        </Link>
        <div className="w-full max-w-lg mt-4">
          <h1 className="text-dark-gray text-3xl lg:text-4xl 2xl:text-5xl 4xl:text-[52px] font-medium lg:font-semibold mb-2">Integrations</h1>
          <p className="font-light text-s md:text-lg lg:text-lg 2xl:text-xl 4xl:text-2xl text-slate-gray mb-8">
            Build AI agents in seconds to automate workflows, save time, and grow your business.
          </p>
        </div>

        <SearchInput
          placeholder="Search integrations..."
          widthClass="w-11/12 max-w-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <CategorySlider
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

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
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16">
          <div className="mb-10 max-w-2xl text-center lg:text-start">
            <h2 className="mb-2 font-dm-sans text-2xl 2xl:text-4xl 4xl:text-5xl font-semibold text-dark-gray">
              {selectedCategory}
            </h2>
            <p className="font-dm-sans font-light text-slate-gray lg:text-lg 2xl:text-xl 4xl:text-2xl leading-tight">
              {currentCategoryData?.description}
            </p>
          </div>

          {filteredIntegrations.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {filteredIntegrations.map((app, index) => (
                <IntegrationCard key={index} integration={app} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-gray">
              No integrations found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    </>
  );
}