"use client";

import Image, { type StaticImageData } from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, ChevronUp, Star, Pause } from "lucide-react";

import { PlayButton } from "@/assets";
import { useBreakpoint } from "@/hooks/use-breakpoint";

import AmplitudeBar from "./AmplitudeBar";

const COLLAPSED_HEIGHT_PX = 80;
const CARD_WIDTH_PX = 420;
const CARD_PADDING_PX = 18;
const CARD_GAP_PX = 12;
const PLAY_BUTTON_SIZE_PX = 44;
const PLAY_ICON_SIZE_PX = 28;

interface VoiceBoxProps {
  name: string;
  completeName: string;
  image?: StaticImageData | null;
  isActive: boolean;
  id: string;
  onClick: () => void;
  previewUrl?: string;
  onVoiceSelect: (voiceId: string) => void;
  description?: string;
  tags?: string[];
  qualities?: string;
  isFavorited?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export default function VoiceBox({
  completeName,
  name,
  image,
  isActive,
  id,
  onClick,
  previewUrl,
  onVoiceSelect,
  description,
  tags = [],
  qualities,
  isFavorited,
  isExpanded: controlledExpanded,
  onToggleExpand,
}: VoiceBoxProps) {
  const breakpoint = useBreakpoint();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [internalExpanded, setInternalExpanded] = useState(false);
  const expanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  useEffect(() => {
    if (previewUrl && !audioRef.current) {
      audioRef.current = new Audio(previewUrl);
      const handleEnded = () => setIsPlaying(false);
      audioRef.current.addEventListener("ended", handleEnded);
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("ended", handleEnded);
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, [previewUrl]);

  useEffect(() => {
    if (!isActive && audioRef.current && isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isActive, isPlaying]);

  const handlePlay = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!audioRef.current || !previewUrl) return;
      try {
        if (isPlaying) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          setIsPlaying(false);
        } else {
          document.querySelectorAll("audio").forEach((audio) => {
            if (audio !== audioRef.current && !audio.paused) {
              audio.pause();
              audio.currentTime = 0;
            }
          });
          audioRef.current.currentTime = 0;
          onClick();
          audioRef.current
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        }
      } catch {
        setIsPlaying(false);
      }
    },
    [isPlaying, onClick, previewUrl],
  );

