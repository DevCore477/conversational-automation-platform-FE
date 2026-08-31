import Integrations from "../components/sections/Integrations";
import LazyIntegrationSections from "../components/sections/LazyIntegrationSections";
import FAQSection from "../components/sections/FAQSection";

const title = "AI Voice & WhatsApp Integrations Marketplace | Hexa-AI";
const description =
  "Connect Hexa-AI to your CRM and business tools. Sync live dashboard data, trigger custom automated scripts, and seamlessly link your Meta WhatsApp API.";
const url = "https://gethexa.ai/integrations";
const ogImage = "/og-image.png";

export async function generateMetadata() {
  return {
    title,
    description,
    keywords: [
      "AI integrations",
      "voice AI CRM integration",
      "WhatsApp API integration",
      "call center integrations",
      "CRM integration for AI voice",
      "HubSpot AI calling integration",
      "Salesforce voice automation",
      "connect AI to Zapier",
      "voice agent API integrations",
      "n8n AI call workflows",
      "Make automation voice calls",
      "Google Sheets AI calling",
      "Slack AI call notifications",
      "Calendly AI scheduling integration",
      "WhatsApp Business API connection",
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

const faqs = [
  {
    question: "What apps can Hexa AI integrate with?",
    answer:
      "Hexa AI can connect with popular tools such as Google Sheets, Gmail, Slack, Google Drive, HubSpot, Calendly, Airtable, Salesforce, Zapier, n8n, and Make.",
  },
  {
    question:
      "Can Hexa AI automate tasks after a call or customer interaction?",
    answer:
      "Yes. Hexa AI can trigger workflows such as updating a CRM, sending an email, creating a lead record, notifying your team on Slack, or adding information to a spreadsheet.",
  },
  {
    question: "Do I need coding skills to set up integrations?",
    answer:
      "No. Many integrations can be configured through no-code platforms like Zapier, n8n, and Make, allowing you to connect workflows without custom development.",
  },
  {
    question: "Can Hexa AI connect with our CRM?",
    answer:
      "Yes. Hexa AI can support CRM workflows by sending customer details, lead information, call outcomes, and follow-up actions to tools such as HubSpot or Salesforce.",
  },
  {
    question: "How do integrations work in Hexa AI?",
    answer:
      "You select a trigger, connect the required apps, and define what action the AI should take. For example, a new customer inquiry can trigger Hexa AI to collect details and automatically send them to your CRM.",
  },
];

export default function IntegrationsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: title,
            description,
            url,
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
      <Integrations />
      <LazyIntegrationSections />
      <FAQSection faqs={faqs} />
    </>
  );
}
