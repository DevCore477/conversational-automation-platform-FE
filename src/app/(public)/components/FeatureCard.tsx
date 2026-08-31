// components/FeatureCard.tsx
import { ReactNode } from "react";

type GradientVariant = "primary" | "secondary" | "tertiary" | "quaternary" | "quinary";

interface FeatureCardProps {
  /** The gradient variant for the mockup container */
  variant?: GradientVariant;
  /** The inner mockup content */
  children: ReactNode;
  /** The title/heading of the card */
  title: string;
  /** The description text */
  description: string | string[];
  /** Optional className for additional styling */
  className?: string;
}

const gradientMap: Record<GradientVariant, string> = {
  primary: "bg-gradient-to-b from-[#fd02cf] via-[#0bdef1] to-[#07247f]",
  secondary: "bg-linear-to-bl from-[#eed9fc] via-[#FEE2E2] to-[#ffc2db]",
  tertiary: "bg-linear-to-bl from-[#aab5ff] to-[#97fafe]",
  quaternary: "bg-gradient-to-b from-[#fd02cf] via-[#0bdef1] to-[#07247f]",
  quinary: "bg-gradient-to-bl from-[#eed9fc] via-[#FEE2E2] to-[#ffc2db]",
};

const overlayMap: Record<GradientVariant, string> = {
  primary: "bg-white/75",
  secondary: "bg-white/20",
  tertiary: "bg-white/60",
  quaternary: "bg-black/40",
  quinary: "bg-black/25",
};

const FeatureCard = ({
  variant = "primary",
  children,
  title,
  description,
  className = "",
}: FeatureCardProps) => {
  const gradientClass = gradientMap[variant];
  const overlayClass = overlayMap[variant];

  const descriptionArray = Array.isArray(description) ? description : [description];

  return (
    <div
      className={`bg-white p-4 lg:p-5 rounded-2xl shadow-md shadow-cyan-blue/20 flex flex-col items-center text-center md:items-start md:text-left ${className}`}
    >
      <div
        className={`relative mb-6 flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl ${gradientClass} p-6`}
      >
        {/* Optional overlay for better contrast with darker backgrounds */}
        <div className={`absolute inset-0 rounded-2xl ${overlayClass}`} />

        <div className="relative z-10 flex w-full flex-col items-center">
          {children}
        </div>
      </div>
      <h3 className="font-dm-sans text-lg 2xl:text-xl 4xl:text-2xl lg:mb-1 font-medium text-dark-gray">
        {title}
      </h3>
      {descriptionArray.map((text, index) => (
        <p
          key={index}
          className={`font-dm-sans text-xs lg:text-sm 4xl:text-lg leading-tight text-slate-gray  ${
            index < descriptionArray.length - 1 ? "mb-2" : ""
          }`}
        >
          {text}
        </p>
      ))}
    </div>
  );
};

export default FeatureCard;