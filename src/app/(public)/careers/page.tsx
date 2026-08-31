import Link from "next/link";

import CareersHero from "../components/sections/CareersHero";
import LazyCareersJobs from "../components/sections/LazyCareersJobs";

const title = "Careers at Hexa AI | Join the AI Voice Automation Team";
const description =
  "Explore career opportunities at Hexa AI. Help us build the future of AI-powered voice agents and WhatsApp automation for businesses worldwide.";
const url = "https://gethexa.ai/careers";
const ogImage = "/og-image.png";

export async function generateMetadata() {
  return {
    title,
    description,
    keywords: [
      "AI careers",
      "voice AI jobs",
      "Hexa AI careers",
      "AI startup jobs",
      "AI voice technology jobs",
      "conversational AI careers",
      "automation platform jobs",
      "AI software engineer jobs",
      "voice automation careers",
      "AI product manager jobs",
      "AI startup career opportunities",
      "machine learning voice jobs",
      "Hexa AI job openings",
      "AI call center jobs",
      "AI startup team careers",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Hexa-AI",
      locale: "en_US",
      url,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

const Careers = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: title,
            description,
            url,
          }),
        }}
      />
      <div>
        <CareersHero/>
        <LazyCareersJobs/>

        {/* Couldn't find your position? Section */}
        <div className="font-dm-sans flex flex-col items-center justify-center gap-6 py-10 lg:py-20">
          <h2 className="text-center text-xl lg:text-2xl 2xl:text-3xl 4xl:text-4xl font-medium text-dark-gray tracking-tight">
            Couldn&apos;t find your position?
          </h2>
          <Link
            href="/careers-submit-resume"
            className="bg-dark-gray text-white px-6 py-2 rounded-lg text-xs 2xl:text-base mt-4 cursor-pointer"
          >
            Send your Resume
          </Link>
        </div>
      </div>
    </>
  );
};

export default Careers;