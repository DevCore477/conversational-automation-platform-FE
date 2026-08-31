import DemoSection from "../../components/sections/DemoSection";
import HowItWorksSection from "../../components/sections/HowItWorksSection";
import FAQSection from "../../components/sections/FAQSection";
import { UseCaseBenefits, UseCaseHero } from "../components";
import { Info, PhoneOutgoing, RadioTower, Settings } from "lucide-react";
import { UseCaseReceptionist, IncomingCall, SupportIcon, OutgoingCall, InfoIcnFilled, InfoIcon,
} from "@/assets";
import LazyUseCaseTestimonials from "../components/LazyUseCaseTestimonials";

const title = "AI Receptionist: Automated Virtual Phone Answering | Hexa-AI";
const description =
  "Automate business call answering 24/7 with a virtual AI receptionist. Manage conversational custom flows, route calls, and log real-time dashboard details.";
const url = "https://gethexa.ai/use-cases/receptionist";
const ogImage = "/og-image.png";

export async function generateMetadata() {
  return {
    title,
    description,
    keywords: [
      "AI receptionist",
      "virtual phone answering",
      "automated call answering",
      "AI front desk",
      "affordable AI receptionist",
      "AI receptionist for small business",
      "24/7 phone answering bot",
      "virtual receptionist AI",
      "automated phone reception",
      "AI call greeting system",
      "virtual assistant phone answering",
      "AI telephone receptionist",
      "automated business call answering",
      "AI phone answering service",
      "virtual business receptionist",
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

export default function ReceptionistUseCasePage() {
  const faqs = [
    {
      question: "What does an AI receptionist do?",
      answer:
        "Hexa AI answers incoming calls, greets customers professionally, understands why they are calling, shares basic business information, and guides them to the right next step.",
    },
    {
      question: "Can Hexa AI answer calls 24/7?",
      answer:
        "Yes. Hexa AI can provide round-the-clock call handling, helping your business respond to customers even outside working hours or during busy periods.",
    },
    {
      question: "Can the AI transfer calls to the right department?",
      answer:
        "Yes. You can set routing rules so Hexa AI transfers callers to the appropriate team, department, agent, or phone number based on their request.",
    },
    {
      question: "Can Hexa AI book appointments for callers?",
      answer:
        "Yes. When a caller wants to schedule a meeting, consultation, or service, Hexa AI can collect their details and guide them toward an available appointment slot.",
    },
    {
      question: "Can the AI answer common business questions?",
      answer:
        "Yes. Hexa AI can use your approved business information to answer common questions about services, operating hours, locations, pricing, policies, and more.",
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
            name: "AI Receptionist",
            serviceType: "Virtual AI Receptionist for Automated Call Answering",
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
        title="Receptionist"
        description="Hexa AI Receptionist offers intelligent, round-the-clock virtual front desk support to enhance customer experience and streamline business operations."
        image={{
          src: UseCaseReceptionist,
          alt: "AI receptionist visualization",
          className: "mix-blend-multiply",
        }}
      />
      <UseCaseBenefits
        title="Incoming Call Reception and Initial Screening Workflow"
        items={[
          {
            icon: IncomingCall,
            label: "Answer Incoming Calls 24/7",
          },
          {
            icon: SupportIcon,
            label: "Greet Customers Professionally",
          },
          {
            icon: OutgoingCall,
            label: "Route Calls to the Right Department",
          },
          {
            icon: InfoIcnFilled,
            label: "Share Basic Business Information",
          },
        ]}
      />
      <HowItWorksSection
        title="From incoming call to right destination"
        subtitle="Answer calls 24/7, collect intent, and route callers to the right team or appointment slot."
        steps={[
          {
            title: "Set routing rules",
            description: "Set greeting, business hours, and routing rules for your front desk.",
            icon: <Settings className="size-5.5" />,
          },
          {
            title: "Collect caller intent",
            description: "Collect caller intent and relevant details automatically.",
            icon: <Info className="size-5.5" />,
          },
          {
            title: "Transfer or schedule",
            description: "Transfer calls or schedule appointments and callbacks.",
            icon: <PhoneOutgoing className="size-5.5" />,
          },
          {
            title: "Improve triage",
            description: "Review analytics to improve triage and customer experience.",
            icon: <RadioTower className="size-5.5" />,
          },
        ]}
      />
      {/* <DemoSection /> */}
      <LazyUseCaseTestimonials />
      <FAQSection faqs={faqs} />
    </>
  );
}
