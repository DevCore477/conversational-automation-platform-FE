"use client";
import { useRef, useState, useMemo, useEffect, useCallback } from "react";

type CategorySliderProps = {
  categories: readonly string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
};

export default function CategorySlider({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategorySliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isResetting, setIsResetting] = useState(false);

  // 8 duplicates for smooth infinite scrolling
  const infiniteCategories = useMemo(() => {
    return Array.from({ length: 8 }, () => categories).flat();
  }, [categories]);

  const handleCategoryClick = (category: string) => {
    onCategoryChange(category);
  };

  // Infinite scroll reset logic
  const makeInfinite = useCallback(() => {
    if (!scrollRef.current || isResetting) return;

    const container = scrollRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    const buffer = clientWidth * 1.2;

    setIsResetting(true);

    if (scrollLeft > scrollWidth - clientWidth - buffer) {
      container.scrollTo({ left: scrollWidth / 4, behavior: "instant" });
    } else if (scrollLeft < buffer) {
      container.scrollTo({ left: (scrollWidth / 4) * 2, behavior: "instant" });
    }

    setTimeout(() => setIsResetting(false), 120);
  }, [isResetting]);

  // Scroll event listener
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(makeInfinite);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      container.removeEventListener("scroll", handleScroll);
    };
  }, [makeInfinite]);

  return (
    <div className="relative mx-auto max-w-7xl px-4 md:px-16">
      <div className="group relative mb-2 flex w-full items-center">
        <div
          ref={scrollRef}
          className="no-scrollbar flex w-full gap-4 overflow-x-auto pb-4 px-2 snap-x snap-mandatory"
          style={{ scrollBehavior: "auto" }}
        >
          {infiniteCategories.map((item, index) => (
            <div
              key={`${item}-${index}`}
              onClick={() => handleCategoryClick(item)}
              className={`cursor-pointer whitespace-nowrap rounded-full border px-8 py-3 font-dm-sans text-sm 2xl:text-base 4xl:text-lg font-medium transition-all shadow-sm select-none snap-start shrink-0
                ${
                  selectedCategory === item
                    ? "border-transparent bg-white text-cyan-blue shadow-cyan-blue/30"
                    : "border-transparent bg-white text-slate-gray hover:text-cyan-blue"
                }`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}