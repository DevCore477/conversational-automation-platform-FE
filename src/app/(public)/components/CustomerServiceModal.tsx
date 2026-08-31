"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { ModalDoc } from "@/assets";

export default function CustomerServiceModal({
  phase,
}: {
  phase: "kb" | "cursor" | "customer" | "reset";
}) {
  return (
    <motion.div
      animate={phase === "customer" ? "visible" : "hidden"}
      variants={{
        hidden: {
          scale: 0.9,
          opacity: 0,
        },
        visible: {
          scale: 1,
          opacity: 1,
        },
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="
        absolute
        -top-14 xl:-top-16 2xl:-top-20
        -left-8 xl:-left-4 2xl:left-2
        ml-6
        mt-6
        w-[120px] lg:w-[200px] xl:w-[260px]
        rounded-lg lg:rounded-2xl
        bg-white
        p-2 lg:p-3 xl:p-4
        shadow-2xl
        z-20
        text-muted-text
        flex flex-col gap-1 lg:gap-2 xl:gap-3
      "
    >
      <h3 className="text-[8px] lg:text-base font-semibold bg-gray-100 p-1 lg:p-2 rounded-md lg:rounded-lg xl:rounded-xl">
        Customer Service
      </h3>
      <div className="bg-gray-200 h-[1px]" />

      <div>
        <div className="p-1 xl:p-2 rounded-xl flex items-center gap-1 text-[8px] lg:text-base">
          <Image
            src={ModalDoc}
            className="w-2 lg:w-3 xl:w-5 h-2 lg:h-3 xl:h-5"
            alt="modal-doc"
          />
          Sales Policy
        </div>
        <div className="p-1 xl:p-2 rounded-xl flex items-center gap-1 text-[8px] lg:text-base">
          <Image
            src={ModalDoc}
            className="w-2 lg:w-3 xl:w-5 h-2 lg:h-3 xl:h-5"
            alt="modal-doc"
          />
          Customer Service
        </div>
        <div className="p-1 xl:p-2 rounded-xl flex items-center gap-1 text-[8px] lg:text-base">
          <Image
            src={ModalDoc}
            className="w-2 lg:w-3 xl:w-5 h-2 lg:h-3 xl:h-5"
            alt="modal-doc"
          />
          Leaves Policy
        </div>
      </div>
    </motion.div>
  );
}
