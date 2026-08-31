import { UseCaseBanking, CsDashboard, CsBankingConversationFlow, CsBankingOrderDetails, CsMakeACall } from "@/assets";

import {
  CaseStudyContent,
  CaseStudyTimelineSection,
  BulletList,
  Paragraph,
  SectionList,
  StatGrid,
} from "../components";

const title = "How HEXA AI Transformed Customer Communication in Banking & Finance | Case Study";
const description =
  "Learn how a mid-sized banking institution reduced call center workload by 65% and improved query resolution speed by 70% using HEXA AI's automated voice agents and conversation flows.";
const url = "https://gethexa.ai/case-studies/banking-finance";
const ogImage = "/og-image.png";

export async function generateMetadata() {
  return {
    title,
    description,
    keywords: [
      "HEXA AI case study",
      "banking customer communication",
      "AI voice agent banking",
      "financial services automation",
      "automated call handling banking",
      "banking conversation flows",
      "AI customer support banking",
      "banking compliance automation",
      "card services automation",
      "loan inquiry automation",
      "fraud reporting AI",
      "real-time banking integration",
      "banking call center automation",
      "customer service AI banking",
      "24/7 banking support",
      "secure banking AI communication",
      "banking operational efficiency",
      "financial institution automation",
      "routine query automation banking",
      "banking script automation",
      "account balance inquiry automation",
      "transaction dispute handling AI",
      "EMI reminder automation",
      "branch information automation",
      "AI banking communication platform",
    ],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Hexa-AI",
      locale: "en_US",
      url,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default function BankingFinanceCaseStudyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CaseStudy",
            name: "How HEXA AI Transformed Customer Communication in Banking & Finance",
            description,
            url,
            author: { "@type": "Organization", name: "Hexa-AI", url: "https://gethexa.ai" },
          }),
        }}
      />

      <CaseStudyContent
        hero={{
          title: "How HEXA AI Transformed Customer Communication in Banking & Finance",
          description:
            "A mid-sized banking institution reduced call center workload by 65% and improved query resolution speed by 70% using HEXA AI's automated voice agents and conversation flows.",
          image: {
            src: UseCaseBanking,
            alt: "AI banking and finance automation visualization",
            className: "mix-blend-multiply",
          },
        }}
        images={[
          { src: CsDashboard, alt: "Call activity", position: "start" },
          { src: CsBankingConversationFlow, alt: "Conversation flow", position: "mid" },
          { src: CsMakeACall, alt: "Chat interface", position: "text-middle" },
          { src: CsBankingOrderDetails, alt: "Make a call", position: "mid" },
        ]}
      >
        {/* 1. Overview - Left */}
        <CaseStudyTimelineSection title="Overview" side="left">
          <Paragraph text="A mid-sized banking and financial institution was facing increasing customer service pressure due to high volumes of inbound calls related to account queries, card services, loan updates, and transaction issues. Most interactions were handled manually by call center agents, leading to long wait times, inconsistent responses, and operational inefficiencies." />
          <div className="mt-3">
            <Paragraph text="HEXA AI was implemented to automate customer communication using AI-powered voice agents, scripted conversations, automated call systems, and structured conversation flows designed specifically for banking workflows." />
          </div>
        </CaseStudyTimelineSection>

        {/* 2. Challenges - Right */}
        <CaseStudyTimelineSection title="Challenges Faced by the Bank" side="right">
          <Paragraph text="The bank was receiving thousands of daily customer calls regarding account balances, card blocking, loan status, and transaction disputes. During peak hours, customers experienced long wait times or call drops due to overloaded agents." />
          <div className="mt-2">
            <BulletList
              items={[
                "30–40% of queries were repetitive but still required human intervention",
                "Lack of 24/7 availability for critical services like card blocking or fraud reporting",
                "Manual verification and routing processes caused delays in resolving issues",
                "High operational costs due to overloaded call center teams",
                "Inconsistent customer experience across different agents",
              ]}
            />
          </div>
        </CaseStudyTimelineSection>

        {/* 3. Solution - Left */}
        <CaseStudyTimelineSection title="HEXA AI Solution" side="left">
          <Paragraph text="HEXA AI introduced an intelligent banking communication layer powered by automated voice agents, predefined scripts, and structured conversation flows designed to handle high-volume financial queries securely." />
          <div className="mt-4">
            <SectionList
              items={[
                { title: "1. Automated Call Handling", text: "AI handles inbound and outbound banking calls instantly, managing balance inquiries, transaction status, card blocking, and loan updates without human involvement." },
                { title: "2. Smart Conversation Flows", text: "Predefined flows guide customers through account checks, lost card reporting, loan applications, and payment tracking with secure identity verification at each step." },
                { title: "3. AI Agents with Financial Use Cases", text: "Specialized agents for customer support, card services, loan inquiries, and fraud reporting, each trained with banking-specific logic for accurate compliance." },
                { title: "4. Script-Based Automation", text: "Standardized scripts handle identity verification, required disclosures, and structured data collection to reduce human error and ensure compliance." },
                { title: "5. Real-Time Integration", text: "Integration with core banking systems fetches real-time account data, transaction history, and loan status for instant accurate responses." },
              ]}
            />
          </div>
        </CaseStudyTimelineSection>

        {/* 4. Predefined Use Cases - Right */}
        <CaseStudyTimelineSection title="Predefined Use Cases" side="right">
          <Paragraph text="Hexa Ai provided ready-to-use WhatsApp automation workflows such as:" />
          <SectionList
            items={[
              { title: "1. Promotional Campaigns", text: "Product launches, discount offers, and seasonal sales campaigns delivered through automated WhatsApp messaging." },
              { title: "2. Lead Generation Campaigns", text: "Automated welcome messages with lead qualification flows and appointment booking prompts to capture and convert prospects." },
              { title: "3. Customer Support Automation", text: "Instant FAQ responses, order and status inquiry handling, with seamless escalation to human agents when needed." },
              { title: "4. Appointment Scheduling (Clinics & Services)", text: "Book, reschedule, or cancel appointments with real-time availability checks and automated confirmation and reminder messages." },
              { title: "5. Re-engagement Campaigns", text: "Win-back inactive customers, cart abandonment reminders, and follow-up messages designed to drive conversions." },
            ]}
          />
        </CaseStudyTimelineSection>

        {/* 5. Results & Impact - Right */}
        <CaseStudyTimelineSection title="Results & Impact" side="right">
          <Paragraph text="After implementing HEXA AI, the banking institution achieved:" />
          <div className="mt-3">
            <StatGrid
              items={[
                { value: "65%", label: "Reduction in call center workload" },
                { value: "70%", label: "Improvement in query resolution speed" },
                { value: "90%", label: "Increase in response time efficiency" },
                { value: "60%+", label: "Routine query automation coverage" },
                { value: "24/7", label: "Customer support availability" },
                { value: "40%", label: "Reduction in operational costs" },
              ]}
            />
          </div>
        </CaseStudyTimelineSection>

        {/* 6. Business Impact - Left */}
        <CaseStudyTimelineSection title="Business Impact" side="left">
          <BulletList
            items={[
              "Customer support teams shifted focus from repetitive queries to complex financial cases",
              "Operational costs decreased due to reduced call handling volume",
              "Customer experience improved through instant responses and reduced waiting times",
              "Service reliability strengthened with uninterrupted support for critical banking functions",
            ]}
          />
        </CaseStudyTimelineSection>

        {/* 7. Conclusion - Right */}
        <CaseStudyTimelineSection title="Conclusion" side="right">
          <Paragraph text="HEXA AI transformed the banking customer support system into a fully automated, intelligent communication platform. By combining AI voice agents, scripts, conversation flows, and automated call handling, the bank achieved faster resolution times, reduced operational load, and improved customer trust." />
          <div className="mt-3">
            <Paragraph text="This case study demonstrates how HEXA AI can modernize banking and financial communication systems while maintaining scalability, compliance, and efficiency." />
          </div>
        </CaseStudyTimelineSection>
      </CaseStudyContent>
    </>
  );
}
