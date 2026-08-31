import DemoSection from "../../components/sections/DemoSection";
import HowItWorksSection from "../../components/sections/HowItWorksSection";
import FAQSection from "../../components/sections/FAQSection";
import { UseCaseBenefits, UseCaseHero } from "../components";
import {
  UseCaseDelivery,
  UseCaseDeliveryPng,
  BellIcon,
  MessageSentIcon,
  OrderReturnIcon,
  InfoIcon,
  Signals,
} from "@/assets";
import LazyUseCaseTestimonials from "../components/LazyUseCaseTestimonials";
import { RadioTower, Bell, MailCheck, BellRing,  } from "lucide-react";

const title = "AI Logistics Assistants & Automated Supply Chain Calling | Hexa-AI";
const description =
  "Automate dispatch and delivery updates with AI voice agents. Run custom scripts to track shipments and driver updates, and sync your live dashboard.";
const url = "https://gethexa.ai/use-cases/logistics";
const ogImage = "/og-image.png";

export async function generateMetadata() {
  return {
    title,
    description,
    keywords: [
      "AI logistics",
      "automated delivery calling",
      "supply chain AI voice",
      "delivery notification calls",
      "AI delivery confirmation calls",
      "supply chain status updates voice",
      "logistics proactive notification",
      "AI dispatch communication",
      "automated shipment tracking calls",
      "delivery status voice automation",
      "last-mile delivery calls",
      "logistics automated outreach",
      "AI-based delivery notifications",
      "supply chain voice automation",
      "warehouse automated calling",
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

export default function LogisticsAndDeliveryServicesUseCasePage() {
  const faqs = [
    {
      question: "How can Hexa AI help logistics companies?",
      answer:
        "Hexa AI can handle delivery-related calls, provide shipment updates, collect customer details, and route complex issues to the right logistics team.",
    },
    {
      question: "Can Hexa AI answer package status questions?",
      answer:
        "Yes. Hexa AI can share approved information about shipment status, expected delivery times, delays, pickup details, and common delivery-related queries.",
    },
    {
      question: "Can Hexa AI reduce repeated customer calls?",
      answer:
        "Yes. By providing instant updates and answering routine delivery questions automatically, Hexa AI helps reduce repeated calls to your support team.",
    },
    {
      question: "Can Hexa AI handle delivery complaints or missed deliveries?",
      answer:
        "Yes. It can collect the customer's issue, record relevant details, create a follow-up request, or transfer the call to the appropriate support representative.",
    },
    {
      question: "Can Hexa AI route calls to different logistics departments?",
      answer:
        "Yes. Calls can be routed to delivery support, warehouse teams, drivers, billing, returns, or customer service based on the caller's request.",
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
            name: "AI Logistics Assistants",
            serviceType: "AI Voice Agents for Logistics & Delivery Updates",
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
        title="Logistics &amp; Delivery Services"
        description="Advanced AI-driven logistics and delivery services optimizing routes, tracking, and efficiency for seamless supply chain management."
        image={{
          src: UseCaseDeliveryPng,
          alt: "AI logistics and delivery services visualization",
          className: "mix-blend-multiply",
        }}
      />
      <UseCaseBenefits
        title="Benefits of Hexa AI in Logistics &amp; Delivery Services"
        items={[
          {
            icon: BellIcon,
            label: "Notify customers about their deliveries",
          },
          {
            icon: MessageSentIcon,
            label: "Answer delivery status questions",
          },
          {
            icon: OrderReturnIcon,
            label: "Follow up on missed deliveries",
          },
          {
            icon: InfoIcon,
            label: "Provide clear and helpful information",
          },
        ]}
      />
      <HowItWorksSection
        title="From dispatch to delivery updates"
        subtitle="Notify customers, answer status questions, and escalate exceptions without adding call volume."
        steps={[
          {
            title: "Define delivery scenarios",
            description: "Define delivery update scenarios and script variations.",
            icon: <Bell className="size-5" />,
          },
          {
            title: "Automate notifications",
            description: "Automate outbound notifications and inbound questions.",
            icon: <BellRing className="size-5" />,
          },
          {
            title: "Escalate exceptions",
            description: "Escalate exceptions to a live agent when necessary.",
            icon: <MailCheck className="size-5" />,
          },
          {
            title: "Improve operations",
            description: "Improve operations using call transcripts and analytics.",
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
