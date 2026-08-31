import AboutUsComponent from "../components/AboutUs";
import JoinUsComponent from "../components/JoinUs";

const title = "About Us | AI Voice Automation & Omnichannel Platform | Hexa-AI";
const description =
  "Meet Hexa-AI. We empower enterprises with human-like AI voice agents, custom call script workflows, and official Meta WhatsApp marketing to scale outreach.";
const url = "https://gethexa.ai/about-us";
const ogImage = "/og-image.png";

export async function generateMetadata() {
  return {
    title,
    description,
    keywords: [
      "AI voice platform",
      "AI calling company",
      "Hexa AI team",
      "voice AI automation",
      "best AI calling platform",
      "AI voice technology company",
      "automated calling solution provider",
      "Hexa AI about us",
      "voice agent developer",
      "AI communication platform",
      "WhatsApp automation company",
      "business AI voice provider",
      "AI call automation platform team",
      "intelligent voice solutions company",
      "Hexa AI company information",
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

export default function AboutUsPage() {
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
      <AboutUsComponent />
      <JoinUsComponent />
    </>
  );
}