  useEffect(
    () => () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    },
    [],
  );

  const hasDetails = Boolean(description || tags.length > 0);

  const capitalizeString = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <div
      className="flex flex-col bg-white transition-all overflow-hidden w-full"
      style={{
        maxWidth: CARD_WIDTH_PX,
        width: "100%",
        minHeight: expanded
          ? (description?.length ?? 0) > 100
            ? 260 : (description?.length ?? 0) < 50 && (completeName?.length ?? 0) < 30
            ? 180 : 210
          : COLLAPSED_HEIGHT_PX,
        boxShadow: "0px 4px 4px rgba(14, 165, 233, 0.1)",
        borderRadius: 20,
      }}
    >
      {!expanded ? (
        <div
          className="flex flex-row justify-between items-center cursor-pointer"
          style={{
            padding: CARD_PADDING_PX,
            gap: CARD_GAP_PX,
            minHeight: COLLAPSED_HEIGHT_PX,
          }}
          onClick={() => {
            if (hasDetails) {
              if (onToggleExpand) {
                onToggleExpand();
              } else {
                setInternalExpanded((e) => !e);
              }
            }
          }}
          role={hasDetails ? "button" : undefined}
          aria-expanded={hasDetails ? expanded : undefined}
        >
          {/* Left group: play + gap 12 + (name/qualities column + gap 16 + waveform) */}
          <div
            className="flex flex-row items-center min-w-0 flex-1"
            style={{ gap: CARD_GAP_PX }}
          >
            <button
              onClick={handlePlay}
              className="flex justify-center items-center shrink-0 cursor-pointer"
              style={{
                width: PLAY_BUTTON_SIZE_PX,
                height: PLAY_BUTTON_SIZE_PX,
                borderRadius: 12,
                background: isActive
                  ? "linear-gradient(180deg, #0EA5E9 0%, #0089C7 100%)"
                  : "linear-gradient(180deg, #999999 0%, #333333 100%)",
              }}
              aria-label={isPlaying ? `Pause ${name}` : `Play ${name}`}
            >
              {isPlaying ? (
                <Pause
                  width={PLAY_ICON_SIZE_PX}
                  height={PLAY_ICON_SIZE_PX}
                  className="object-contain text-white"
                />
              ) : (
                <Image
                  src={PlayButton}
                  width={PLAY_ICON_SIZE_PX}
                  height={PLAY_ICON_SIZE_PX}
                  className="object-contain"
                  alt=""
                />
              )}
            </button>
            <div
              className="flex flex-row items-center min-w-[80px] flex-1"
              style={{ gap: 16 }}
            >
              <div className="flex flex-col justify-center items-start min-w-0 max-w-[180px]">
                <div
                  className="flex flex-row items-center flex-wrap w-full min-w-0"
                  style={{ gap: 4 }}
                >
                  <span
                    className="font-medium truncate"
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: 14,
                      lineHeight: "23px",
                      color: "#333333",
                    }}
                  >
                    {name}
                  </span>
                  {isFavorited && (
                    <Star
                      className="shrink-0"
                      style={{
                        width: 17,
                        height: 16,
                        color: "#FFD401",
                        fill: "#FFD401",
                      }}
                    />
                  )}
                </div>
                {qualities && (
                  <span
                    className="truncate block w-full min-w-0"
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontWeight: 500,
                      fontSize: 12,
                      lineHeight: "18px",
                      color: "#6C757D",
                    }}
                    title={qualities}
                  >
                    {qualities}
                  </span>
                )}
              </div>
              <div className="shrink-0" style={{ width: 120, height: 30 }}>
                <AmplitudeBar
                  isPaused={!isActive}
                  noOfAmplitudes={
                    breakpoint === "sm" || breakpoint === "mobile"
                      ? 4
                      : breakpoint === "lg"
                        ? 8
                        : 6
                  }
                  widthClass="w-[3px]"
                />
              </div>
            </div>
          </div>
          {/* Right: avatar + chevron */}
          <div
            className="flex flex-row items-center shrink-0"
            style={{ gap: 12 }}
          >
            {hasDetails &&
              (expanded ? (
                <ChevronUp
                  className="shrink-0 text-[#333333] cursor-pointer"
                  width={16}
                  height={16}
                />
              ) : (
                <ChevronDown
                  className="shrink-0 text-[#333333] cursor-pointer"
                  width={16}
                  height={16}
                />
              ))}
          </div>
        </div>
      ) : (
        <>
          <div
            className="flex flex-row justify-between items-center cursor-pointer"
            style={{
              padding: CARD_PADDING_PX,
              gap: CARD_GAP_PX,
              minHeight: COLLAPSED_HEIGHT_PX,
            }}
            onClick={() => {
              if (hasDetails) {
                if (onToggleExpand) {
                  onToggleExpand();
                } else {
                  setInternalExpanded((e) => !e);
                }
              }
            }}
            role={hasDetails ? "button" : undefined}
            aria-expanded={hasDetails ? expanded : undefined}
          >
            {/* Left group */}
            <div
              className="flex flex-row items-start min-w-0 flex-1"
              style={{ gap: CARD_GAP_PX }}
            >
              {/* Play button - aligned to top */}
              <button
                onClick={handlePlay}
                className="flex justify-center items-center shrink-0 cursor-pointer"
                style={{
                  width: PLAY_BUTTON_SIZE_PX,
                  height: PLAY_BUTTON_SIZE_PX,
                  borderRadius: 12,
                  marginTop: 2, // slight nudge to align with first line of text
                  background: isActive
                    ? "linear-gradient(180deg, #0EA5E9 0%, #0089C7 100%)"
                    : "linear-gradient(180deg, #999999 0%, #333333 100%)",
                }}
                aria-label={isPlaying ? `Pause ${name}` : `Play ${name}`}
              >
                {isPlaying ? (
                  <Pause
                    width={PLAY_ICON_SIZE_PX}
                    height={PLAY_ICON_SIZE_PX}
                    className="object-contain text-white"
                  />
                ) : (
                  <Image
                    src={PlayButton}
                    width={PLAY_ICON_SIZE_PX}
                    height={PLAY_ICON_SIZE_PX}
                    className="object-contain"
                    alt=""
                  />
                )}
              </button>

              {/* Right of play button: all content stacked vertically */}
              <div
                className="flex flex-col items-start min-w-0 flex-1"
                style={{ gap: 6 }}
              >
                {/* Row 1: Name + Star */}
                <div
                  className="grid w-full items-start"
                  style={{
                    gridTemplateColumns: "1fr auto",
                    columnGap: 6,
                  }}
                >
                  <span
                    className="font-medium break-words"
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: 14,
                      lineHeight: "23px",
                      color: "#333333",
                    }}
                  >
                    {completeName}
                  </span>

                  {isFavorited && (
                    <Star
                      className="shrink-0"
                      style={{
                        width: 17,
                        height: 16,
                        color: "#FFD401",
                        fill: "#FFD401",
                        marginTop: 3,
                      }}
                    />
                  )}
                </div>

                {/* Row 2: Description — always visible when expanded */}
                {description && (
                  <p
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: 12,
                      lineHeight: "18px",
                      color: "#6C757D",
                      margin: 0,
                    }}
                  >
                    {description}
                  </p>
                )}

                {/* Row 3: Amplitude bar — only when active */}
                {
                  <div className="shrink-0" style={{ width: 160, height: 40 }}>
                    <AmplitudeBar
                      isPaused={!isActive}
                      noOfAmplitudes={
                        breakpoint === "sm" || breakpoint === "mobile"
                          ? 4
                          : breakpoint === "lg"
                            ? 8
                            : 6
                      }
                      widthClass="w-[3px]"
                    />
                  </div>
                }

                {/* Row 4: Tags — only when expanded */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-2xl px-2.5 py-1.5 text-xs font-medium"
                        style={{
                          background: "#333333",
                          color: "#fff",
                        }}
                      >
                        {capitalizeString(tag)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: chevron — aligned to top */}
            <div
              className="flex flex-row items-start shrink-0"
              style={{ gap: 12, paddingTop: 2 }}
            >
              {hasDetails &&
                (expanded ? (
                  <ChevronUp
                    className="shrink-0 text-[#333333] cursor-pointer"
                    width={16}
                    height={16}
                  />
                ) : (
                  <ChevronDown
                    className="shrink-0 text-[#333333] cursor-pointer"
                    width={16}
                    height={16}
                  />
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export const VOICE_BOX_COLLAPSED_HEIGHT_PX = COLLAPSED_HEIGHT_PX;
export const VOICE_BOX_WIDTH_PX = CARD_WIDTH_PX;