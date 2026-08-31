import HowItWorksSection from "../../components/sections/HowItWorksSection";
import FAQSection from "../../components/sections/FAQSection";
import NavigateHero from "../../components/product/navigate-ivr/NavigateHero";
import { NavigateIvrLazySections } from "../../components/product/lazy-product-sections";
import { CircleQuestionMark, MessageCircleMore, PhoneOutgoing, RadioTower, } from "lucide-react";

const title = "Smart IVR Navigation & AI Call Routing | Hexa-AI";
const description =
  "Replace clunky phone menus with intuitive AI IVR navigation. Guide callers using smart conversation flows, instant script triggers, and custom routing.";
const url = "https://gethexa.ai/product/navigate-ivr";
const ogImage = "/og-image.png";

export async function generateMetadata() {
  return {
    title,
    description,
    keywords: [
      "AI IVR navigation",
      "smart IVR system",
      "AI call routing",
      "conversational IVR",
      "IVR automation software",
      "conversational IVR replacement",
      "automated IVR navigation",
      "AI-powered phone menu",
      "intelligent call routing system",
      "IVR bypass automation",
      "AI phone menu navigation",
      "modern IVR system",
      "natural language IVR",
      "AI menu routing",
      "automated phone system navigation",
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

const NavigateIVRPage = () => {
  const faqs = [
    {
      question: "What is IVR navigation in Hexa AI?",
      answer:
        "Hexa AI can listen to IVR menus and automatically select the right options to reach the required department, service, or representative faster.",
    },
    {
      question: "Can Hexa AI navigate keypad menus automatically?",
      answer:
        "Yes. Hexa AI can follow configured IVR paths, select menu options, enter required details, and continue through multi-step phone menus without manual effort.",
    },
    {
      question: "Can Hexa AI handle long or complex IVR systems?",
      answer:
        "Yes. It can navigate multi-level IVR flows, including menus for billing, customer support, account services, appointments, and other business operations.",
    },
    {
      question: "Can we customize the IVR navigation flow?",
      answer:
        "Yes. You can define the preferred menu path, required inputs, fallback actions, and escalation rules based on your business process.",
    },
    {
      question: "What happens if the IVR flow changes or fails?",
      answer:
        "You can configure fallback actions such as retrying the flow, transferring to a human agent, notifying your team, or collecting the required details for follow-up.",
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
            name: "Hexa-AI IVR Navigation",
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
      <NavigateHero />
      <NavigateIvrLazySections />

      <HowItWorksSection
        title="From phone menu to smart routing"
        subtitle="Replace rigid IVR menus with conversational navigation that gets callers to the right place faster."
        steps={[
          {
            title: "Map caller intents",
            description:
              "Define intents and routing paths that replace traditional phone menus.",
            icon: <CircleQuestionMark className="size-5.5" />,
          },
          {
            title: "Guide conversations",
            description:
              "Use natural dialogue to collect details and understand what callers need.",
            icon: <MessageCircleMore className="size-5.5" />,
          },
          {
            title: "Route or transfer",
            description:
              "Send callers to the right queue or live agent with captured context.",
            icon: <PhoneOutgoing className="size-5" />,
          },
          {
            title: "Reduce misroutes",
            description:
              "Use analytics to find drop-off points and improve navigation flows.",
            icon: <RadioTower className="size-5" />,
          },
        ]}
      />

      <FAQSection faqs={faqs} />
    </div>
  );
};

export default NavigateIVRPage;
