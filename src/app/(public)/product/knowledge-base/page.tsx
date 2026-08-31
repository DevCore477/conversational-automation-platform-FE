import KnowledgeHero from '../../components/product/knowledge-base/KnowledgeHero';
import HowItWorksSection from '../../components/sections/HowItWorksSection';
import FAQSection from '../../components/sections/FAQSection';
import { KnowledgeBaseLazySections } from '../../components/product/lazy-product-sections';
import { FolderOpen, PhoneOutgoing, Settings, UserCog } from 'lucide-react';

const title = "AI Knowledge Base & Smart Data Ingestion | Hexa-AI";
const description =
  "Equip your AI voice agents with an intelligent knowledge base. Upload documents, sync live data, and deliver accurate, context-aware customer answers.";
const url = "https://gethexa.ai/product/knowledge-base";
const ogImage = "/og-image.png";

export async function generateMetadata() {
  return {
    title,
    description,
    keywords: [
      "AI knowledge base",
      "voice agent knowledge base",
      "AI call answering",
      "smart data ingestion",
      "RAG-powered voice agents",
      "document-based AI answering",
      "voice agent training data",
      "real-time FAQ sync AI agents",
      "AI knowledge management for calls",
      "intelligent document retrieval voice",
      "AI contextual call answering",
      "voice bot knowledge system",
      "AI document integration calling",
      "smart information retrieval voice",
      "AI-powered call knowledge base",
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

const KnowledgeBasePage = () => {
    const faqs = [
        {
            question: "What is the Hexa AI Knowledge Base?",
            answer:
                "The Hexa AI Knowledge Base gives your AI agent access to approved business information, helping it provide accurate and consistent answers during customer conversations.",
        },
        {
            question: "What type of content can I add to the Knowledge Base?",
            answer:
                "You can add website pages, documents, files, and custom text content such as FAQs, policies, product details, service information, and internal guidelines.",
        },
        {
            question: "Can I upload multiple documents at once?",
            answer:
                "Yes. Hexa AI allows you to upload multiple documents together, making it easier to build and manage your agent’s knowledge in one place.",
        },
        {
            question: "Will my AI agent automatically use the Knowledge Base during calls?",
            answer:
                "Yes. Once you connect knowledge items to your agent, it can use that information automatically when answering relevant customer questions during calls.",
        },
        {
            question: "What happens if the AI does not have the right answer?",
            answer:
                "You can configure the agent to escalate the conversation, transfer the call to a human team member, or collect the customer’s details for a follow-up.",
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
                  name: "Hexa-AI Knowledge Base",
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
            <KnowledgeHero />
            <KnowledgeBaseLazySections />

            <HowItWorksSection
                title="From documents to accurate answers"
                subtitle="Ground your voice agents in approved content so every call stays consistent and reliable."
                steps={[
                    {
                        title: "Upload your content",
                        description: "Add FAQs, policies, product docs, and other reference materials.",
                        icon: <FolderOpen className="size-5.5" />,
                    },
                    {
                        title: "Connect live data",
                        description: "Sync structured data and keep answers aligned with your latest information.",
                        icon: <Settings className="size-5.5" />,
                    },
                    {
                        title: "Answer during calls",
                        description: "Voice agents use your knowledge base to respond accurately on every call.",
                        icon: <UserCog className="size-5.5" />,
                    },
                    {
                        title: "Escalate edge cases",
                        description: "Route uncertain or complex queries to humans with captured context.",
                        icon: <PhoneOutgoing className="size-5" />,
                    },
                ]}
            />

            <FAQSection faqs={faqs} />
        </div>
    );
};

export default KnowledgeBasePage;
