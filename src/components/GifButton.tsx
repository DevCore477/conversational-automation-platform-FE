import React from "react";
import Link from "next/link";
import { CirclePlus } from "lucide-react";

type GifButtonProps = {
  label: string;
  icon?: React.ReactNode;
  videoUrl?: string;
  onClick?: () => void;
  href?: string;
  className?: string;
};

const GifButton = React.forwardRef<HTMLButtonElement, GifButtonProps>(
  (
    {
      label,
      icon = <CirclePlus className="size-4 lg:size-5" />,
      videoUrl = "/videos/gif/Setup1.webm",
      onClick,
      href,
      className = "",
      ...props
    },
    ref
  ) => {
    const inner = (
      <>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/webm" />
        </video>

        <div className="relative flex items-center px-2 py-1.5">
          <span className="p-1 rounded-full bg-white text-sm lg:text-base text-text-dark flex items-center justify-center">
            {icon}
          </span>
          <span className="font-medium pl-1 md:pl-2 pr-2 md:pr-3">{label}</span>
        </div>
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          className={`relative overflow-hidden rounded-full  text-white text-sm lg:text-base flex items-center gap-2 ${className}`}
        >
          {inner}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className={`relative overflow-hidden rounded-full text-white text-sm lg:text-base flex items-center gap-2 ${className}`}
        {...props}
      >
        {inner}
      </button>
    );
  }
);

GifButton.displayName = "GifButton";

export default GifButton;