import DemoSection from "../../components/sections/DemoSection";
import HowItWorksSection from "../../components/sections/HowItWorksSection";
import FAQSection from "../../components/sections/FAQSection";
import { UseCaseBenefits, UseCaseHero } from "../components";
import {
  UseCaseRealEstate,
  CallingIcon,
  InfoIcon,
  CalendarTimeIcon,
  SettingIcon,
  Signals,
} from "@/assets";
import LazyUseCaseTestimonials from "../components/LazyUseCaseTestimonials";
import { RadioTower, Settings, CalendarClock, PhoneCall,  } from "lucide-react";

const title = "AI Real Estate Agents & Automated Property Calling | Hexa-AI";
const description =
  "Automate lead qualification and property follow-ups with AI voice agents. Run custom scripts for scheduling viewings and update your live dashboard.";
const url = "https://gethexa.ai/use-cases/real-estate";
const ogImage = "/og-image.png";

export async function generateMetadata() {
  return {
    title,
    description,
    keywords: [
      "AI real estate agent",
      "automated property calling",
      "AI lead qualification",
      "real estate voice AI",
      "AI lead qualification for real estate",
      "automated property follow-up calls",
      "AI open house reminders",
      "real estate lead generation AI",
      "AI property inquiry bot",
      "automated real estate calling",
      "voice-based property follow-up",
      "AI real estate prospecting",
      "real estate cold calling AI",
      "AI agent for real estate",
      "property lead automation voice",
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

export default function RealEstateUseCasePage() {
  const faqs = [
    {
      question: "How can Hexa AI help real estate businesses?",
      answer:
        "Hexa AI can answer property-related calls, qualify leads, collect buyer or tenant requirements, share basic listing information, and route serious inquiries to the right agent.",
    },
    {
      question: "Can Hexa AI capture property inquiry details?",
      answer:
        "Yes. It can collect details such as preferred location, property type, budget, number of bedrooms, move-in timeline, and whether the caller is looking to buy, rent, or sell.",
    },
    {
      question: "Can Hexa AI schedule property viewings?",
      answer:
        "Yes. Hexa AI can help book site visits, property tours, consultations, and follow-up calls based on your team's availability.",
    },
    {
      question: "Can Hexa AI answer questions about listings?",
      answer:
        "Yes. It can provide approved details about property features, location, pricing, availability, amenities, and next steps using your connected property information or knowledge base.",
    },
    {
      question: "What happens when a lead is ready to speak with an agent?",
      answer:
        "Hexa AI can transfer the call to the relevant sales agent, broker, or property consultant, along with the lead details collected during the conversation.",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "AI Real Estate Agents",
            serviceType: "AI Voice Agents for Real Estate Lead Qualification",
            url,
            description,
            provider: {
              "@type": "Organization",
              name: "Hexa-AI",
              url: "https://gethexa.ai",
            },
            areaServed: "Worldwide",
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
      <UseCaseHero
        title="Real Estate"
        description="Hexa AI offers innovative AI-powered solutions to optimize business processes, enhance automation, and deliver actionable insights across various industries."
        image={{
          src: UseCaseRealEstate,
          alt: "AI real estate visualization",
          className: "mix-blend-multiply",
        }}
      />
      <UseCaseBenefits
        title="Benefits of Hexa AI in Real Estate Industry"
        items={[
          {
            icon: CallingIcon,
            label: "Automated prospect calling",
          },
          {
            icon: InfoIcon,
            label: "Share property details with prospects",
          },
          {
            icon: CalendarTimeIcon,
            label: "Schedule site visits seamlessly",
          },
          {
            icon: SettingIcon,
            label: "Streamline your property management process",
          },
        ]}
      />
      <HowItWorksSection
        title="From inquiry to viewing"
        subtitle="Qualify leads, automate follow-ups, and schedule property viewings without manual outreach."
        steps={[
          {
            title: "Build qualifying scripts",
            description: "Build a qualifying script for buyer and tenant requirements.",
            icon: <PhoneCall className="size-5" />,
          },
          {
            title: "Automate follow-ups",
            description: "Automate follow-ups after inquiries and missed calls.",
            icon: <Settings className="size-5.5" />,
          },
          {
            title: "Schedule viewings",
            description: "Schedule viewings and route high-intent leads to agents.",
            icon: <CalendarClock className="size-5" />,
          },
          {
            title: "Refine messaging",
            description: "Use analytics to refine objections handling and messaging.",
            icon: <RadioTower className="size-5" />,
          },
        ]}
      />
      {/*<DemoSection />*/}
      <LazyUseCaseTestimonials />
      <FAQSection faqs={faqs} />
    </>
  );
}
