"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import {
  Person1,
  Person2,
  Person3,
  Person4,
  Person5,
  PhoneIconBlack,
} from "@/assets";

export default function ScalablePhoneAnimation() {
  const phoneCalls = [5, 30, 80, 130, 45];
  const images = [Person1, Person2, Person3, Person4, Person5];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className="flex"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Cards */}
      <div className="relative z-10 flex flex-col gap-3">
        {phoneCalls.map((phoneCall, index) => (
          <motion.div
            key={index}
            className="w-[80px] lg:w-[100px] flex items-center gap-3 py-[6px] xl:py-[10px] px-[8px] xl:px-[14px] bg-white rounded-[12px] shadow"
            variants={itemVariants}
          >
            <Image
              src={PhoneIconBlack}
              className="w-4 xl:w-6 h-4 xl:h-6"
              alt="phone-call"
            />
            <p className="font-semibold text-sm lg:text-base xl:text-lg text-text-dark">
              {phoneCall}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Dotted fan-out lines (from index 0) */}
      <svg
        className="ml-2 h-full w-[140px] lg:w-[160px] xl:w-[200px] pointer-events-none"
        viewBox="0 0 200 200"
        preserveAspectRatio="none"
      >
        {phoneCalls.map((_, i) => (
          <motion.line
            key={i}
            x1="0"
            y1="20"
            x2="1000"
            y2={-30 + i * 200}
            stroke="#ffffff"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.7"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.7 }}
            transition={{
              duration: 1,
              delay: 0.5 + i * 0.1,
              ease: "easeOut",
            }}
          />
        ))}
      </svg>

      <div className="relative z-10 flex flex-col gap-[1px]">
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-[1px]"
            variants={itemVariants}
          >
            <Image
              src={image}
              className="w-[22px] lg:w-[26px] xl:w-[33px] 2xl:w-[32px] h-[22px] lg:h-[26px] xl:h-[33px] 2xl:h-[32px]"
              alt="person-image"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
