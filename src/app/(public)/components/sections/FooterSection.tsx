import Link from "next/link";

import OverlappingFooter from "../OverlappingFooter";
// import { useRouteScroll } from "../ScrollToElement";

export default function FooterSection() {
  // const { routeToSection } = useRouteScroll();
  return (
    <div className="font-dm-sans min-h-screen">
      {/* HERO */}
      <div className="flex flex-col justify-center items-center gap-6 lg:gap-8 4xl:gap-10 py-14 lg:py-20 4xl:py-28">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-16 flex flex-col gap-1 justify-center items-center">
          <h2 className="text-xl lg:text-3xl 4xl:text-4xl font-semibold text-dark-gray max-w-4xl text-center leading-snug">
            Time to Transform
            <span className="bg-gradient-to-r from-bright-red to-cyan-blue bg-clip-text text-transparent">
              {" "}
              Customer Conversations.
            </span>
          </h2>

          <p className="text-sm lg:text-base xl:text-lg 4xl:text-[26px] font-light text-slate-gray max-w-xl text-center">
            Revolutionize your call operation with Hexa Ai.
          </p>
        </div>

        <div className="flex items-center gap-3 lg:gap-4 ">
          <Link
            href="/connect-us"
            className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-[12px] border border-dark-gray bg-text-light px-8 py-2 text-[12px] font-medium text-slate-gray md:text-xs lg:text-sm xl:gap-3 4xl:text-base"
          >
            CONTACT SALES
          </Link>
        </div>
      </div>

      {/* OVERLAPPING SECTION */}
      <OverlappingFooter />
    </div>
  );
}
