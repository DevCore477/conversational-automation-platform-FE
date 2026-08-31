"use client";

import Image, { type StaticImageData } from "next/image";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export interface CaseStudyTimelineImage {
  src: string | StaticImageData | undefined;
  alt: string | undefined;
  position?: "start" | "mid" | "end" | "text-middle";
}

interface CaseStudyTimelineProps {
  children: ReactNode[];
  images?: CaseStudyTimelineImage[];
}

function ImageRow({ image, side }: { image: CaseStudyTimelineImage; side: "left" | "right" }) {

  if (!image.src) {
    return null;
  }

  return (
    <div className="relative">
      <div className={`hidden lg:grid lg:grid-cols-2 gap-12 items-center pt-16`}>
        {side === "left" ? (
          <>
            <div className="flex justify-center lg:pr-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-lg"
              >
                <Image
                  src={image.src}
                  alt={image.alt || ""}
                  width={300}
                  height={200}
                  className="w-full h-auto rounded-xl border border-gray-200"
                />
              </motion.div>
            </div>
            <div />
          </>
        ) : (
          <>
            <div />
            <div className="flex justify-center lg:pl-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-lg"
              >
                <Image
                  src={image.src}
                  alt={image.alt || ""}
                  width={300}
                  height={200}
                  className="w-full h-auto rounded-xl border border-gray-200"
                />
              </motion.div>
            </div>
          </>
        )}
      </div>
      <div className="lg:hidden py-8 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
<Image
                  src={image.src}
                  alt={image.alt || ""}
                  width={300}
                  height={200}
                  className="w-full h-auto rounded-xl border border-gray-200"
                />
        </motion.div>
      </div>
    </div>
  );
}

export default function CaseStudyTimeline({ children, images }: CaseStudyTimelineProps) {
  const rows: ReactNode[] = [];

  children.forEach((child, index) => {
    const isLeft = index % 2 === 0;
    const prevImg = index > 0 ? images?.[index - 1] : undefined;

    let mtClass = "";
    const prevPos = prevImg?.position;
    if (isLeft && prevPos === "mid") mtClass = "lg:-mt-40";
    else if (isLeft && prevPos === "start") mtClass = "lg:-mt-72";
    else if (!isLeft && !prevPos) mtClass = "lg:-mt-8";
    else if (!isLeft && prevPos === "mid") mtClass = "lg:-mt-48";
    else if (!isLeft && prevPos === "start") mtClass = "lg:-mt-80";
    else if (!isLeft && prevPos === "text-middle") mtClass = "lg:-mt-120";


    rows.push(
      <div key={`section-${index}`} className={`relative ${mtClass}`}>
        <div className="hidden lg:flex absolute left-1/2 top-0 -translate-x-1/2 z-10 w-3.5 h-3.5 rounded-full bg-cyan-blue border-2 border-white shrink-0" />
        <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center">
          {isLeft ? (
            <>
              <div className="lg:pr-12">{child}</div>
              <div />
            </>
          ) : (
            <>
              <div />
              <div className="lg:pl-12">{child}</div>
            </>
          )}
        </div>
        <div className="lg:hidden">{child}</div>
      </div>,
    );

    const image = images?.[index];
    if (image && image.src) {
      rows.push(<ImageRow key={`image-${index}`} image={image} side={isLeft ? "left" : "right"} />);
    }
  });

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-16 py-12 lg:py-20">
      <div className="relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-cyan-blue/30 -translate-x-1/2 hidden lg:block" />
        <div className="flex flex-col gap-8 lg:gap-0">
          {rows}
        </div>
      </div>
    </section>
  );
}