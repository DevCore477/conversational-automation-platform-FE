import { cn } from "@/lib/utils";

interface WaveBackgroundProps {
  className?: string;
  waveColor?: string;
  opacity?: number;
}

const hexToHue = (hex: string): number => {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let hue = 0;

  if (delta !== 0) {
    if (max === r) {
      hue = ((g - b) / delta) % 6;
    } else if (max === g) {
      hue = (b - r) / delta + 2;
    } else {
      hue = (r - g) / delta + 4;
    }
    hue = Math.round(hue * 60);
    if (hue < 0) {
      hue += 360;
    }
  }

  return hue;
};

const isColorful = (hex: string): boolean => {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return r !== g || g !== b;
};

const getHueRotate = (targetColor: string | undefined): string => {
  if (!targetColor) {
    return "0deg";
  }

  const BASE_HUE = 270;

  const lower = targetColor.toLowerCase();
  if (lower === "#000000" || lower === "#000") {
    return "0deg";
  }
  if (lower === "#ffffff" || lower === "#fff") {
    return "0deg";
  }

  const targetHue = hexToHue(targetColor);
  if (targetHue === 0 && !isColorful(targetColor)) {
    return "0deg";
  }

  let rotation = targetHue - BASE_HUE;
  if (rotation > 180) {
    rotation -= 360;
  }
  if (rotation < -180) {
    rotation += 360;
  }

  return `${rotation}deg`;
};

export function WaveBackground({
  className,
  waveColor,
  opacity = 0.4,
}: WaveBackgroundProps) {
  return (
    <div className={cn("absolute inset-0", className)}>
      <div className="absolute inset-0 bg-gradient-to-br dark:from-primary/90 dark:to-primary/70" />
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full"
        style={{
          objectFit: "cover",
          objectPosition: "center 30%",
          opacity,
          filter: `hue-rotate(${getHueRotate(waveColor)}) saturate(1.4)`,
        }}
      >
        <source src="/wave-bg.webm" type="video/webm" />
      </video>
    </div>
  );
}
