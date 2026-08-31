import { CsCourierConversationFlow, CsCourierOrderDetails, CsDashboard, CsMakeACall, UseCaseDelivery,  } from "@/assets";

import {
  CaseStudyContent,
  CaseStudyTimelineSection,
  BulletList,
  Paragraph,
  StatGrid,
  SectionList,
} from "../components";

const title = "How HEXA AI Transformed Courier & Logistics Operations | Case Study";
const description =
  "Learn how a fast-growing courier company reduced support call volume by 75% and improved response time by 60% with HEXA AI's automated voice agents and tracking integrations.";
const url = "https://gethexa.ai/case-studies/courier-logistics";
const ogImage = "/og-image.png";

export async function generateMetadata() {
  return {
    title,
    description,
    keywords: [
      "HEXA AI case study",
      "courier logistics automation",
      "AI voice agent logistics",
      "automated parcel tracking",
      "logistics customer support AI",
      "parcel inquiry automation",
      "delivery management AI",
      "courier conversation flows",
      "logistics script automation",
      "real-time tracking integration",
      "delivery rescheduling AI",
      "pickup scheduling automation",
      "missed delivery resolution",
      "logistics call center automation",
      "24/7 parcel support",
      "courier company automation",
      "delivery notification automation",
      "logistics operational efficiency",
      "parcel status updates AI",
      "failed delivery automation",
      "address correction AI",
      "courier customer experience",
      "logistics AI agents",
      "shipment tracking automation",
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

export default function CourierLogisticsCaseStudyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CaseStudy",
            name: "How HEXA AI Transformed Courier & Logistics Operations",
            description,
            url,
            author: { "@type": "Organization", name: "Hexa-AI", url: "https://gethexa.ai" },
          }),
        }}
      />

      <CaseStudyContent
        hero={{
          title: "How HEXA AI Transformed Courier & Logistics Operations",
          description:
            "A fast-growing courier company reduced support call volume by 75% and improved response time by 60% with HEXA AI's automated voice agents and real-time tracking integrations.",
          image: {
            src: UseCaseDelivery,
            alt: "AI delivery and logistics automation visualization",
            className: "mix-blend-multiply",
          },
        }}
        images={[
          { src: CsDashboard, alt: "Call activity", position: "start" },
          { src: CsCourierOrderDetails, alt: "Conversation flow", position: "mid" },
          { src: CsMakeACall, alt: "Chat interface", position: "text-middle" },
          { src: CsCourierOrderDetails, alt: "Make a call", position: "mid" },
        ]}
      >
        {/* 1. Overview - Left */}
        <CaseStudyTimelineSection title="Overview" side="left">
          <Paragraph text="A fast-growing courier and logistics company was struggling to manage a rapidly increasing volume of customer inquiries related to parcel tracking, delivery status, pickup scheduling, and failed deliveries. Most of these requests were handled manually by call center agents, leading to long waiting times, inconsistent updates, and overloaded support teams." />
          <div className="mt-3">
            <Paragraph text="HEXA AI was implemented to automate customer communication using AI voice agents, automated calls, scripts, and structured conversation flows designed specifically for logistics and courier operations." />
          </div>
        </CaseStudyTimelineSection>

        {/* 2. Challenges - Right */}
        <CaseStudyTimelineSection title="Challenges Faced by the Courier Company" side="right">
          <Paragraph text="The company was handling thousands of daily customer calls and messages asking for parcel tracking updates, delivery time confirmations, address changes, and missed delivery resolutions." />
          <div className="mt-2">
            <BulletList
              items={[
                "Nearly 40–50% of inquiries were repetitive but still required manual responses",
                "Customers experienced delays in delivery updates, especially during peak shipment periods",
                "Failed deliveries required manual follow-ups, slowing down re-attempt scheduling",
                "Support team struggled with high workload and limited 24/7 availability",
                "Poor customer satisfaction and increased complaint volume",
              ]}
            />
          </div>
        </CaseStudyTimelineSection>

        {/* 3. Solution - Left */}
        <CaseStudyTimelineSection title="HEXA AI Solution" side="left">
          <Paragraph text="HEXA AI introduced an intelligent logistics communication system powered by automated voice agents, predefined scripts, and structured conversation flows for real-time parcel management." />
          <div className="mt-4">
            <SectionList
              items={[
                { title: "1. Automated Parcel Inquiry Handling", text: "AI answers inbound calls instantly, providing parcel status updates, delivery estimates, and location info using integrated tracking systems without waiting for support agents." },
                { title: "2. Smart Logistics Conversation Flows", text: "Predefined flows guide customers through parcel tracking, address changes, delivery rescheduling, missed delivery reporting, and pickup requests." },
                { title: "3. AI Agents with Courier-Specific Roles", text: "Specialized agents for parcel tracking, delivery scheduling, pickup coordination, and complaint handling manage each stage of the delivery lifecycle." },
                { title: "4. Script-Based Automation", text: "Standardized scripts capture tracking ID, delivery address, recipient info, preferred time, and issue type to eliminate manual entry errors." },
                { title: "5. Real-Time Tracking Integration", text: "Integration with courier tracking and logistics systems provides instant, accurate parcel location, delivery status, and arrival time updates." },
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
          <Paragraph text="After implementation, the courier company achieved:" />
          <div className="mt-3">
            <StatGrid
              items={[
                { value: "75%", label: "Reduction in support call volume" },
                { value: "60%", label: "Improvement in response time" },
                { value: "45%", label: "Decrease in failed delivery resolution time" },
                { value: "65%+", label: "Repetitive tracking inquiries automated" },
                { value: "24/7", label: "Automated support for parcel queries" },
                { value: "↑", label: "Customer satisfaction scores improved" },
              ]}
            />
          </div>
        </CaseStudyTimelineSection>

        {/* 6. Business Impact - Left */}
        <CaseStudyTimelineSection title="Business Impact" side="left">
          <BulletList
            items={[
              "Support teams freed from repetitive tracking requests to focus on complex logistics issues",
              "Delivery operations became more efficient due to faster coordination",
              "Operational costs decreased while service quality improved",
              "Customer trust and delivery transparency significantly improved",
            ]}
          />
        </CaseStudyTimelineSection>

        {/* 7. Conclusion - Right */}
        <CaseStudyTimelineSection title="Conclusion" side="right">
          <Paragraph text="HEXA AI transformed courier and logistics communication into a fully automated, real-time intelligence system. By combining AI voice agents, scripts, conversation flows, and live tracking integrations, courier companies can eliminate manual workload, improve delivery transparency, and provide customers with instant, accurate parcel updates." />
          <div className="mt-3">
            <Paragraph text="This demonstrates how HEXA AI can modernize logistics operations and scale customer support without increasing headcount." />
          </div>
        </CaseStudyTimelineSection>
      </CaseStudyContent>
    </>
  );
}
