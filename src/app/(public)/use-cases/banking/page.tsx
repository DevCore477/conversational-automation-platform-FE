import DemoSection from "../../components/sections/DemoSection";
import HowItWorksSection from "../../components/sections/HowItWorksSection";
import FAQSection from "../../components/sections/FAQSection";
import { UseCaseBenefits, UseCaseHero } from "../components";
import {
  ReloadSetting,
  FileTextIcn,
  MessageIcon,
  ParticalIcon,
  UseCaseBanking,
} from "@/assets";
import LazyUseCaseTestimonials from "../components/LazyUseCaseTestimonials";
import { RadioTower, FileText, MessageCircleMore, Settings } from "lucide-react";

const title = "AI Banking Assistants & Automated Financial Calling | Hexa-AI";
const description =
  "Automate secure financial outreach with AI voice agents. Run custom scripts for fraud alerts, loan updates, and sync live dashboard metrics instantly.";
const url = "https://gethexa.ai/use-cases/banking";
const ogImage = "/og-image.png";

export async function generateMetadata() {
  return {
    title,
    description,
    keywords: [
      "AI banking assistant",
      "automated financial calling",
      "banking voice AI",
      "financial outreach automation",
      "AI loan notification calls",
      "fraud alert automation",
      "secure financial outreach",
      "TCPA-compliant financial calling",
      "AI debt collection calls",
      "automated banking notifications",
      "banking call center AI",
      "financial services voice automation",
      "AI-powered financial communication",
      "compliant financial outreach",
      "voice-based banking notifications",
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

export default function BankingAndFinancialServicesUseCasePage() {
  const faqs = [
    {
      question: "How can Hexa AI support banking customer calls?",
      answer:
        "Hexa AI can handle routine banking inquiries, guide customers through common processes, collect basic information, and route sensitive or complex requests to the appropriate team.",
    },
    {
      question: "Can Hexa AI answer account and service-related questions?",
      answer:
        "Yes. Hexa AI can provide approved information about branch timings, card services, loan inquiries, account opening steps, payment processes, and other frequently asked questions.",
    },
    {
      question: "Can Hexa AI help reduce call center workload?",
      answer:
        "Yes. By handling repetitive questions and simple service requests automatically, Hexa AI helps banking teams focus on complex cases that require human assistance.",
    },
    {
      question: "What happens if a customer has a sensitive or urgent issue?",
      answer:
        "Hexa AI can identify escalation triggers and transfer the caller to the correct department, such as fraud support, customer service, card services, or a banking representative.",
    },
    {
      question: "Can Hexa AI provide secure and consistent customer support?",
      answer:
        "Yes. Hexa AI follows configured conversation flows and approved information so customers receive consistent guidance while sensitive requests can be routed to authorized staff.",
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
            name: "AI Banking Assistants",
            serviceType: "AI Voice Agents for Banking & Financial Services",
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
        title="Banking &amp; Financial Services"
        description="Hexa AI offers advanced artificial intelligence solutions to enhance automation, data analysis, and decision-making processes across various industries."
        image={{
          src: UseCaseBanking,
          alt: "AI banking and financial services visualization",
          className: "mix-blend-multiply",
        }}
      />
      <UseCaseBenefits
        title="Benefits of Hexa AI in Banking &amp; Financial Services"
        items={[
          {
            icon: FileTextIcn,
            label: "Share Account-Related Information",
          },
          {
            icon: ReloadSetting,
            label: "Explain Bank Services and Plans",
          },
          {
            icon: MessageIcon,
            label: "Follow Strict Conversation Flows",
          },
          {
            icon: ParticalIcon,
            label: "Provide Clear and Structured Responses",
          },
        ]}
      />
      <HowItWorksSection
        title="From outreach to confirmation"
        subtitle="Run compliant banking calls with strict scripts, clear escalation, and measurable outcomes."
        steps={[
          {
            title: "Define outreach scenarios",
            description: "Define outreach scenarios (fraud, loans, reminders) and approved scripts.",
            icon: <FileText className="size-5" />,
          },
          {
            title: "Configure routing rules",
            description: "Configure call routing rules and escalation triggers for sensitive cases.",
            icon: <Settings className="size-5.5" />,
          },
          {
            title: "Run campaigns",
            description: "Run campaigns and capture confirmations consistently across customers.",
            icon: <MessageCircleMore className="size-5" />,
          },
          {
            title: "Refine with analytics",
            description: "Review analytics and refine scripts to improve completion rates.",
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
