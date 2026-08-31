"use client";
import { type StaticImageData } from "next/image";
import { useEffect, useState, useMemo } from "react";

import { Voice1, Voice2, Voice3, Voice4 } from "@/assets";
import { departmentScripts } from "@/common/constants/department-scripts";
import { useVoiceStore } from "@/store/voice.store";
import { type Voice } from "@/types/voice.types";

import DetailForm from "../DetailForm";
import VoiceBox, { VOICE_BOX_COLLAPSED_HEIGHT_PX } from "../VoiceBox";

import DepartmentBox from "./DepartmentBox";

/** 5 collapsed cards visible = 4*80 + 4*20 = 400 */
const CARD_GAP_PX = 20;
const scrollContainerHeight =
  4 * VOICE_BOX_COLLAPSED_HEIGHT_PX + 4 * CARD_GAP_PX;

export interface DemoVoice {
  id: string;
  completeName: string;
  name: string;
  image?: StaticImageData | null;
  previewUrl: string;
  description?: string;
  tags: string[];
  qualities?: string;
  isFavorited?: boolean;
  originalVoice?: Voice;
}

function getTagsFromVoice(voice: Voice): string[] {
  const labels = voice.labels || {};
  const tags: string[] = [];
  if (labels.gender) tags.push(labels.gender);
  if (labels.accent) tags.push(labels.accent);
  if (labels.age) tags.push(labels.age);
  if (labels.language) tags.push(labels.language);
  if (labels.use_case) tags.push(labels.use_case);
  return tags;
}

/**
 * API may return name as "Roger - Laid-Back, Casual, Resonant".
 * Name is before " - ", qualities/tags line is after " - ".
 */
function parseVoiceName(fullName: string): { name: string; qualities?: string } {
  const sep = " - ";
  const i = fullName.indexOf(sep);
  if (i === -1) {
    return { name: fullName.trim() };
  }
  return {
    name: fullName.slice(0, i).trim(),
    qualities: fullName.slice(i + sep.length).trim() || undefined,
  };
}

/** Map all ElevenLabs voices to demo format with description, tags, qualities */
export function extractVoicesForDemo(voices: Voice[]): DemoVoice[] {
  const placeholderImages: (StaticImageData | null)[] = [
    Voice1,
    Voice2,
    Voice3,
    Voice4,
    null,
  ];
  return voices.map((voice, index) => {
    const { name: displayName, qualities: nameQualities } = parseVoiceName(
      voice.name,
    );
    return {
      id: voice.voice_id,
      completeName: voice.name,
      name: displayName,
      image: placeholderImages[index % placeholderImages.length],
      previewUrl: voice.preview_url || "",
      description: voice.description || undefined,
      tags: getTagsFromVoice(voice),
      qualities: nameQualities || voice.labels?.descriptive || undefined,
      isFavorited: Boolean(voice.favorited_at_unix),
      originalVoice: voice,
    };
  });
}

