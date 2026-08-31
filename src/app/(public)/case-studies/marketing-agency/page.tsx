import { UseCaseSalesAndLeadGeneration, CsCallDashboard, CsWACampaign, CsAppointment, CsMetaTemplates } from "@/assets";

import {
  CaseStudyContent,
  CaseStudyTimelineSection,
  BulletList,
  Paragraph,
  StatGrid,
  SectionList,
} from "../components";

const title = "How Hexa Ai Transformed WhatsApp Marketing for Digital Agencies | Case Study";
const description =
  "Learn how a fast-growing digital marketing agency scaled WhatsApp campaigns 10x with Hexa Ai's automated campaigns, scripts, conversation flows, and AI agents.";
const url = "https://gethexa.ai/case-studies/marketing-agency";
const ogImage = "/og-image.png";

export async function generateMetadata() {
  return {
    title,
    description,
    keywords: [
      "Hexa AI case study",
      "WhatsApp marketing automation",
      "digital agency WhatsApp campaigns",
      "AI campaign management",
      "automated WhatsApp messaging",
      "marketing agency automation",
      "conversation flow automation",
      "lead generation WhatsApp",
      "WhatsApp business API campaigns",
      "bulk WhatsApp messaging platform",
      "AI chat automation for agencies",
      "WhatsApp customer engagement",
      "multichannel marketing automation",
      "WhatsApp CRM integration",
      "automated customer support WhatsApp",
      "WhatsApp chatbot for business",
      "campaign personalization AI",
      "audience segmentation WhatsApp",
      "conversational marketing platform",
      "WhatsApp re-engagement campaigns",
      "cart abandonment WhatsApp reminders",
      "appointment scheduling automation",
      "WhatsApp lead qualification",
      "marketing ROI optimization",
      "enterprise WhatsApp solution",
      "no-code WhatsApp automation",
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

export default function MarketingAgencyCaseStudyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CaseStudy",
            name: "How Hexa Ai Transformed WhatsApp Marketing for Digital Agencies",
            description,
            url,
            author: { "@type": "Organization", name: "Hexa-AI", url: "https://gethexa.ai" },
          }),
        }}
      />

      <CaseStudyContent
        hero={{
          title: "How Hexa Ai Transformed WhatsApp Marketing for Digital Agencies",
          description:
            "A fast-growing digital marketing agency scaled WhatsApp campaign capacity by 10x and reduced manual workload by 75% using Hexa Ai's intelligent automation platform.",
          image: {
            src: UseCaseSalesAndLeadGeneration,
            alt: "AI marketing and lead generation visualization",
            className: "mix-blend-multiply",
          },
        }}
        images={[
          { src: CsCallDashboard, alt: "WhatsApp campaigns dashboard", position: "start" },
          { src: CsMetaTemplates, alt: "WhatsApp template library", position: "start" },
          { src: CsWACampaign, alt: "WhatsApp campaign creation", position: "text-middle" },
          { src: CsAppointment, alt: "Meta WhatsApp template", position: "start" },
        ]}
      >
        {/* 1. Overview - Left */}
        <CaseStudyTimelineSection title="Overview" side="left">
          <Paragraph text="A fast-growing digital marketing agency struggled to manage WhatsApp campaigns for multiple clients at scale. Campaign execution was manual, time-consuming, and lacked personalization and automation. The agency partnered with Hexa Ai to automate WhatsApp communication using campaigns, scripts, conversation flows, and AI agents." />
          <div className="mt-3">
            <Paragraph text="The goal was to increase campaign efficiency, improve engagement, and reduce manual workload while maintaining personalized customer communication." />
          </div>
        </CaseStudyTimelineSection>

        {/* 2. Challenges - Right */}
        <CaseStudyTimelineSection title="Challenges Faced by the Agency" side="right">
          <Paragraph text="Before Hexa Ai, the agency faced:" />
          <div className="mt-2">
            <BulletList
              items={[
                "Manual WhatsApp messaging for each campaign",
                "Limited personalization across different client audiences",
                "No centralized system for managing campaigns",
                "Difficulty handling high-volume customer replies",
                "No automation for follow-ups, reminders, or responses",
                "High operational workload on marketing teams",
              ]}
            />
          </div>
          <div className="mt-4">
            <Paragraph text="Key Metrics Before Implementation:" />
          </div>
          <div className="mt-2">
            <BulletList
              items={[
                "~15–20 campaigns managed per month",
                "~60% manual effort in execution",
                "~20–25% message response rate",
                "Delayed follow-ups affecting conversions",
              ]}
            />
          </div>
        </CaseStudyTimelineSection>

        {/* 3. Solution - Left */}
        <CaseStudyTimelineSection title="Hexa Ai Solution" side="left">
          <Paragraph text="Hexa Ai introduced a fully automated WhatsApp marketing system powered by:" />
          <SectionList
            items={[
              { title: "1. Campaign Automation", text: "Bulk campaign creation for multiple clients with audience segmentation based on behavior, interests, and tags, along with scheduled and triggered campaigns." },
              { title: "2. Scripts (Predefined Messaging Logic)", text: "Pre-built message templates for different use cases with personalized dynamic variables (name, order, appointment, etc.) ensuring standardized messaging across all campaigns." },
              { title: "3. Conversation Flows", text: "Automated multi-step chat journeys with conditional logic that triggers specific flows based on user replies, enabling smart routing for leads, inquiries, or support." },
              { title: "4. AI Agents", text: "Intelligent response handling for incoming messages with FAQ automation (pricing, services, availability, etc.) and lead qualification with routing to sales teams." },
            ]}
          />
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
          <Paragraph text="After implementing Hexa Ai WhatsApp Automation:" />
          <div className="mt-3">
            <StatGrid
              items={[
                { value: "10X", label: "Increase in campaign execution capacity" },
                { value: "75%", label: "Reduction in manual workload" },
                { value: "68%", label: "Average message open rate improvement" },
                { value: "3.5X", label: "Increase in customer conversions" },
                { value: "90%", label: "Faster response time for customer queries" },
                { value: "50+", label: "Client campaigns managed simultaneously" },
              ]}
            />
          </div>
        </CaseStudyTimelineSection>

        {/* 7. Business Impact - Left */}
        <CaseStudyTimelineSection title="Business Impact" side="left">
          <BulletList
            items={[
              "Teams shifted from manual messaging to strategic campaign planning",
              "Improved client satisfaction due to faster campaign delivery",
              "Higher ROI on marketing campaigns",
              "Reduced dependency on large support/marketing teams",
              "Scalable system for managing multiple industries",
            ]}
          />
        </CaseStudyTimelineSection>

        {/* 8. Conclusion - Right */}
        <CaseStudyTimelineSection title="Conclusion" side="right">
          <Paragraph text="Hexa Ai transformed the way marketing agencies manage WhatsApp communication by introducing intelligent automation through campaigns, scripts, conversation flows, and AI agents. The platform enabled agencies to scale effortlessly while improving personalization, engagement, and overall marketing performance." />
        </CaseStudyTimelineSection>
      </CaseStudyContent>
    </>
  );
}
