import type { ReactNode } from "react";
import type { StaticImageData } from "next/image";

export type UseCaseHeroImage = {
  src: string | StaticImageData;
  alt: string;
  /** e.g. scale-x-[-1] mix-blend-multiply */
  className?: string;
};

export type UseCaseBenefitItem = {
  icon: ReactNode;
  label: string;
};

export type UseCaseHeroProps = {
  /** Full control: gradient spans + plain text */
  title: ReactNode;
  description: string;
  /** Omit for centered hero (e.g. receptionist-style) */
  image?: UseCaseHeroImage;
  /** Optional CTAs below description */
  children?: ReactNode;
  showAmplitude?: boolean;
};

export type UseCaseBenefitsProps = {
  title: string;
  items: UseCaseBenefitItem[];
};

export type UseCaseTestimonial = {
  id: number;
  quote: string;
  name: string;
  role: string;
  image: StaticImageData;
};
