import DemoSection from "../../components/sections/DemoSection";
import HowItWorksSection from "../../components/sections/HowItWorksSection";
import FAQSection from "../../components/sections/FAQSection";
import { UseCaseBenefits, UseCaseHero } from "../components";
import {
  UseCaseSalesAndLeadGeneration,
  QuestionIcon,
  FileIcon,
  OutgoingCall,
  UserCycleIcon,
  QuestionMarkIcn
} from "@/assets";
import LazyUseCaseTestimonials from "../components/LazyUseCaseTestimonials";
import { CircleQuestionMark, FileText, PhoneOutgoing, RadioTower } from "lucide-react";

const title = "AI Sales Agents & Automated Outbound Calling | Hexa-AI";
const description =
  "Automate cold calling and sales outreach with smart AI voice agents. Run custom conversational scripts to qualify leads, pitch prospects, and update your dashboard.";
const url = "https://gethexa.ai/use-cases/sales";
const ogImage = "/og-image.png";

export async function generateMetadata() {
  return {
    title,
    description,
    keywords: [
      "AI sales agent",
      "automated outbound calling",
      "AI lead generation",
      "voice sales automation",
      "AI cold calling software",
      "voice lead qualification",
      "automated sales prospecting",
      "AI sales dialer",
      "autonomous sales calling",
      "voice sales bot",
      "automated lead follow-up calls",
      "AI outbound calling platform",
      "sales automation with AI voice",
      "AI sales rep for outbound",
      "voice-based lead generation",
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

export default function SalesAndLeadGenerationUseCasePage() {
  const faqs = [
    {
      question: "How does Hexa AI qualify leads?",
      answer:
        "You can create sales scripts with qualifying questions based on your ideal customer profile. Hexa AI collects answers during the call and identifies leads that match your criteria.",
    },
    {
      question: "Can Hexa AI follow our sales script?",
      answer:
        "Yes. You can design custom sales scripts, conversation branches, objection-handling responses, and qualifying questions to keep every outreach call consistent.",
    },
    {
      question: "Can Hexa AI book meetings for qualified leads?",
      answer:
        "Yes. Once a prospect shows interest and meets your qualification criteria, Hexa AI can help schedule a meeting, demo, consultation, or follow-up call with your sales team.",
    },
    {
      question: "What happens when a lead wants to speak to a sales representative?",
      answer:
        "Hexa AI can smoothly transfer the call to a live sales representative or route the lead details to your team for immediate follow-up.",
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
            name: "AI Sales Agents",
            serviceType: "AI Voice Agents for Sales & Lead Generation",
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
        title="Sales &amp; Lead Generation"
        description="Hexa AI offers innovative AI-powered solutions for sales automation, lead generation, customer engagement, and data-driven insights to enhance business growth."
        image={{
          src: UseCaseSalesAndLeadGeneration,
          alt: "AI sales and lead generation visualization",
          className: "mix-blend-multiply",
        }}
      />
      <UseCaseBenefits
        title="Automated Customer Outreach and Lead Qualification System"
        items={[
          {
            icon: OutgoingCall,
            label: "Call potential customers automatically",
          },
          {
            icon: FileIcon,
            label: "Follow sales scripts",
          },
          {
            icon: QuestionMarkIcn,
            label: "Ask qualifying questions",
          },
          {
            icon: UserCycleIcon,
            label: "Pass interested leads to sales teams",
          },
        ]}
      />
      <HowItWorksSection
        title="From outreach to qualified leads"
        subtitle="Launch campaigns, qualify prospects, and route opportunities to your sales team without manual dialing."
        steps={[
          {
            title: "Define outreach goals",
            description: "Upload your lead lists and define outreach goals for each campaign.",
            icon: <CircleQuestionMark className="size-5.5" />,
          },
          {
            title: "Design sales scripts",
            description: "Design a sales script with qualifying questions and branches.",
            icon: <FileText className="size-5" />,
          },
          {
            title: "Route qualified leads",
            description: "Route hot leads to your team or book meetings automatically.",
            icon: <PhoneOutgoing className="size-5" />,
          },
          {
            title: "Optimize campaigns",
            description: "Optimize using call analytics and outcomes from each campaign.",
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
