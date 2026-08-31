import DemoSection from "../../components/sections/DemoSection";
import HowItWorksSection from "../../components/sections/HowItWorksSection";
import FAQSection from "../../components/sections/FAQSection";
import { UseCaseBenefits, UseCaseHero } from "../components";
import { UseCaseAutomatedOrders, ShopingBagIcon, FileTextIcn, FolderIcon, CheckMarkIcon, } from "@/assets";
import LazyUseCaseTestimonials from "../components/LazyUseCaseTestimonials";
import { FolderOpen, PhoneOutgoing, RadioTower, ShoppingCart } from "lucide-react";

const title = "AI Order Taking: Automated Phone Order Processing | Hexa-AI";
const description =
  "Automate order taking with smart AI voice agents. Run custom conversational scripts to process orders, verify availability, and update your dashboard in real time.";
const url = "https://gethexa.ai/use-cases/automated-orders";
const ogImage = "/og-image.png";

export async function generateMetadata() {
  return {
    title,
    description,
    keywords: [
      "AI order taking",
      "automated phone orders",
      "voice order processing",
      "AI ordering system",
      "AI phone order bot for restaurants",
      "automated order taking voice",
      "AI order-to-cash automation",
      "pizza order phone bot",
      "voice-based order taking",
      "automated restaurant ordering",
      "AI order processing calls",
      "phone-based order automation",
      "AI call order processing",
      "voice order confirmation",
      "automated order fulfillment calls",
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

export default function AutomatedOrdersUseCasePage() {
  const faqs = [
    {
      question: "What types of orders can Hexa AI handle?",
      answer:
        "Hexa AI can take phone orders for products, services, deliveries, reorders, and other routine customer requests based on your configured ordering flow.",
    },
    {
      question: "Can Hexa AI follow our ordering script?",
      answer:
        "Yes. You can define the questions, rules, product options, required customer details, and confirmation steps Hexa AI should follow on every call.",
    },
    {
      question: "How does Hexa AI make sure an order is correct?",
      answer:
        "Before completing an order, Hexa AI confirms the selected items, quantities, customer details, and order summary with the caller.",
    },
    {
      question: "What happens when a customer has a complex request?",
      answer:
        "Hexa AI can smoothly transfer the call to a live team member when the request requires human support or falls outside the configured workflow.",
    },
    {
      question: "Can we track completed and abandoned orders?",
      answer:
        "Yes. You can review order outcomes, successful calls, drop-offs, transfers, and common customer requests to improve your ordering process.",
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
            name: "AI Order Taking",
            serviceType: "AI Voice Agents for Phone Order Processing",
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
        title="Automatic Ordering &amp; Reordering"
        description="Hexa AI offers advanced artificial intelligence solutions for automated ordering, inventory management, and data-driven business insights."
        image={{
          src: UseCaseAutomatedOrders,
          alt: "AI automated orders visualization",
          className: "mix-blend-multiply",
        }}
      />
      <UseCaseBenefits
        title="Automated Customer Order Processing System"
        items={[
          {
            icon: ShopingBagIcon,
            label: "Take customer orders automatically",
          },
          {
            icon: FileTextIcn,
            label: "Follow predefined ordering scripts and rules",
          },
          {
            icon: FolderIcon,
            label: "Confirm order details with customers",
          },
          {
            icon: CheckMarkIcon,
            label: "Verify and confirm quantities of each order",
          },
        ]}
      />
      <HowItWorksSection
        title="From call to confirmed order"
        subtitle="Take phone orders automatically, validate details, and route edge cases to your team."
        steps={[
          {
            title: "Define ordering scripts",
            description: "Define your ordering script, menu/items, and validation rules.",
            icon: <FolderOpen className="size-5" />,
          },
          {
            title: "Confirm order details",
            description: "Collect customer details and confirm the order summary on every call.",
            icon: <ShoppingCart className="size-5" />,
          },
          {
            title: "Escalate complex requests",
            description: "Route complex requests to a human when needed.",
            icon: <PhoneOutgoing className="size-5" />,
          },
          {
            title: "Improve conversion",
            description: "Improve conversion using transcripts and outcome analytics.",
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
