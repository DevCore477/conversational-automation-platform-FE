"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { PhoneIcon } from "@/assets";

import Button from "../Button";
import QRCodePopUp from "../QRCodePopUp";

export default function HeroActions() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);

  const openPopup = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
    }
    setOpen(true);
  };

  const closePopup = () => {
    closeTimer.current = setTimeout(() => {
      setOpen(false);
    }, 500);
  };

  return (
    <div className="mt-6 flex items-center gap-3 lg:mt-10 lg:gap-4">
      <div className="relative">
        <div
          className={`
            absolute -top-42 left-1/3 z-50 -translate-x-1/2
            transition-opacity duration-700 ease-out
            lg:-top-[206px] lg:left-1/4 4xl:-top-64
            ${
              open
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            }
          `}
          onMouseEnter={openPopup}
          onMouseLeave={closePopup}
        >
          <QRCodePopUp />
        </div>

        <div onMouseEnter={openPopup} onMouseLeave={closePopup}>
          <Button
            text="CALL GAIA"
            backgroundColor="bg-dark-gray"
            borderColor="border-dark-gray"
            textColor="text-text-light"
            icon={{ image: PhoneIcon, alt: "phone-icon" }}
            onClick={() => {}}
          />
        </div>
      </div>

      <Link
        href="/login"
        className="
          flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-[12px]
          border border-dark-gray bg-text-light px-8 py-2 text-[12px]
          font-medium text-slate-gray md:text-xs lg:text-sm xl:gap-3 4xl:text-base
        "
      >
        TRY FOR FREE
      </Link>
    </div>
  );
}
