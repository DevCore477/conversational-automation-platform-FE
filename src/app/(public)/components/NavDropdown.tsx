"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

import { FeatureVoiceAiBG } from "@/assets";
import {
  USE_CASE_FIRST_COLUMN,
  USE_CASE_SECOND_COLUMN,
} from "@/app/(public)/use-cases/use-case-nav";

interface NavDropdownProps {
  isOpen: boolean;
  onNavigate?: () => void;
}

export default function NavDropdown({ isOpen, onNavigate }: NavDropdownProps) {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<{ title: string; description?: string } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const allOptions = [...USE_CASE_FIRST_COLUMN, ...USE_CASE_SECOND_COLUMN];

  const go = (href: string | null) => {
    if (href) {
      router.push(href);
      onNavigate?.();
    }
  };

  const handleMouseEnter = (option: { title: string; description?: string }) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);

    hoverTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(true); // start fade-out

      transitionTimeoutRef.current = setTimeout(() => {
        setSelectedOption(option); // swap content at opacity: 0
        setIsTransitioning(false); // fade back in
      }, 150); // matches the CSS transition duration
    }, 100);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);

    setIsTransitioning(true);
    transitionTimeoutRef.current = setTimeout(() => {
      setSelectedOption(null);
      setIsTransitioning(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  const displayContent = selectedOption || {
    title: "Artificial Intelligence",
    description: "See how Hexa AI assists with receptionist tasks, streamlining call handling and enhancing guest experience.",
  };

  return (
    <>
      {isOpen && (
        <div className="absolute left-[175%] transform -translate-x-1/2 mt-10 flex justify-between lg:gap-16 bg-white shadow-md rounded-[20px] p-1 z-50">
          <div className="relative lg:h-[300px] 4xl:h-[400px] lg:w-[200px] 4xl:w-[250px] rounded-[20px] overflow-hidden">
            <Image
              src={FeatureVoiceAiBG}
              alt="agent-voice-bg"
              fill
              className="object-cover"
            />

            <div className="absolute top-0 left-0 p-5 flex flex-col justify-between h-full w-full text-white">
              <div  className="flex flex-col"
                style={{
                  transition: "opacity 150ms ease-in-out, transform 150ms ease-in-out",
                  opacity: isTransitioning ? 0 : 1,
                  transform: isTransitioning ? "translateY(4px)" : "translateY(0px)",
                }}
              >
                <p className="font-medium lg:text-base 4xl:text-lg">
                  Artificial Intelligence
                </p>
                <p className="font-semibold lg:text-base 4xl:text-[18px]">
                  {selectedOption ? selectedOption.title : "Receptionist"}
                </p>
              </div>
              <p
                className="font-thin text-xs 4xl:text-sm"
                style={{
                  transition: "opacity 150ms ease-in-out, transform 150ms ease-in-out",
                  opacity: isTransitioning ? 0 : 1,
                  transform: isTransitioning ? "translateY(4px)" : "translateY(0px)",
                }}
              >
                {displayContent.description}
              </p>
            </div>
          </div>
          <div className="flex items-start lg:gap-10 xl:gap-12 py-5 4xl:py-7">
            <div className="flex flex-col lg:gap-4 xl:gap-6 ">
              {USE_CASE_FIRST_COLUMN.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => go(option.href)}
                  onMouseEnter={() => handleMouseEnter(option)}
                  onMouseLeave={handleMouseLeave}
                  disabled={!option.href}
                  className={`group relative text-xs 4xl:text-sm text-start whitespace-nowrap ${
                    selectedOption?.title === option.title
                      ? "text-cyan-blue font-semibold"
                      : option.href
                      ? "text-muted-text hover:text-cyan-blue cursor-pointer"
                      : "text-muted-text/60 cursor-default"
                  }`}
                >
                  {option.title}
                  {option.href ? (
                    <span className={`absolute left-0 bottom-0 h-[2px] bg-cyan-blue transition-all duration-900 ease-in ${
                      selectedOption?.title === option.title ? "w-full" : "w-0 group-hover:w-full"
                    }`} />
                  ) : null}
                </button>
              ))}
            </div>

            <div className="bg-gray-200 h-[200px] w-[1px]" />

            <div className="flex flex-col lg:gap-4 xl:gap-6 mr-36">
              {USE_CASE_SECOND_COLUMN.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => go(option.href)}
                  onMouseEnter={() => handleMouseEnter(option)}
                  onMouseLeave={handleMouseLeave}
                  disabled={!option.href}
                  className={`group relative text-xs 4xl:text-sm text-start whitespace-nowrap ${
                    selectedOption?.title === option.title
                      ? "text-cyan-blue font-semibold"
                      : option.href
                      ? "text-muted-text hover:text-cyan-blue cursor-pointer"
                      : "text-muted-text/60 cursor-default"
                  }`}
                >
                  {option.title}
                  {option.href ? (
                    <span className={`absolute left-0 bottom-0 h-[2px] bg-cyan-blue transition-all duration-900 ease-in ${
                      selectedOption?.title === option.title ? "w-full" : "w-0 group-hover:w-full"
                    }`} />
                  ) : null}
                </button>
              ))}
            </div>
          </div>
          <div className="hidden 2xl:flex relative lg:h-[300px] 4xl:h-[400px] lg:w-[200px] 4xl:w-[250px] rounded-[20px] overflow-hidden"></div>
        </div>
      )}
    </>
  );
}
