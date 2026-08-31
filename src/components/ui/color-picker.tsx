"use client";

import { cn } from "@/lib/utils";

const PRESET_COLORS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#7c3aed",
  "#ea580c",
  "#0f172a",
  "#64748b",
];

interface ColorPickerProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export function ColorPicker({
  value,
  onChange,
  className,
  disabled = false,
}: ColorPickerProps) {
  return (
    <div
      className={cn("space-y-2", disabled && "pointer-events-none opacity-50")}
    >
      {/* Native color picker */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 border-[1px] rounded-md p-4 bg-surface-soft/9">
        <div className="flex w-auto items-center justify-between gap-2">
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={cn(
            "size-10 p-0.5 border-none bg-transparent rounded-full overflow-hidden",
            "appearance-none",
            "[&::-webkit-color-swatch-wrapper]:py-1.5 ",
            "[&::-webkit-color-swatch-wrapper]:px-0.60 ",
            "[&::-webkit-color-swatch]:rounded-full",
            "[&::-webkit-color-swatch]:border-none",
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
            className
          )}
        />

        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          disabled={disabled}
          className={cn(
            "h-10 w-full max-w-60 px-3 text-sm focus:outline-0",
            disabled && "cursor-not-allowed bg-muted",
          )}
        />
       </div>

      {/* Preset palette */}
      <div className="flex items-start flex-wrap gap-2 ml-1">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            disabled={disabled}
            onClick={() => onChange(color)}
            className={cn(
              "size-4 rounded border transition",
              !disabled && "hover:scale-110",
              value === color && "ring-2 ring-primary ring-offset-2",
              disabled && "cursor-not-allowed",
            )}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      </div>
    </div>
  );
}
