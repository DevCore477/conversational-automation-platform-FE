import DemoSection from "../../components/sections/DemoSection";
import HowItWorksSection from "../../components/sections/HowItWorksSection";
import FAQSection from "../../components/sections/FAQSection";
import { UseCaseBenefits, UseCaseHero } from "../components";
import {
  CallingIcon,
  SupportIcon,
  Signals,
  FileIcon,
  UseCaseAutomatedCustomerFeedback,
} from "@/assets";
import LazyUseCaseTestimonials from "../components/LazyUseCaseTestimonials";
import { RadioTower, PhoneOutgoing, Users } from "lucide-react";

const title = "AI Customer Feedback & Automated Phone Surveys | Hexa-AI";
const description =
  "Gather customer feedback automatically with AI voice bots. Deploy custom conversation scripts, run bulk phone surveys, and track insights on a live dashboard.";
const url = "https://gethexa.ai/use-cases/customer-feedback";
const ogImage = "/og-image.png";

export async function generateMetadata() {
  return {
    title,
    description,
    keywords: [
      "automated customer feedback",
      "AI phone surveys",
      "voice survey automation",
      "customer satisfaction calls",
      "AI customer satisfaction surveys",
      "automated NPS calling",
      "voice feedback collection bot",
      "AI survey calling platform",
      "automated customer feedback calls",
      "voice-based customer surveys",
      "AI-powered feedback collection",
      "customer feedback voice automation",
      "automated satisfaction surveys",
      "AI survey phone bot",
      "voice-based NPS automation",
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

export default function CustomerFeedbackUseCasePage() {
  const faqs = [
    {
      question: "How does Hexa AI collect customer feedback?",
      answer:
        "Hexa AI can automatically call customers after a service, purchase, delivery, or appointment and ask structured feedback questions based on your preferred script.",
    },
    {
      question: "Can we customize the feedback questions?",
      answer:
        "Yes. You can create custom questions for customer satisfaction, service quality, delivery experience, staff behavior, product feedback, and overall ratings.",
    },
    {
      question: "Can Hexa AI collect ratings and comments?",
      answer:
        "Yes. Hexa AI can collect numerical ratings, yes/no responses, multiple-choice answers, and open-ended comments during the conversation.",
    },
    {
      question: "What happens if a customer gives negative feedback?",
      answer:
        "You can set rules for Hexa AI to flag negative responses, notify your team, create a follow-up task, or transfer the customer to a support representative when needed.",
    },
    {
      question: "Can we view feedback results in one place?",
      answer:
        "Yes. Feedback responses can be reviewed from the Hexa AI dashboard, helping you identify trends, common complaints, service gaps, and improvement opportunities.",
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
            name: "AI Customer Feedback Surveys",
            serviceType: "AI Voice Bots for Customer Feedback & Phone Surveys",
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
        title="Automated Customer Feedback"
        description="Hexa AI offers advanced AI-driven solutions for customer engagement, data analysis, and automation to optimize business operations."
        image={{
          src: UseCaseAutomatedCustomerFeedback,
          alt: "AI automated customer feedback visualization",
          className: "mix-blend-multiply",
        }}
        showAmplitude={true}
      />
      <UseCaseBenefits
        title="Customer Follow-Up and Feedback Recording Process"
        items={[
          {
            icon: CallingIcon,
            label: "Call customers following their interaction.",
          },
          {
            icon: SupportIcon,
            label: "Ask predefined feedback questions.",
          },
          {
            icon: Signals,
            label: "Record the customers' responses.",
          },
          {
            icon: FileIcon,
            label: "Analyze the recorded responses for insights.",
          },
        ]}
      />
      <HowItWorksSection
        title="From survey call to actionable insights"
        subtitle="Run phone surveys at scale, capture structured feedback, and escalate negative experiences."
        steps={[
          {
            title: "Define survey goals",
            description: "Define your survey goals and questions (NPS, CSAT, issue tags).",
            icon: <RadioTower className="size-5" />,
          },
          {
            title: "Run outbound surveys",
            description: "Run outbound surveys at scale using scripted flows.",
            icon: <PhoneOutgoing className="size-5" />,
          },
          {
            title: "Escalate negative feedback",
            description: "Escalate negative experiences to your team automatically.",
            icon: <Users className="size-5" />,
          },
          {
            title: "Analyze trends",
            description: "Analyze trends and improve customer experience with call insights.",
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
