import { callingKeywords } from "@/common/constants/seo-keywords";
import HeroSection from "./components/sections/HeroSection";
import FAQSection from "./components/sections/FAQSection";
import LazyLandingSections from "./components/sections/LazyLandingSections";

const url = "https://gethexa.ai/";
const ogImage = "/og-image.png";

export async function generateMetadata() {
  return {
    title: "Hexa-AI | AI Voice Agents & WhatsApp Automation Platform",
    keywords: [
      ...callingKeywords.primary,
      ...callingKeywords.secondary,
      "AI phone calling platform",
      "business voice automation",
      "intelligent call routing",
      "conversational AI for business",
      "AI voice assistant platform",
      "automated phone system",
      "AI telephony software",
      "voice bot for business",
      "AI powered call center",
      "smart IVR solution",
      "automated customer communication",
      "voice AI technology",
      "call automation platform",
      "AI voice agent software",
      "intelligent automation for calls",
    ],
    description:
      "Automate inbound & outbound calls with human-like AI agents, custom script flows, and live dashboards. Scale marketing with automated Meta WhatsApp bulk messaging.",
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: "Hexa-AI | AI Voice Agents & WhatsApp Automation Platform",
      description:
        "Automate inbound & outbound calls with human-like AI agents, custom script flows, and live dashboards. Scale marketing with automated Meta WhatsApp bulk messaging.",
      type: "website",
      siteName: "Hexa-AI",
      locale: "en_US",
      url,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Hexa-AI | AI Voice Agents & WhatsApp Automation Platform",
      description:
        "Automate inbound & outbound calls with human-like AI agents, custom script flows, and live dashboards. Scale marketing with automated Meta WhatsApp bulk messaging.",
      images: [ogImage],
    },
  };
}

const faqs = [
  {
    question: "What is Hexa AI?",
    answer:
      "Hexa AI is an AI voice agent platform that helps businesses automate inbound and outbound phone calls. It can handle customer support, appointment booking, lead qualification, order taking, call routing, follow-ups, and more.",
  },
  {
    question: "What can Hexa AI voice agents do?",
    answer:
      "Hexa AI agents can answer calls, make outbound calls, respond to customer questions, collect information, book appointments, transfer calls, navigate IVR systems, and provide post-call insights.",
  },
  {
    question: "Can Hexa AI handle both inbound and outbound calls?",
    answer:
      "Yes. Hexa AI can answer incoming customer calls and also make outbound calls for lead follow-ups, appointment reminders, customer feedback, payment reminders, order confirmations, and other business workflows.",
  },
  {
    question: "Does Hexa AI support multiple languages?",
    answer:
      "Yes. Hexa AI supports conversations in 18+ languages, helping businesses communicate with customers across different regions and markets.",
  },
  {
    question: "Can Hexa AI handle high call volumes?",
    answer:
      "Yes. Hexa AI is built to scale and can handle multiple concurrent calls, helping businesses manage busy periods without increasing headcount.",
  },
  {
    question: "Which industries can use Hexa AI?",
    answer:
      "Hexa AI can support businesses across healthcare, restaurants, logistics, real estate, banking, education, retail, customer support, sales, and appointment-based services.",
  },
  {
    question: "How can Hexa AI help reduce business costs?",
    answer:
      "By automating repetitive calls, answering customers instantly, reducing missed calls, and handling routine workflows, Hexa AI can help teams focus on higher-value customer needs.",
  },
  {
    question: "Can I try Hexa AI before using it for my business?",
    answer:
      "Yes. You can request a demo or try Hexa AI to explore how an AI voice agent can fit your business workflow.",
  },
];

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Hexa-AI Voice Agents & WhatsApp Automation",
            description:
              "Automate inbound & outbound calls with human-like AI agents, custom script flows, and live dashboards. Scale marketing with automated Meta WhatsApp bulk messaging.",
            url: "https://gethexa.ai/",
            brand: {
              "@type": "Brand",
              name: "Hexa-AI",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          }),
        }}
      />
      <div className="w-full min-w-0">
      <HeroSection />
      <LazyLandingSections />
      <FAQSection faqs={faqs} title="FAQs" />
    </div>
    </>
  );
}
