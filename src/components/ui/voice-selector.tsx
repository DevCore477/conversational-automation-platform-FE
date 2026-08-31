"use client";

import { Play, Pause, Volume2, Check, Search, X, Star, ChevronDownIcon } from "lucide-react";
import { useState, useRef, useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { type Voice } from "@/types/voice.types";

interface VoiceSelectorProps {
  voices: Voice[];
  defaultVoiceId?: string | null;
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  showDefault?: boolean;
}

export function VoiceSelector({
  voices,
  defaultVoiceId,
  value,
  onValueChange,
  disabled = false,
  showDefault = true,
}: VoiceSelectorProps) {
  const [open, setOpen] = useState(false);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Find the default voice from the list
  const defaultVoice = useMemo(() => {
    return voices.find((v) => v.voice_id === defaultVoiceId || v.isDefault);
  }, [voices, defaultVoiceId]);

  // Sort voices: default first, then alphabetically
  const sortedVoices = useMemo(() => {
    return [...voices].sort((a, b) => {
      if (a.voice_id === defaultVoiceId || a.isDefault) {
        return -1;
      }
      if (b.voice_id === defaultVoiceId || b.isDefault) {
        return 1;
      }
      return a.name.localeCompare(b.name);
    });
  }, [voices, defaultVoiceId]);

  const handlePlayPreview = (
    e: React.MouseEvent,
    previewUrl: string,
    voiceId: string,
  ) => {
    e.stopPropagation();

    if (playingVoice === voiceId && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlayingVoice(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(previewUrl);
    audioRef.current = audio;

    audio.play().catch((error) => {
      console.error("Failed to play audio:", error);
      setPlayingVoice(null);
    });

    audio.onended = () => {
      setPlayingVoice(null);
      audioRef.current = null;
    };

    setPlayingVoice(voiceId);
  };

  const handleSelectVoice = (voiceId: string) => {
    onValueChange(voiceId);
    setOpen(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlayingVoice(null);
    }
  };

  const filteredVoices = sortedVoices.filter(
    (voice) =>
      voice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.labels.gender?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.labels.accent?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedVoice = voices.find((v) => v.voice_id === value);

  // Display value - show default voice name if selected
  const displayValue = useMemo(() => {
    if (value === "default" || !value) {
      return defaultVoice ? `${defaultVoice.name} (Default)` : "Default Voice";
    }
    return selectedVoice?.name || "Select a voice";
  }, [value, selectedVoice, defaultVoice]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          size="lg"
          aria-expanded={open}
          className="w-full justify-center text-text-dark dark:text-accent-foreground 4xl:text-base bg-surface-soft/9 hover:bg-surface-soft/9 !py-3 !px-6 2xl:!px-5"
          disabled={disabled}
        >
          <div className="flex justify-between w-full items-center">
            <div className="flex items-center gap-2 truncate">
            <Volume2 className="h-4 w-4" />
            <span className="truncate text-sm]">{displayValue}</span>
          </div>
          {selectedVoice && value !== "default" && (
            <Badge variant="secondary" className="ml-2 capitalize text-sm">
              {selectedVoice.labels.gender}
            </Badge>
          )}
          </div>
          <ChevronDownIcon className="size-5 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full max-w-[300px] sm:max-w-[400px] p-0" align="start" onWheel={(e) => e.stopPropagation()}>
        <div className="flex flex-col">
          {/* Search Header */}
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                showLeftBorder={false}
                placeholder="Search voices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-9"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Voice List */}
          <ScrollArea className="h-[180px]">
            <div className="p-2 space-y-1 ">
              {/* Default Voice Option */}
              {showDefault && defaultVoice && (
                <div
                  className={cn(
                    "w-full text-left p-3 rounded-lg border-2 transition-all hover:bg-muted/50 cursor-pointer bg-surface-soft/9",
                    (value === "default" || !value) &&
                      "border-primary ring-2 ring-primary/20",
                  )}
                  onClick={() => handleSelectVoice("default")}
                >
                  <div className="flex items-start gap-3">
                    {/* Play Button for Default */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayPreview(
                          e,
                          defaultVoice.preview_url,
                          defaultVoice.voice_id,
                        );
                      }}
                      className={cn(
                        "h-10 w-10 shrink-0 rounded-md border flex items-center justify-center transition-all cursor-pointer",
                        playingVoice === defaultVoice.voice_id
                          ? "bg-surface-soft/9 text-primary-foreground border-primary"
                          : "hover:bg-primary hover:text-primary-foreground hover:border-primary",
                      )}
                    >
                      {playingVoice === defaultVoice.voice_id ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4 ml-0.5" />
                      )}
                    </div>

                    {/* Default Voice Info */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-warning fill-warning shrink-0" />
                            <h4 className="font-semibold text-sm leading-tight w-full max-w-44">
                              {defaultVoice.name}
                            </h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="default"
                              className="text-xs px-2 py-0 h-5"
                            >
                              Default
                            </Badge>
                            {(value === "default" || !value) && (
                              <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            )}
                          </div>
                        </div>
                       
                      </div>

                      {defaultVoice.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {defaultVoice.description}
                        </p>
                      )}

                      {/* Badges */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {defaultVoice.labels.gender && (
                          <Badge
                            variant="outline"
                            className="text-xs px-2 py-0 h-5 capitalize"
                          >
                            {defaultVoice.labels.gender}
                          </Badge>
                        )}
                        {defaultVoice.labels.accent && (
                          <Badge
                            variant="outline"
                            className="text-xs px-2 py-0 h-5 capitalize"
                          >
                            {defaultVoice.labels.accent}
                          </Badge>
                        )}
                        {defaultVoice.labels.age && (
                          <Badge
                            variant="secondary"
                            className="text-xs px-2 py-0 h-5 capitalize"
                          >
                            {defaultVoice.labels.age.replace(/_/g, " ")}
                          </Badge>
                        )}
                        {defaultVoice.labels.use_case && (
                          <Badge
                            variant="secondary"
                            className="text-xs px-2 py-0 h-5 capitalize"
                          >
                            {defaultVoice.labels.use_case.replace(/_/g, " ")}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Voice Options */}
              {filteredVoices.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No voices found
                </div>
              ) : (
                filteredVoices
                  .filter(
                    (voice) =>
                      voice.voice_id !== defaultVoiceId && !voice.isDefault,
                  )
                  .map((voice) => (
                    <div
                      key={voice.voice_id}
                      className={cn(
                        "w-full text-left p-3 rounded-lg border transition-all hover:bg-muted/50 group cursor-pointer",
                        value === voice.voice_id &&
                          "border-primary bg-primary/5",
                        playingVoice === voice.voice_id &&
                          "ring-2 ring-primary",
                      )}
                      onClick={() => handleSelectVoice(voice.voice_id)}
                    >
                      <div className="flex items-start gap-3">
                        {/* Play Button */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayPreview(
                              e,
                              voice.preview_url,
                              voice.voice_id,
                            );
                          }}
                          className={cn(
                            "h-10 w-10 shrink-0 rounded-md border flex items-center justify-center transition-all cursor-pointer",
                            playingVoice === voice.voice_id
                              ? "bg-primary text-primary-foreground border-primary"
                              : "hover:bg-primary hover:text-primary-foreground hover:border-primary",
                          )}
                        >
                          {playingVoice === voice.voice_id ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4 ml-0.5" />
                          )}
                        </div>

                        {/* Voice Info */}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-sm leading-tight">
                              {voice.name}
                            </h4>
                            {value === voice.voice_id && (
                              <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            )}
                          </div>

                          {voice.description && (
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                              {voice.description}
                            </p>
                          )}

                          {/* Badges */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {voice.labels.gender && (
                              <Badge
                                variant="outline"
                                className="text-xs px-2 py-0 h-5 capitalize"
                              >
                                {voice.labels.gender}
                              </Badge>
                            )}
                            {voice.labels.accent && (
                              <Badge
                                variant="outline"
                                className="text-xs px-2 py-0 h-5 capitalize"
                              >
                                {voice.labels.accent}
                              </Badge>
                            )}
                            {voice.labels.age && (
                              <Badge
                                variant="secondary"
                                className="text-xs px-2 py-0 h-5 capitalize"
                              >
                                {voice.labels.age.replace(/_/g, " ")}
                              </Badge>
                            )}
                            {voice.labels.use_case && (
                              <Badge
                                variant="secondary"
                                className="text-xs px-2 py-0 h-5 capitalize"
                              >
                                {voice.labels.use_case.replace(/_/g, " ")}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-3 border-t bg-muted/30">
            <p className="text-xs text-muted-foreground text-center">
              {filteredVoices.length} voice
              {filteredVoices.length !== 1 ? "s" : ""} available • Click play to
              preview
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
