import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";

export type CaseStudyHeroImage = {
  src: string | StaticImageData;
  alt: string;
  className?: string;
};

export type CaseStudyHeroProps = {
  title: ReactNode;
  subtitle?: string;
  description: string;
  image?: CaseStudyHeroImage;
  children?: ReactNode;
};