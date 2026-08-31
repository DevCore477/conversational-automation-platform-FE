"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface CaseStudyTimelineSectionProps {
  title: string;
  side: "left" | "right";
  children: ReactNode;
}

export default function CaseStudyTimelineSection({
  title,
  side,
  children,
}: CaseStudyTimelineSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col gap-3"
    >
      <div className="flex items-center gap-3">
        <h3 className="font-semibold text-lg lg:text-xl text-dark-gray">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}