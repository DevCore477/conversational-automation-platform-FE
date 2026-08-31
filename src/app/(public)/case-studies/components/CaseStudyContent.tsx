"use client";

import { type ReactNode } from "react";
import type { StaticImageData } from "next/image";

import CaseStudyHero from "./CaseStudyHero";
import CaseStudyTimeline, { type CaseStudyTimelineImage } from "./CaseStudyTimeline";

import type { CaseStudyHeroImage } from "./case-study.types";

interface CaseStudyContentProps {
  hero: {
    title: string;
    subtitle?: string;
    description: string;
    image?: CaseStudyHeroImage;
  };
  children: ReactNode[];
  images?: CaseStudyTimelineImage[];
}

export default function CaseStudyContent({ hero, children, images }: CaseStudyContentProps) {
  return (
    <>
      <CaseStudyHero
        title={hero.title}
        subtitle={hero.subtitle}
        description={hero.description}
        image={hero.image}
      />
      <CaseStudyTimeline images={images}>
        {children}
      </CaseStudyTimeline>
    </>
  );
}