export default function DemoSection() {
  const [departmentSelected, setDepartmentSelcted] = useState("Receptionist");
  const [voiceSelected, setVoiceSelected] = useState<string | null>(null);
  const [persistedVoiceId, setPersistedVoiceId] = useState<string | null>(null);
  const [expandedVoiceId, setExpandedVoiceId] = useState<string | null>(null);
  const {
    voices,
    defaultVoiceId,
    fetchVoices,
    isLoading: voicesLoading,
  } = useVoiceStore();
  const DEPARTMENTS = departmentScripts;

  const demoVoices = useMemo(
    () => (voices.length > 0 ? extractVoicesForDemo(voices) : []),
    [voices],
  );

  // Fetch voices on mount
  useEffect(() => {
    if (voices.length === 0 && !voicesLoading) {
      fetchVoices().catch(() => {
        // Silently fail, voices are optional
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Default selection to first voice when voices load
  useEffect(() => {
    if (
      demoVoices.length > 0 &&
      voiceSelected === null &&
      persistedVoiceId === null
    ) {
      const firstId = demoVoices[0].id;
      setVoiceSelected(firstId);
      setPersistedVoiceId(firstId);
    }
  }, [demoVoices, voiceSelected, persistedVoiceId]);

  // Handle voice selection change
  const handleVoiceSelect = (voiceId: string) => {
    // If the same voice is selected again, deselect it
    if (voiceId === voiceSelected) {
      setVoiceSelected(null);
      setPersistedVoiceId(null); // Reset persisted voice if the same voice is deselected
    } else {
      setVoiceSelected(voiceId);
      setPersistedVoiceId(voiceId); // Store voice ID persistently
    }
  };

  // Get the script for the selected department
  const selectedDepartmentScript = DEPARTMENTS.find(
    (department) => department.title === departmentSelected,
  )?.script;

  // If no voice is selected, default to the persisted voice ID or first voice's ID
  const selectedVoiceId = persistedVoiceId || demoVoices[0]?.id;

  return (
    <div className="flex min-h-screen bg-soft-periwinkle py-12 lg:py-16 xl:py-20 " id="demo-section">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-16 flex flex-col items-center justify-center gap-7 lg:gap-16 xl:gap-24">
        <div className="flex flex-col gap-1">
          <h2 className="w-full text-center mx-auto max-w-[400px] text-2xl xl:text-3xl 4xl:text-[36px] font-semibold text-text-dark leading-snug lg:max-w-2xl 4xl:max-w-4xl tracking-tight mb-8 drop-shadow-[0_4px_4px_rgba(14,165,233,0.25)]">
            Try Our Live Demo
          </h2>
          <p className="font-light text-muted-text text-xs lg:text-sm 4xl:text-base text-start md:text-center">
            Discover how our AI caller transforms customer conversations.
          </p>
        </div>
        <div className="w-full flex lg:hidden xl:flex flex-col xl:grid xl:grid-cols-[1fr_auto_1fr] xl:items-start xl:gap-x-8 xl:gap-y-0 gap-6">
          {/* Select Department - row 1 */}
          <div className="flex flex-col gap-2 xl:gap-5 4xl:gap-10 items-start w-full min-w-0">
            <p className="font-semibold text-sm 2xl:text-base 4xl:text-[28px] text-text-dark min-h-[2rem] flex items-center">
              Select Department
            </p>
            <div className="grid grid-cols-2 xs:grid-cols-2 md:grid-cols-2 gap-3 xl:gap-5 w-full min-w-0">
              {DEPARTMENTS.map((department, index) => (
                <DepartmentBox
                  key={index}
                  title={department.title}
                  index={index}
                  onClick={() => setDepartmentSelcted(department.title)}
                  isActive={department.title === departmentSelected}
                />
              ))}
            </div>
          </div>
          {/* Choose Voice - row 2 in grid, same row as Select Department content */}
          <div className="flex flex-col gap-5 items-start w-full min-w-0 max-w-full xl:max-w-[450px]">
            <p className="font-semibold text-sm 2xl:text-base 4xl:text-[28px] text-text-dark min-h-[2rem] flex items-center">
              Choose Voice
            </p>
            <div
              className="voice-list-scroll flex flex-col overflow-y-auto w-full min-w-0 pr-1"
              style={{
                maxWidth: "100%",
                width: "100%",
                maxHeight: scrollContainerHeight,
                gap: CARD_GAP_PX,
                scrollbarGutter: "stable",
              }}
            >
              {voicesLoading ? (
                <p
                  className="py-4"
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: 14,
                    color: "#6C757D",
                  }}
                >
                  Loading voices...
                </p>
              ) : demoVoices.length === 0 ? (
                <p
                  className="py-4"
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: 14,
                    color: "#6C757D",
                  }}
                >
                  No voices available
                </p>
              ) : (
                demoVoices.map((voice) => (
                  <VoiceBox
                    key={voice.id}
                    completeName={voice.completeName}
                    name={voice.name}
                    id={voice.id}
                    image={voice.image}
                    isActive={voice.id === voiceSelected}
                    onClick={() => handleVoiceSelect(voice.id)}
                    previewUrl={voice.previewUrl}
                    onVoiceSelect={setPersistedVoiceId}
                    description={voice.description}
                    tags={voice.tags}
                    qualities={voice.qualities}
                    isFavorited={voice.isFavorited}
                    isExpanded={expandedVoiceId === voice.id}
                    onToggleExpand={() =>
                      setExpandedVoiceId((prev) =>
                        prev === voice.id ? null : voice.id
                      )
                    }
                  />
                ))
              )}
            </div>
          </div>
          <div className="min-w-0 xl:flex xl:items-start">
            <DetailForm
              script={selectedDepartmentScript || ""}
              voiceId={selectedVoiceId || ""}
            />
          </div>
        </div>
        <div className="w-full hidden lg:grid xl:hidden grid-cols-2 items-start gap-6 gap-y-12">
          <div className="flex flex-col gap-5 items-start min-w-0">
            <p className="font-semibold text-base text-text-dark min-h-[2rem] flex items-center">
              Select Department
            </p>
            <div className="grid grid-cols-2 gap-3">
              {DEPARTMENTS.map((department, index) => (
                <DepartmentBox
                  key={index}
                  index={index}
                  title={department.title}
                  onClick={() => setDepartmentSelcted(department.title)}
                  isActive={department.title === departmentSelected}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-5 items-start min-w-0 max-w-full">
            <p className="font-semibold text-sm text-text-dark min-h-[2rem] flex items-center">
              Choose Voice
            </p>
            <div
              className="voice-list-scroll flex flex-col overflow-y-auto w-full min-w-0 pr-1"
              style={{
                maxWidth: "100%",
                maxHeight: scrollContainerHeight,
                gap: CARD_GAP_PX,
                scrollbarGutter: "stable",
              }}
            >
              {voicesLoading ? (
                <p
                  className="py-4"
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: 14,
                    color: "#6C757D",
                  }}
                >
                  Loading voices...
                </p>
              ) : demoVoices.length === 0 ? (
                <p
                  className="py-4"
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: 14,
                    color: "#6C757D",
                  }}
                >
                  No voices available
                </p>
              ) : (
                demoVoices.map((voice) => (
                  <VoiceBox
                    key={voice.id}
                    completeName={voice.completeName}
                    name={voice.name}
                    image={voice.image}
                    id={voice.id}
                    isActive={voice.id === voiceSelected}
                    onClick={() => handleVoiceSelect(voice.id)}
                    previewUrl={voice.previewUrl}
                    onVoiceSelect={setPersistedVoiceId}
                    description={voice.description}
                    tags={voice.tags}
                    qualities={voice.qualities}
                    isFavorited={voice.isFavorited}
                    isExpanded={expandedVoiceId === voice.id}
                    onToggleExpand={() =>
                      setExpandedVoiceId((prev) =>
                        prev === voice.id ? null : voice.id
                      )
                    }
                  />
                ))
              )}
            </div>
          </div>
          <div className="flex justify-center">
            <DetailForm
              script={selectedDepartmentScript || ""}
              voiceId={selectedVoiceId || ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
