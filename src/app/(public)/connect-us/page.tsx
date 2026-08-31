import { callingKeywords } from "@/common/constants/seo-keywords";
import FAQSection from "../components/sections/FAQSection";
import ConnectUsForm from "../components/ConnectUsForm";

const title = "Contact Us & Request an AI Voice Demo | Hexa-AI";
const description =
  "Get in touch with Hexa-AI. Contact our team to request custom enterprise pricing, build automated voice agent scripts, and scale your WhatsApp marketing.";
const url = "https://gethexa.ai/connect-us";
const ogImage = "/og-image.png";

export async function generateMetadata() {
  return {
    title,
    description,
    keywords: [
      ...callingKeywords.primary,
      ...callingKeywords.secondary,
      "AI voice demo request",
      "request AI call platform demo",
      "contact AI automation company",
      "AI calling software inquiry",
      "enterprise AI voice pricing",
      "WhatsApp automation demo",
      "AI agent platform contact",
      "business phone automation demo",
      "custom AI calling solution",
      "AI outbound sales demo",
      "Hexa AI contact information",
      "AI voice agent consultation",
      "automated phone system demo",
      "WhatsApp API business inquiry",
      "AI call center demo request",
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

export default function ConnectUsPage() {
  const faqs = [
    {
      question: "How do I request a demo of Hexa AI?",
      answer:
        "Complete the contact form with your name, business email, company size, and use case. Our team will review your requirements and get in touch to arrange a suitable demo.",
    },
    {
      question: "What happens after I submit the form?",
      answer:
        "Once you submit your details, the Hexa AI team will review your business needs and contact you to discuss the best AI call automation solution for your workflow.",
    },
    {
      question: "Can Hexa AI be customized for my business?",
      answer:
        "Yes. Hexa AI can be configured around your business requirements, including call scripts, customer questions, call routing, integrations, appointment flows, and escalation rules.",
    },
    {
      question: "Can Hexa AI integrate with our existing tools?",
      answer:
        "Yes. Hexa AI can connect with your CRM, calendar, communication tools, and other business systems to keep customer information and workflows connected.",
    },
    {
      question: "Do you offer enterprise solutions and pricing?",
      answer:
        "Yes. Hexa AI supports businesses of different sizes, including enterprise teams. Pricing and implementation options can be discussed based on your call volume, integrations, use case, and support requirements.",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />
      <ConnectUsForm />
      <div className="mt-16">
        <FAQSection faqs={faqs} />
      </div>
    </>
  );
}
