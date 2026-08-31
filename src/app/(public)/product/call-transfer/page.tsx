import HowItWorksSection from "../../components/sections/HowItWorksSection";
import FAQSection from "../../components/sections/FAQSection";
import ProductHero from "../../components/product/call-transfer/ProductHero";
import { CallTransferLazySections } from "../../components/product/lazy-product-sections";
import { Info, PhoneOutgoing, RadioTower, Settings } from "lucide-react";

const title = "AI Call Transfer & Smart Routing Features | Hexa-AI";
const description =
  "Seamlessly transfer calls from AI agents to live representatives. Use custom conversation flows to route calls based on real-time customer needs.";
const url = "https://gethexa.ai/product/call-transfer";
const ogImage = "/og-image.png";

export async function generateMetadata() {
  return {
    title,
    description,
    keywords: [
      "AI call transfer",
      "smart call routing",
      "automated call handoff",
      "AI voice routing",
      "warm call transfer software",
      "intelligent call routing for businesses",
      "call center routing automation",
      "warm transfer for contact centers",
      "automated call distribution AI",
      "intelligent call routing system",
      "call handoff automation",
      "AI-powered phone routing",
      "smart call distribution",
      "phone system call routing",
      "AI agent call transfer",
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

const BookAppointmentPage = () => {
  const faqs = [
    {
      question:
        "What is the difference between cold transfer and warm transfer?",
      answer:
        "A cold transfer sends the caller directly to the selected number without sharing context. A warm transfer lets Hexa AI brief the next agent about the customer’s issue before connecting the call",
    },
    {
      question: "Can Hexa AI transfer calls to different departments?",
      answer:
        "Yes. You can create routing rules to transfer calls to sales, support, billing, technical teams, reception, or any department based on the customer’s request.",
    },
    {
      question: "Will the human agent receive customer context?",
      answer:
        "With warm transfer, Hexa AI can share important details collected during the conversation, such as the customer’s name, reason for calling, previous issue, and requested service.",
    },
    {
      question:
        "Can call transfer be used for both sales and customer support?",
      answer:
        "Yes. Hexa AI can qualify leads and transfer high-intent prospects to sales teams, while also routing complex support requests to the appropriate support representative.",
    },
  ];

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Hexa-AI Call Transfer & Routing",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            url,
            description,
            publisher: {
              "@type": "Organization",
              name: "Hexa-AI",
              url: "https://gethexa.ai",
            },
            offers: {
              "@type": "Offer",
              url: "https://gethexa.ai/connect-us",
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
      <ProductHero />
      <CallTransferLazySections />

      <HowItWorksSection
        title="From AI conversation to live handoff"
        subtitle="Route callers to the right team with context, without breaking the customer experience."
        steps={[
          {
            title: "Define routing rules",
            description: "Set when and how calls should transfer based on intent, data, or workflow triggers.",
            icon: <Settings className="size-5.5" />,
          },
          {
            title: "Collect call context",
            description: "Capture key details during the AI conversation before escalation.",
            icon: <Info className="size-5.5" />,
          },
          {
            title: "Transfer with context",
            description: "Hand off to a live representative with full conversation context.",
            icon: <PhoneOutgoing className="size-5" />,
          },
          {
            title: "Monitor routing quality",
            description: "Use post-call analytics to refine routing rules and improve outcomes.",
            icon: <RadioTower className="size-5" />,
          },
        ]}
      />

      <FAQSection faqs={faqs} />
    </div>
  );
};

export default BookAppointmentPage;
