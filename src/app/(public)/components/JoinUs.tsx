import Image from "next/image";
import Link from "next/link";

import { JoinUs } from "@/assets";

export default function JoinUsComponent() {
  return (
    <section className="font-dm-sans relative w-full bg-white py-16 md:py-24 lg:py-32 4xl:py-40">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24 4xl:gap-32">
          
          {/* Left Side: Content (Order 2 on Mobile) */}
          <div className="order-2 flex flex-col items-start lg:order-1">
            <h2 className="mb-4 font-dm-sans text-xl lg:text-2xl xl:text-3xl 4xl:text-4xl font-medium leading-[1.2] tracking-tighter text-dark-gray">
              Join us to shape the future of human-technology interaction
            </h2>
            
            <p className="mb-8 font-dm-sans text-[12px] font-light leading-[1.4] tracking-tight text-slate-gray md:text-[12px] lg:text-[16px] 4xl:text-[24px]">
              We are always looking for talented and driven minds from diverse 
              backgrounds to join our team.
            </p>

            <div>
              <Link
                href="/careers"
                className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-[12px] border border-dark-gray bg-dark-gray px-5 py-2 text-[12px] font-medium text-white md:text-xs lg:text-sm xl:gap-3 4xl:text-base"
              >
                See Openings
              </Link>
            </div>
          </div>

          {/* Right Side: Group Image Asset (Order 1 on Mobile) */}
          <div className="order-1 flex justify-center lg:order-2">
            <div className="w-full max-w-[380px] lg:max-w-[704px]">
              <Image
                src={JoinUs}
                alt="Our Team"
                className="h-auto w-full object-contain"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}