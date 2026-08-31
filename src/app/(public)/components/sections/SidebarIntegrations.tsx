"use client";
import { useState, useEffect } from "react";
import { sidebarData, sidebarCategories, type PopularIntegration } from "@/common/constants/sidebarIntegrations";

export default function SidebarIntegrations() {
  const [selectedSidebarTab, setSelectedSidebarTab] = useState<(typeof sidebarCategories)[number]>("Most Popular");
  const [visibleCount, setVisibleCount] = useState(8);

  const currentSidebarData = sidebarData[selectedSidebarTab];
  const currentPopularItems: PopularIntegration[] = currentSidebarData?.integrations || [];

  const visibleItems = currentPopularItems.slice(0, visibleCount);
  const hasMore = visibleCount < currentPopularItems.length;

  // Responsive pagination
  useEffect(() => {
    const updateVisibleCount = () => {
      const isMobile = window.innerWidth < 768;
      setVisibleCount(isMobile ? 4 : 8);
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);

    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const handleSeeMore = () => {
    const increment = window.innerWidth < 768 ? 4 : 8;
    setVisibleCount((prev) => Math.min(prev + increment, currentPopularItems.length));
  };

  const handleTabClick = (tab: (typeof sidebarCategories)[number]) => {
    setSelectedSidebarTab(tab);
    setVisibleCount(8); // Reset pagination on tab change
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-16 py-10 lg:py-20">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-12">
        {/* Sidebar Categories */}
        <div className="lg:col-span-3">
          <h2 className="mb-8 font-dm-sans lg:text-lg xl:text-xl 4xl:text-2xl font-medium text-dark-gray">Categories</h2>
          <div className="flex flex-wrap gap-3 lg:flex-col lg:gap-2">
            {sidebarCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleTabClick(cat)}
                className={`group flex flex-1 lg:flex-none whitespace-nowrap text-slate-gray rounded-xl border px-4 lg:px-6 py-4 text-center justify-center lg:justify-start lg:text-left font-dm-sans text-sm lg:text-base 4xl:text-lg transition-all shadow-cyan-blue/20
                  ${selectedSidebarTab === cat 
                    ? "border-transparent shadow-md " 
                    : "border-slate-gray lg:border-transparent "}`}
              >
                <span className="transition-transform group-hover:translate-x-1">{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Popular Items with Pagination */}
        <div className="lg:col-span-9">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-dm-sans text-xl 4xl:text-2xl font-medium text-dark-gray">
              {selectedSidebarTab}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-2">
            {visibleItems.map((app, index) => (
              <div
                key={index}
                className="group flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md "
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gray-50 transition-colors">
                  {app.img ? (
                    <img 
                      src={app.img.src} 
                      alt={app.name} 
                      className="size-12 object-contain" 
                    />
                  ) : (
                    <div className="size-12 rounded-lg bg-linear-to-br from-cyan-blue to-neon-pink flex items-center justify-center text-white font-bold text-xl">
                      {app.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-dm-sans lg:text-lg xl:text-xl 4xl:text-2xl font-medium text-dark-gray transition-colors">
                    {app.name}
                  </h3>
                  <p className="line-clamp-2 font-dm-sans text-xs md:text-sm 4xl:text-base text-slate-gray">
                    {app.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="mt-10 flex justify-center md:justify-end">
              <button
                onClick={handleSeeMore}
                className="px-10 py-3.5 rounded-2xl shadow-md bg-white text-slate-gray  transition-all font-medium text-base"
              >
                See More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}