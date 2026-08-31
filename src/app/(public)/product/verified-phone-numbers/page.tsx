import HowItWorksSection from "../../components/sections/HowItWorksSection";
import FAQSection from "../../components/sections/FAQSection";
import VerifiedPhoneHero from "../../components/product/verified-phone-numbers/VerifiedHero";
import { VerifiedPhoneLazySections } from "../../components/product/lazy-product-sections";
import { Atom, Bell, CircleCheckBig, RadioTower } from "lucide-react";

const title = "Verified Phone Numbers & Caller ID Reputation | Hexa-AI";
const description =
  "Protect your brand reputation. Use verified business phone numbers to reduce spam flags, improve answer rates, and ensure secure AI voice outreach.";
const url = "https://gethexa.ai/product/verified-phone-numbers";
const ogImage = "/og-image.png";

export async function generateMetadata() {
  return {
    title,
    description,
    keywords: [
      "verified phone numbers",
      "caller ID reputation",
      "business phone verification",
      "AI call deliverability",
      "branded caller ID for AI agents",
      "prevent AI call blocking",
      "verified numbers for outbound campaigns",
      "spam filter bypass business calls",
      "business phone number verification",
      "calling number authentication",
      "outbound call reputation management",
      "verified business calling",
      "carrier-compliant phone numbers",
      "call authentication service",
      "outbound calling phone verification",
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
      question: "What are verified phone numbers in Hexa AI?",
      answer:
        "Verified phone numbers are business phone numbers that have been approved and connected to your Hexa AI account so your AI agents can make and receive calls using trusted caller identities.",
    },
    {
      question: "Why do I need to verify a phone number?",
      answer:
        "Verification helps confirm that you own or are authorized to use the number. It also improves call reliability and helps maintain customer trust when they receive calls from your business.",
    },
    {
      question: "Can I use my existing business number?",
      answer:
        "Yes. You can connect and verify an existing business phone number, depending on your telephony setup and supported provider configuration.",
    },
    {
      question: "Can I add multiple verified phone numbers?",
      answer:
        "Yes. You can add multiple verified numbers for different departments, campaigns, locations, agents, or use cases such as sales, support, reminders, and order confirmations.",
    },
    {
      question: "Can I assign a verified number to a specific AI agent?",
      answer:
        "Yes. A verified phone number can be linked to a specific AI agent or workflow so incoming and outgoing calls follow the correct conversation flow, script, and routing rules.",
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
            name: "Hexa-AI Verified Phone Numbers",
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
      <VerifiedPhoneHero />
      <VerifiedPhoneLazySections />

      <HowItWorksSection
        title="From unknown caller to trusted outreach"
        subtitle="Improve answer rates and brand trust with verified business phone numbers at scale."
        steps={[
          {
            title: "Verify your numbers",
            description:
              "Set up verified caller ID for outbound and inbound calling workflows.",
            icon: <CircleCheckBig className="size-5.5" />,
          },
          {
            title: "Protect reputation",
            description:
              "Reduce spam flags and improve deliverability for high-volume campaigns.",
            icon: <Bell className="size-5.5" />,
          },
          {
            title: "Increase answer rates",
            description:
              "Build caller trust so more customers pick up your business calls.",
            icon: <RadioTower className="size-5.5" />,
          },
          {
            title: "Measure performance",
            description:
              "Track campaign outcomes and optimize calling strategy over time.",
            icon: <Atom className="size-5.5" />,
          },
        ]}
      />

      <FAQSection faqs={faqs} />
    </div>
  );
};

export default BookAppointmentPage;
