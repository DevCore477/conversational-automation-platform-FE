import Image, { type StaticImageData } from "next/image";

interface ButtonProps {
  text: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  icon?: {
    image: StaticImageData;
    alt: string;
  };
  onClick: () => void;
  widthClass?: string;
  isLeft?: boolean;
  disabled?: boolean;
}

export default function Button({
  text,
  backgroundColor,
  textColor,
  borderColor,
  icon,
  onClick,
  widthClass = "w-full px-8 py-2",
  isLeft = true,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${widthClass}
        flex items-center justify-center gap-2 xl:gap-3
        py-2 px-3
        ${backgroundColor}
        ${borderColor}
        ${textColor}
        border
        rounded-[12px]
        font-medium text-[12px] md:text-xs lg:text-sm 4xl:text-base
        cursor-pointer
        whitespace-nowrap
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {/* Icon on LEFT */}
      {icon && isLeft && (
        <Image
          src={icon.image}
          className="w-3 lg:w-5 h-3 lg:h-5"
          alt={icon.alt}
        />
      )}

      {text}

      {/* Icon on RIGHT */}
      {icon && !isLeft && (
        <Image
          src={icon.image}
          className="w-3 lg:w-5 h-3 lg:h-5"
          alt={icon.alt}
        />
      )}
    </button>
  );
}
