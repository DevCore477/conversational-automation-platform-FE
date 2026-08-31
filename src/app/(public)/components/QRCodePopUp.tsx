import Image from "next/image";

import { QRCode, QRCodeTelnyx } from "@/assets";

export default function QRCodePopUp() {
  return (
    <div
      className="
                w-32 lg:w-40 4xl:w-52 h-40 lg:h-48 4xl:h-60 py-2 4xl:py-4 px-2 lg:px-4 4xl:px-7
                flex flex-col items-center justify-center gap-1 lg:gap-3
                rounded-[12px] lg:rounded-[20px]
                bg-white/90
                backdrop-blur-[4px]
                shadow-[0_4px_4px_0_#0EA5E980,0_-4px_4px_0_#0EA5E933]
            "
    >
      <Image
        src={QRCodeTelnyx}
        className="w-[100px] h-[100px] lg:w-[1200px] lg:h-[120px] 4xl:w-[146px] 4xl:h-[146px]"
        alt="qr-code"
      />
      <p className="text-xs 4xl:text-base text-center text-muted-text">
        Scan the QR code to call Hexa AI
      </p>
    </div>
  );
}
