"use client";

interface ImagePreviewProps {
  url?: string;
  alt: string;
  size?: "logo" | "icon";
}

export function ImagePreview({ url, alt, size = "logo" }: ImagePreviewProps) {
  if (!url) {
    return null;
  }

  const sizeClasses =
    size === "icon" ? "h-10 w-10 rounded" : "h-20 max-w-[200px] rounded";

  return (
    <div className="mt-2 flex items-center gap-2">
      <img
        src={url}
        alt={alt}
        className={`${sizeClasses} border bg-white object-contain`}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
  );
}
