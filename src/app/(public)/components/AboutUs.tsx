import Image from "next/image";
import { AboutUs, AboutUsBg } from "@/assets";

export default function AboutUsComponent() {
  return (
    <section className="font-dm-sans relative w-full overflow-visible bg-white py-8 4xl:py-12">
      {/* Background GIF */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <Image
          src={AboutUsBg}
          alt=""
          fill
          className="object-cover opacity-30"
        />
      </div>

      {/* Decorative Background - Matching your ConnectForm style */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(153,131,191,0.04)_100%)]"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-16">
        {/* Section Heading - ABOUT (Aligned Right on Desktop) */}
        <div className="mb-8 flex justify-end">
          <h1 className="bg-[linear-gradient(90deg,rgba(14,165,233,0.5)_0%,rgba(238,16,229,0.5)_73.56%)] bg-clip-text text-[60px] font-medium leading-tight text-transparent md:text-[60px] lg:text-[84px] 2xl:text-[100px] 4xl:text-[140px]">
            ABOUT
          </h1>
        </div>

        {/* Hero Image Container */}
        <div className="relative mb-12 w-full overflow-hidden rounded-t-[12px] md:mb-16 md:rounded-t-[16px] lg:mb-24">
          <Image
            src={AboutUs}
            alt="Hexa AI Team and Robots"
            width={1440}
            height={600}
            sizes="(min-width: 1024px) 88vw, 92vw"
            className="h-auto w-full object-cover shadow-sm"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 4xl:gap-24">
          {/* Empty Space for alignment on Desktop (Matches Figma's calc offsets) */}
          <div className="hidden lg:col-span-5 lg:block" />

          {/* Text Content Area */}
          <div className="lg:col-span-7">
            {/* Main Headline */}
            <h2 className="mb-6 font-dm-sans text-xl lg:text-2xl xl:text-3xl 4xl:text-4xl font-medium leading-[1.2] tracking-tighter text-dark-gray">
              AI research and products that transform how we interact with
              technology
            </h2>

            {/* Description Body */}
            <div className="flex flex-col gap-6 font-dm-sans text-[12px] font-light leading-[1.4] tracking-tight text-slate-gray md:text-[12x] lg:text-[16px] 4xl:text-[20px]">
              <p>
                Hexa AI is an AI company transforming how we interact with
                technology. Our goal is seamless communication and creation,
                starting with the first human-like voice model and expanding
                beyond voice.
              </p>

              <div className="flex flex-col gap-4">
                <p className="font-medium text-slate-gray">
                  We offer three platforms:
                </p>
                <ul className="list-none space-y-4">
                  <li>
                    <span className="font-medium text-slate-gray">
                      Hexa Agents:
                    </span>{" "}
                    Enables businesses to deliver intelligent customer
                    experiences with scalable voice and chat agents.
                  </li>
                  <li>
                    <span className="font-medium text-slate-gray">
                      Hexa Creative:
                    </span>{" "}
                    Empowers creators to generate and edit speech, music,
                    images, and videos in over 70 languages.
                  </li>
                  <li>
                    <span className="font-medium text-slate-gray">
                      Hexa API:
                    </span>{" "}
                    Provides developers access to advanced AI audio models.
                  </li>
                </ul>
              </div>

              <p>
                Through The Hexa AI Impact program, we offer free licenses to
                those in need, including individuals with accessibility needs
                and nonprofits in healthcare, education, and culture.
              </p>

              <p>
                AI safety is core to our innovation. Our dedicated team deploys
                comprehensive safeguards to prevent misuse. Our team of
                researchers, engineers, and founders is passionate about
                creating lasting impact. If you&apos;re driven to make a difference,
                we want to hear from you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
