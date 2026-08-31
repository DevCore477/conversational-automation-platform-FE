import DemoSection from "../../components/sections/DemoSection";
import HowItWorksSection from "../../components/sections/HowItWorksSection";
import FAQSection from "../../components/sections/FAQSection";
import { UseCaseBenefits, UseCaseHero } from "../components";
import {
  UseCaseCustomerSupport,
  UserQuestionIcon,
  FileIcon,
  OutgoingCall,
  MinusIcon,
} from "@/assets";
import LazyUseCaseTestimonials from "../components/LazyUseCaseTestimonials";
import { BookUser, FolderOpen, PhoneOutgoing, RadioTower } from "lucide-react";

const title = "AI Customer Support & Automated Phone Support | Hexa-AI";
const description =
  "Lower wait times with 24/7 AI customer support agents. Resolve queries using custom conversation flows, trigger scripts, and sync live dashboard data.";
const url = "https://gethexa.ai/use-cases/customer-support";
const ogImage = "/og-image.png";

export async function generateMetadata() {
  return {
    title,
    description,
    keywords: [
      "AI customer support",
      "automated phone support",
      "AI call center",
      "voice agent support",
      "24/7 AI customer support agents",
      "affordable AI support center",
      "AI support automation for SMBs",
      "AI-powered customer service calls",
      "voice bot customer support",
      "automated customer service calling",
      "AI support phone agent",
      "customer support voice automation",
      "AI call handling support",
      "intelligent customer support system",
      "voice-based customer assistance",
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

export default function CustomerSupportUseCasePage() {
  const faqs = [
    {
      question: "How can Hexa AI support our customer service team?",
      answer:
        "Hexa AI can answer routine customer calls, provide instant information, resolve common queries, collect details, and route complex issues to the right team member.",
    },
    {
      question: "Can Hexa AI handle customer support calls 24/7?",
      answer:
        "Yes. Hexa AI can respond to customers outside business hours, during peak call times, or when your support team is unavailable.",
    },
    {
      question: "What kind of customer questions can Hexa AI answer?",
      answer:
        "Hexa AI can answer questions about services, products, orders, appointments, delivery status, business hours, policies, account-related issues, and other information available in your knowledge base.",
    },
    {
      question: "Can Hexa AI transfer difficult cases to a human agent?",
      answer:
        "Yes. When a customer needs additional help, Hexa AI can transfer the call to the correct department, support representative, or escalation team.",
    },
    {
      question: "Can we track customer support performance?",
      answer:
        "Yes. You can review call outcomes, common customer issues, transferred calls, sentiment, and support trends to improve your customer experience.",
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
            name: "AI Customer Support",
            serviceType: "AI Voice Agents for Customer Support & Call Centers",
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
        title="Customer Support &amp; Call Centers"
        description="Hexa AI offers advanced AI-powered solutions for customer support, chatbots, and automation to enhance business communication and efficiency."
        image={{
          src: UseCaseCustomerSupport,
          alt: "AI customer support and call center visualization",
          className: "mix-blend-multiply",
        }}
      />
      <UseCaseBenefits
        title="Benefits of Hexa AI in Customer Support"
        items={[
          {
            icon: UserQuestionIcon,
            label: "Answer common customer questions",
          },
          {
            icon: FileIcon,
            label: "Follow scripted conversation flows",
          },
          {
            icon: OutgoingCall,
            label: "Escalate calls only when needed",
          },
          {
            icon: MinusIcon,
            label: "Reduce workload on human agents",
          },
        ]}
      />
      <HowItWorksSection
        title="From first call to resolution"
        subtitle="Automate common support calls, escalate when needed, and improve outcomes with analytics."
        steps={[
          {
            title: "Define support goals",
            description: "Define your support goals and the top call reasons your team handles.",
            icon: <BookUser className="size-5.5" />,
          },
          {
            title: "Build scripted flows",
            description: "Build scripted flows to collect information and resolve FAQs.",
            icon: <FolderOpen className="size-5" />,
          },
          {
            title: "Escalate when needed",
            description: "Configure escalation rules to route complex issues to humans.",
            icon: <PhoneOutgoing className="size-5" />,
          },
          {
            title: "Improve continuously",
            description: "Review post-call analytics to continuously improve outcomes.",
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
