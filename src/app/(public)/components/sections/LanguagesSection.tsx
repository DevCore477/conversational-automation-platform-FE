"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useVoiceStore } from "@/store/voice.store";
import LanguageCard from "../LanguageCard";
import { Skeleton } from "@/components/ui/skeleton";

const LanguagesSection = ({ searchQuery = "" }: { searchQuery?: string }) => {
  const { voices, fetchVoices, isLoading } = useVoiceStore();

  const [currentlyPlayingKey, setCurrentlyPlayingKey] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(9);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch voices
  useEffect(() => {
    if (voices.length === 0 && !isLoading) {
      fetchVoices().catch(console.error);
    }
  }, [voices.length, isLoading, fetchVoices]);

  // Language name mapping
  const getLanguageDisplayName = (langCode: string, locale = ""): string => {
    const code = langCode.toLowerCase();

    const languageMap: Record<string, string> = {
      en: "English", fr: "French", de: "German", es: "Spanish",
      nl: "Dutch", it: "Italian", pt: "Portuguese", hi: "Hindi",
      ar: "Arabic", zh: "Chinese (Mandarin)", ja: "Japanese",
      fil: "Filipino", cs: "Czech", pl: "Polish", tr: "Turkish",
      ro: "Romanian", sv: "Swedish", sk: "Slovak",
    };

    let name = languageMap[code] || code.toUpperCase();

    if (code === "en") {
      if (locale.includes("GB")) return "British English";
      if (locale.includes("AU")) return "Australian English";
      return "American English";
    }
    if (code === "fil" || locale.includes("PH")) return "Filipino (Philippines)";

    return name;
  };

  // Extract languages
  const languageGroups = useMemo(() => {
    const langMap = new Map<string, any>();

    voices.forEach((voice) => {
      (voice.verified_languages || []).forEach((vl: any) => {
        const langCode = vl.language || "en";
        const key = langCode;

        if (!langMap.has(key)) {
          const displayName = getLanguageDisplayName(langCode, vl.locale || "");
          const previewUrl = vl.preview_url || voice.preview_url || "";

          langMap.set(key, {
            key,
            name: displayName,
            description: `Natural AI voice agent speaking fluently in ${displayName}.`,
            previewUrl,
            voiceId: voice.voice_id,
            flagCode: langCode, 
          });
        }
      });
    });

    let result = Array.from(langMap.values());

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((lang) => lang.name.toLowerCase().includes(q));
    }

    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [voices, searchQuery]);

  const displayedLanguages = languageGroups.slice(0, visibleCount);
  const hasMore = visibleCount < languageGroups.length;

  // Responsive pagination
  useEffect(() => {
    const updateCount = () => setVisibleCount(window.innerWidth < 768 ? 4 : 9);
    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  const loadMore = () => {
    const increment = window.innerWidth < 768 ? 4 : 9;
    setVisibleCount((prev) => Math.min(prev + increment, languageGroups.length));
  };

  // Audio handlers
  const playPreview = (key: string, previewUrl: string) => {
    audioRef.current?.pause();
    if (!previewUrl) return;

    const audio = new Audio(previewUrl);
    audioRef.current = audio;
    audio.onended = audio.onerror = () => setCurrentlyPlayingKey(null);
    audio.play().then(() => setCurrentlyPlayingKey(key)).catch(() => setCurrentlyPlayingKey(null));
  };

  const stopAll = () => {
    audioRef.current?.pause();
    setCurrentlyPlayingKey(null);
  };

  return (
    <div className="relative w-full overflow-hidden">
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

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-10 pb-16 lg:pt-20 lg:pb-28  md:px-16">
        <div className="text-center md:text-left mb-8">
          <h1 className="font-dm-sans text-dark-gray text-2xl lg:text-3xl 2xl:text-4xl 4xl:text-5xl font-semibold mb-2">Languages</h1>
          <p className="font-dm-sans font-light text-base lg:text-lg 2xl:text-xl 4xl:text-2xl text-slate-gray">
            Supports 100+ languages for easy international communication.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="flex  gap-4 rounded-lg border bg-card dark:bg-card-foreground p-4 text-card-foreground shadow-sm">
                <Skeleton className="w-16 h-12 dark:bg-primary" />
                <div className="space-y-3">
                  <Skeleton className="h-6 w-20 xs:w-28 md:w-40 dark:bg-primary" />
                  <Skeleton className="h-8 w-24 xs:w-32 md:w-44 dark:bg-primary" />
                </div>
                  <Skeleton className="size-8 dark:bg-primary" />
              </div>
            ))}
          </div>
        ) : languageGroups.length === 0 ? (
          <div className="text-center py-16 text-slate-gray">
            {searchQuery ? "No matching languages found." : ""}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedLanguages.map((lang) => {
                const isPlaying = currentlyPlayingKey === lang.key;

                return (
                  <LanguageCard
                    key={lang.key}
                    name={lang.name}
                    description={lang.description}
                    previewUrl={lang.previewUrl}
                    voiceId={lang.voiceId}
                    flagCode={lang.flagCode}
                    isPlaying={isPlaying}
                    onPlay={() => playPreview(lang.key, lang.previewUrl)}
                    onStop={stopAll}
                  />
                );
              })}
            </div>

            {hasMore && (
              <div className="mt-10 flex justify-center md:justify-end">
                <button
                  onClick={loadMore}
                  className="font-dm-sans px-8 py-3 rounded-xl shadow-md bg-white text-slate-gray hover:shadow-lg transition text-base lg:text-xl"
                >
                  See More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LanguagesSection;