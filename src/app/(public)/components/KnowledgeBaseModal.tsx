"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { BulbIcon, ModalDoc, PlusIcon } from "@/assets";

export default function KnowledgeBaseModal({
  phase,
}: {
  phase: "kb" | "cursor" | "customer" | "reset";
}) {
  return (
    <motion.div
      animate={
        phase === "kb" || phase === "cursor" || phase === "customer"
          ? "expanded"
          : "collapsed"
      }
      variants={{
        collapsed: {
          scale: 0.1,
          opacity: 0,
        },
        expanded: {
          scale: 1,
          opacity: 1,
        },
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ transformOrigin: "top left" }}
      className="
        absolute
        bottom-0 lg:-bottom-5 2xl:-bottom-10
        -right-2 xl:-right-6 2xl:-right-14
        w-[120px] lg:w-[200px] xl:w-[260px]
        rounded-lg lg:rounded-2xl
        bg-white
        p-2 lg:p-3 xl:p-4
        shadow-xl
        z-10
        text-muted-text
        flex flex-col gap-1 lg:gap-2 xl:gap-3
      "
    >
      <div className="flex items-center justify-between">
        <Image
          src={BulbIcon}
          className="w-3 lg:w-4 xl:w-6 h-3 lg:h-4 xl:h-6 "
          alt="bul-icon"
        />
        <h3 className="text-[8px] lg:text-base font-semibold">
          Knowledge Base
        </h3>
        <div className="p-1 lg:p-2 bg-yellow-400 rounded-md flex items-center justify-center">
          <Image
            src={PlusIcon}
            className="w-2 lg:w-3 xl:w-[14px] h-2 lg:h-3 xl:h-[14px]"
            alt="plus-icon"
          />
        </div>
      </div>

      <div className="bg-gray-200 h-[1px]" />
      <div className="space-y-1 xl:space-y-2">
        <div className="p-1 xl:p-2 bg-gray-100 rounded-md lg:rounded-lg xl:rounded-xl flex items-center gap-1 text-[8px] lg:text-base">
          <Image
            src={ModalDoc}
            className="w-2 lg:w-3 xl:w-5 h-2 lg:h-3 xl:h-5"
            alt="modal-doc"
          />
          Terms & Conditions
        </div>
        <div className="p-1 xl:p-2 rounded-md flex items-center gap-1 text-[8px] lg:text-base">
          <Image
            src={ModalDoc}
            className="w-2 lg:w-3 xl:w-5 h-2 lg:h-3 xl:h-5"
            alt="modal-doc"
          />
          Privacy Policy
        </div>
      </div>
    </motion.div>
  );
}
