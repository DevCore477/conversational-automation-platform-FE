import { UseCaseAutomatedOrders, CsRecentActivity, CsFoodOrderDetails, CsOrderConversationFlow, CsMakeACall } from "@/assets";

import {
  CaseStudyContent,
  CaseStudyTimelineSection,
  BulletList,
  Paragraph,
  StatGrid,
  SectionList,
} from "../components";

const title = "How HEXA AI Transformed Restaurant Order Management | Case Study";
const description =
  "Learn how a multi-branch restaurant chain reduced missed calls by 75% and improved order accuracy with HEXA AI's automated voice agents and conversation flows.";
const url = "https://gethexa.ai/case-studies/restaurant-order-management";
const ogImage = "/og-image.png";

export async function generateMetadata() {
  return {
    title,
    description,
    keywords: [
      "HEXA AI case study",
      "restaurant order management",
      "AI voice agent restaurant",
      "automated food ordering",
      "restaurant call handling",
      "AI restaurant phone system",
      "restaurant conversation flows",
      "order taking automation",
      "restaurant POS integration",
      "automated order processing",
      "restaurant kitchen integration",
      "24/7 restaurant ordering",
      "restaurant customer experience",
      "food ordering AI",
      "restaurant operational efficiency",
      "reduce missed orders restaurant",
      "restaurant script automation",
      "delivery order automation",
      "takeaway ordering AI",
      "restaurant call center automation",
      "menu recommendation AI",
      "restaurant peak hour management",
      "order accuracy improvement",
      "restaurant business automation",
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

export default function RestaurantOrderManagementCaseStudyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CaseStudy",
            name: "How HEXA AI Transformed Restaurant Order Management",
            description,
            url,
            author: { "@type": "Organization", name: "Hexa-AI", url: "https://gethexa.ai" },
          }),
        }}
      />

      <CaseStudyContent
        hero={{
          title: "How HEXA AI Transformed Restaurant Order Management",
          description:
            "A multi-branch restaurant chain reduced missed calls by 75% and improved order accuracy with HEXA AI's automated voice agents and conversation flows.",
          image: {
            src: UseCaseAutomatedOrders,
            alt: "AI automated ordering visualization",
            className: "mix-blend-multiply",
          },
        }}
        images={[
          { src: CsRecentActivity, alt: "Recent activity", position: "start" },
          { src: CsOrderConversationFlow, alt: "Conversation flow", position: "mid" },
          { src: CsFoodOrderDetails, alt: "Chat interface", position: "text-middle" },
          { src: CsMakeACall, alt: "Make a call", position: "mid" },
        ]}
      >
        {/* 1. Overview - Left */}
        <CaseStudyTimelineSection title="Overview" side="left">
          <Paragraph text="A busy multi-branch restaurant chain was struggling to manage a high volume of phone-based food orders during peak hours such as lunch and dinner. Most orders were taken manually by staff, which often led to missed calls, delayed responses, and order inaccuracies. This created pressure on both front-desk staff and kitchen operations, resulting in customer dissatisfaction and lost revenue." />
          <div className="mt-3">
            <Paragraph text="HEXA AI was implemented to automate restaurant order-taking using AI voice agents, structured scripts, and intelligent conversation flows tailored specifically for food ordering workflows." />
          </div>
        </CaseStudyTimelineSection>

        {/* 2. Challenges - Right */}
        <CaseStudyTimelineSection title="Challenges Faced by the Restaurant" side="right">
          <Paragraph text="The restaurant was receiving hundreds of daily calls for dine-in, takeaway, and delivery orders, especially during peak hours." />
          <div className="mt-2">
            <BulletList
              items={[
                "Many calls went unanswered due to high traffic, resulting in missed business opportunities",
                "20–35% of orders contained errors (incorrect items, wrong quantities, missing instructions)",
                "Staff overwhelmed handling calls while managing in-store customers and kitchen coordination",
                "No system to handle after-hours orders, limiting business availability",
              ]}
            />
          </div>
        </CaseStudyTimelineSection>

        {/* 3. Solution - Left */}
        <CaseStudyTimelineSection title="HEXA AI Solution" side="left">
          <Paragraph text="HEXA AI introduced a fully automated restaurant communication system powered by AI voice agents, predefined order scripts, and structured conversation flows for natural phone ordering." />
          <div className="mt-4">
            <SectionList
              items={[
                { title: "1. Automated Call-Based Ordering", text: "AI handles all incoming restaurant calls instantly, taking full orders, handling modifications, and confirming details without waiting for staff availability." },
                { title: "2. Smart Order Conversation Flows", text: "Predefined flows guide customers through menu selection, customizations (size, spice level, add-ons), delivery or pickup choice, and contact confirmation." },
                { title: "3. AI Agents with Restaurant-Specific Roles", text: "Specialized agents for order-taking, menu guidance, delivery coordination, and order status inquiries handle different stages of the customer journey." },
                { title: "4. Script-Based Automation", text: "Standardized scripts capture customer name, selected items, customizations, delivery instructions, and payment preference to reduce human error." },
                { title: "5. Real-Time Kitchen Integration", text: "Orders are instantly forwarded to the kitchen or POS system for preparation, reducing delays between order placement and execution." },
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
          <Paragraph text="After implementing HEXA AI, the restaurant achieved:" />
          <div className="mt-3">
            <StatGrid
              items={[
                { value: "75%", label: "Reduction in missed calls" },
                { value: "65%", label: "Decrease in manual order-taking workload" },
                { value: "50%", label: "Improvement in order processing speed" },
                { value: "85%", label: "Reduction in customer complaints" },
                { value: "24/7", label: "Order-taking capability" },
                { value: "+35%", label: "Increase in total order volume" },
              ]}
            />
          </div>
        </CaseStudyTimelineSection>

        {/* 6. Business Impact - Left */}
        <CaseStudyTimelineSection title="Business Impact" side="left">
          <BulletList
            items={[
              "Staff focused more on in-store customers and food preparation instead of phone calls",
              "Kitchen operations became more organized due to structured order flow",
              "Delivery execution became faster and more reliable",
              "Higher customer retention and increased repeat orders",
            ]}
          />
        </CaseStudyTimelineSection>

        {/* 7. Conclusion - Right */}
        <CaseStudyTimelineSection title="Conclusion" side="right">
          <Paragraph text="HEXA AI transformed restaurant order management into a fully automated, intelligent system capable of handling high-volume calls with speed and accuracy. By combining AI voice agents, scripts, and conversation flows, restaurants can eliminate missed orders, reduce operational pressure, and provide customers with a seamless ordering experience." />
          <div className="mt-3">
            <Paragraph text="This demonstrates how HEXA AI can modernize restaurant operations and scale food businesses efficiently without increasing staff workload." />
          </div>
        </CaseStudyTimelineSection>
      </CaseStudyContent>
    </>
  );
}
