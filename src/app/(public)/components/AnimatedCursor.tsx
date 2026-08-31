"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { Cursor } from "@/assets";
import { useBreakpoint } from "@/hooks/use-breakpoint";

const MotionImage = motion(Image);

export default function AnimatedCursor({
  phase,
}: {
  phase: "kb" | "cursor" | "customer" | "reset";
}) {
  const breakpoint = useBreakpoint();
  if (phase === "kb") {
    return null;
  }
  const Y =
    breakpoint === "sm" || breakpoint === "mobile"
      ? -63
      : breakpoint === "xl"
        ? -120
        : -90;
  const animateX =
    phase === "cursor" || phase === "customer"
      ? breakpoint === "sm" || breakpoint === "mobile"
        ? -5
        : breakpoint === "lg"
          ? -18
          : breakpoint === "xl"
            ? 4
            : 30
      : 300;
  return (
    <MotionImage
      src={Cursor}
      alt="cursor"
      className="w-5 lg:w-6 h-5 lg:h-6 absolute z-50"
      initial={{
        x: 300,
        y: Y,
        opacity: 0,
      }}
      animate={{
        x: animateX,
        y: Y,
        opacity: phase === "reset" ? 0 : 1,
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    />
  );
}
