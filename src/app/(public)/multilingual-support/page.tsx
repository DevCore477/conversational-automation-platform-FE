import Image from "next/image";
import Link from "next/link";
import { HexaRGBLogo } from "@/assets";
import MultilingualSearchSection from "../components/MultilingualSearchSection";

const title = "Multilingual AI Voice Agent | 100+ Languages Supported | Hexa AI";
const description =
  "Deploy AI voice agents in 100+ languages. Hexa AI supports multilingual calls, global phone numbers, and cross-border communication for businesses worldwide.";
const url = "https://gethexa.ai/multilingual-support";
const ogImage = "/og-image.png";

export async function generateMetadata() {
  return {
    title,
    description,
    keywords: [
      "multilingual AI voice",
      "AI voice agent languages",
      "multilingual call center",
      "global AI calling",
      "AI voice agent multiple languages",
      "international AI calling",
      "voice agent language support",
      "multilingual business calls",
      "global phone number AI",
      "AI cross-border calling",
      "language support AI calling",
      "AI multilingual communication",
      "worldwide AI phone agent",
      "call center language translation AI",
      "voice bot language capabilities",
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

const Multilingual = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Hexa-AI Multilingual Voice Agent",
            description,
            url,
          }),
        }}
      />
      <div className="min-h-max flex flex-col items-center justify-center text-center px-8 pt-10 lg:pt-20 4xl:pt-32  md:px-16">
        <Link href="/" className="cursor-pointer mb-1">
          <Image src={HexaRGBLogo} width={60} height={40} alt="Hexa Logo" />
        </Link>
        <div className="w-full max-w-xl mx-auto mt-3">
          <h1 className="font-dm-sans text-dark-gray text-3xl lg:text-4xl 2xl:text-5xl 4xl:text-[52px] font-medium lg:font-semibold mb-2">
            Multilingual Support
          </h1>
          <p className="font-dm-sans font-light md:text-lg lg:text-xl 2xl:text-xl text-slate-gray max-w-xl mb-8">
            Support 100+ languages, can dial to any countries phone numbers.
          </p>
        </div>
      </div>
      <MultilingualSearchSection />
    </>
  );
};

export default Multilingual;