import HowItWorksSection from "../../components/sections/HowItWorksSection";
import FAQSection from "../../components/sections/FAQSection";
import PostHero from "../../components/product/post-call-analysis/PostHero";
import { PostCallAnalysisLazySections } from "../../components/product/lazy-product-sections";
import { Atom, FolderOpen, Info, RadioTower, } from "lucide-react";

const title =
  "AI Post-Call Analysis | Conversation Insights & Analytics | Hexa AI";
const description =
  "Analyze every AI call with Hexa's post-call analysis. Get transcripts, summaries, sentiment data, and actionable insights from every voice conversation.";
const url = "https://gethexa.ai/product/post-call-analysis";
const ogImage = "/og-image.png";

export async function generateMetadata() {
  return {
    title,
    description,
    keywords: [
      "AI post-call analysis",
      "call analytics",
      "conversation insights",
      "call sentiment analysis",
      "post-call AI summaries",
      "automated call insights for sales teams",
      "AI conversation quality scoring",
      "AI-powered call QA",
      "automated call scoring",
      "call transcription analysis",
      "voice call analytics platform",
      "call outcome analysis AI",
      "conversational analytics",
      "call intelligence software",
      "AI call review automation",
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
      question: "What is Post-Call Analysis in Hexa AI?",
      answer:
        "Post-Call Analysis automatically reviews completed customer calls and turns them into useful insights such as summaries, sentiment, key discussion points, and call outcomes.",
    },
    {
      question: "What information can Hexa AI extract from a call?",
      answer:
        "You can extract custom information such as customer names, email addresses, intent, issue type, resolution status, action items, transaction values, satisfaction level, and more.",
    },
    {
      question: "Can I create custom analysis fields?",
      answer:
        "Yes. Hexa AI lets you create custom analysis categories using Boolean, Text, Number, or Selector fields based on the information your business needs from each call.",
    },
    {
      question: "Can Post-Call Analysis help with QA and team coaching?",
      answer:
        "Yes. It helps managers review call quality, identify common issues, understand customer sentiment, and improve agent performance without manually listening to every call.",
    },
    {
      question: "Can I send post-call insights to other systems?",
      answer:
        "Yes. You can access analysis results from the Hexa AI dashboard or connect them to your workflows and external systems through APIs or webhooks.",
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
            name: "Hexa-AI Post-Call Analysis",
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
      <PostHero />
      <PostCallAnalysisLazySections />

      <HowItWorksSection
        title="From call recording to actionable insights"
        subtitle="Turn every conversation into transcripts, summaries, and metrics your team can act on."
        steps={[
          {
            title: "Capture every call",
            description:
              "Automatically record transcripts and metadata for each voice interaction.",
            icon: <FolderOpen className="size-5.5" />,
          },
          {
            title: "Generate summaries",
            description:
              "Get AI summaries and key takeaways without manual note-taking.",
            icon: <Atom className="size-5.5" />,
          },
          {
            title: "Analyze sentiment",
            description: "Understand caller sentiment and identify friction in your scripts.",
            icon: <RadioTower className="size-5" />,
          },
          {
            title: "Improve workflows",
            description: "Use insights to optimize scripts, routing, and team performance.",
             icon: <Info className="size-5.5" />,
          },
        ]}
      />

      <FAQSection faqs={faqs} />
    </div>
  );
};

export default BookAppointmentPage;
