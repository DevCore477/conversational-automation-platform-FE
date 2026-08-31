"use client";

import { Check, ChevronDown, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface AgentLanguageOption {
  value: string;
  label: string;
  preview_url?: string;
}

function isPlayableHttpUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

interface AgentLanguagePickerProps {
  options: AgentLanguageOption[];
  value: string | undefined;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  emptyLabel?: string;
  /** When this changes (e.g. voice id), preview playback stops. */
  resetPlaybackWhen?: string | null;
}

/**
 * Language choice with ElevenLabs-style preview URLs — Popover list (not Radix Select)
 * so play controls don’t fight item selection. Play on the trigger (current language)
 * and on each row.
 */
export function AgentLanguagePicker({
  options,
  value,
  onValueChange,
  disabled = false,
  placeholder = "Select language",
  emptyLabel = "No languages available",
  resetPlaybackWhen,
}: AgentLanguagePickerProps) {
  const [open, setOpen] = useState(false);
  const [playingFor, setPlayingFor] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    setPlayingFor(null);
  }, [resetPlaybackWhen]);

  useEffect(() => {
    if (!playingFor) {
      audioRef.current?.pause();
      audioRef.current = null;
      return;
    }
    const opt = options.find((o) => o.value === playingFor);
    const url = opt?.preview_url?.trim();
    if (!url || !isPlayableHttpUrl(url)) {
      setPlayingFor(null);
      return;
    }
    const audio = new Audio(url);
    audioRef.current = audio;
    const onEnd = () => setPlayingFor(null);
    audio.addEventListener("ended", onEnd);
    audio.play().catch(() => setPlayingFor(null));
    return () => {
      audio.removeEventListener("ended", onEnd);
      audio.pause();
      audioRef.current = null;
    };
  }, [playingFor, options]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const togglePreview = (langValue: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (playingFor === langValue) {
      setPlayingFor(null);
    } else {
      setPlayingFor(langValue);
    }
  };

  const previewUrlFor = (langValue: string) => {
    const u = options.find((o) => o.value === langValue)?.preview_url?.trim();
    return u && isPlayableHttpUrl(u) ? u : null;
  };

  const showTriggerPreview =
    value && previewUrlFor(value) && !disabled && options.length > 0;

  const noOptions = options.length === 0;

  return (
    <div className="flex w-full min-w-0 items-center gap-2">
      {showTriggerPreview ? (
        <Button
          type="button"
          variant="outline"
          showWave
          size="icon"
          className="h-9 w-9 shrink-0"
          aria-label={
            playingFor === value ? "Stop language preview" : "Play language preview"
          }
          onClick={(e) => value && togglePreview(value, e)}
        >
          {playingFor === value ? (
            <Pause className="size-4 text-white" aria-hidden />
          ) : (
            <Play className="size-4 text-white ml-0.5" aria-hidden />
          )}
        </Button>
      ) : null}

      <div className="min-w-0 flex-1">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild className="bg-surface-soft/9 hover:bg-surface-soft/9">
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              disabled={disabled || noOptions}
              className={cn(
                "h-9 w-full min-w-0 justify-between px-3 font-normal",
                !value && "text-muted-foreground",
              )}
            >
              <span className="truncate text-left">
                {selected?.label ?? (noOptions ? emptyLabel : placeholder)}
              </span>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] min-w-[min(100vw-2rem,24rem)] max-w-[min(100vw-2rem,32rem)] p-0"
            align="start"
          >
          <ScrollArea className="h-[min(260px,42vh)]">
            <div className="space-y-0.5 p-2" role="listbox">
              {options.map((opt) => {
                const isSelected = value === opt.value;
                const rowPreview = previewUrlFor(opt.value);
                const rowPlaying = playingFor === opt.value;
                return (
                  <div
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    className={cn(
                      "flex items-center gap-2 rounded-md border border-transparent px-2 py-2 text-sm",
                      isSelected
                        ? "border-primary/40 bg-primary/10"
                        : "bg-muted/30 hover:bg-muted/60",
                    )}
                  >
                    {rowPreview ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        aria-label={
                          rowPlaying
                            ? "Stop preview"
                            : `Play preview for ${opt.label}`
                        }
                        onClick={(e) => togglePreview(opt.value, e)}
                      >
                        {rowPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4 ml-0.5" />
                        )}
                      </Button>
                    ) : (
                      <span className="w-8 shrink-0" aria-hidden />
                    )}
                    <button
                      type="button"
                      className="min-w-0 flex-1 truncate rounded-sm py-1 text-left font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      onClick={() => {
                        onValueChange(opt.value);
                        setOpen(false);
                        setPlayingFor(null);
                      }}
                    >
                      {opt.label}
                    </button>
                    {isSelected ? (
                      <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                    ) : (
                      <span className="w-4 shrink-0" aria-hidden />
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
