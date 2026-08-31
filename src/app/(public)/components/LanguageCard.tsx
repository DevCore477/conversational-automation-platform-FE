"use client";
import React from "react";
import { getFlagSVG } from "@/components/ui/flags";
import { Pause, Play, Volume2,VolumeX, } from "lucide-react";

interface LanguageCardProps {
  name: string;
  description: string;
  previewUrl: string;
  voiceId: string;
  isPlaying: boolean;
  flagCode: string;
  onPlay: () => void;
  onStop: () => void;
}

const LanguageCard: React.FC<LanguageCardProps> = ({
  flagCode,
  name,
  description,
  isPlaying,
  onPlay,
  onStop,
}) => {
  return (
    <div className="font-dm-sans bg-white rounded-2xl shadow-md py-3 px-5 flex justify-start items-start gap-4 transition-all duration-200">
      <div className="drop-shadow-lg ">
        {getFlagSVG(flagCode)}
      </div>
      {/* Content */}
      <div className="flex-1 text-start">
        <h3 className="lg:text-lg 2xl:text-xl 4xl:text-2xl font-medium text-dark-gray ">
          {name}
        </h3>
        <p className="text-xs lg:text-sm 4xl:text-base text-slate-gray">
          {description}
        </p>
      </div>

      {/* Play / Stop Button */}
      <div className="flex items-start pt-2">
        <button
          onClick={isPlaying ? onStop : onPlay}
          className={` flex items-center justify-center rounded-full transition-all ${isPlaying ? "text-cyan-blue" : "text-[#CECECE]"} `}
          aria-label={isPlaying ? "Stop preview" : "Play preview"}
        >
          {/* {isPlaying ? ( <Volume2 /> ) : ( <VolumeX /> )} */}
          {isPlaying ? ( <Pause /> ) : ( <Play /> )}
        </button>
      </div>
    </div>
  );
};

export default LanguageCard;