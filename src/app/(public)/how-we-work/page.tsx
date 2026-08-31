import HowWeWork from "../components/HowWeWork";
import FAQSection from "../components/sections/FAQSection";

const title = "How We Work | AI Voice Automation & Omnichannel Platform | Hexa-AI";
const description =
  "Our proven process for AI agent deployment: Discovery, Scope, Build, Launch, and Ongoing Support. Transparent pricing, weekly demos, full code ownership.";
const url = "https://gethexa.ai/how-we-work";
const ogImage = "/og-image.png";

export async function generateMetadata() {
  return {
    title,
    description,
    keywords: [
      "AI development process",
      "AI deployment workflow",
      "AI consulting",
      "how we work",
      "Hexa AI process",
      "AI agent deployment process",
      "AI project consultation",
      "voice automation development",
      "custom AI solution development",
      "AI voice agent implementation",
      "AI project lifecycle",
      "discovery to deployment AI",
      "AI development methodology",
      "voice agent deployment guide",
      "AI automation consulting",
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

export default function HowWeWorkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: title,
            description,
            url,
          }),
        }}
      />
      <HowWeWork />
    </>
  );
}
