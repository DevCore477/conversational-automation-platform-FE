import { UseCaseHealthCarePng, CsRecentActivity, CsCallDetails, CsAppointmentConversationFlow, CsMakeCall2 } from "@/assets";

import {
  CaseStudyContent,
  CaseStudyTimelineSection,
  BulletList,
  Paragraph,
  StatGrid,
  SectionList,
} from "../components";

const title = "How Hexa Ai Transformed Dental Clinic Operations | Case Study";
const description =
  "Learn how SmileCare Dental Clinic reduced missed calls by 70% and improved appointment scheduling with Hexa Ai's automated patient communication system.";
const url = "https://gethexa.ai/case-studies/dental-clinic";
const ogImage = "/og-image.png";

export async function generateMetadata() {
  return {
    title,
    description,
    keywords: [
      "Hexa AI case study",
      "dental clinic automation",
      "AI patient communication",
      "appointment scheduling AI",
      "healthcare voice automation",
      "dental clinic operations",
      "AI receptionist dental",
      "patient management automation",
      "dental practice management software",
      "AI phone assistant dental clinic",
      "automated appointment reminders",
      "24/7 patient support system",
      "dental office call handling",
      "AI triage assistant healthcare",
      "voice AI for medical offices",
      "reduce missed calls dental",
      "automated patient intake",
      "dental scheduling optimization",
      "healthcare conversational AI",
      "multidoctor practice automation",
      "emergency dental call routing",
      "follow-up automation healthcare",
      "dental front desk automation",
      "HIPAA compliant AI assistant",
      "medical call answering service AI",
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

export default function DentalClinicCaseStudyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CaseStudy",
            name: "How Hexa Ai Transformed Dental Clinic Operations",
            description,
            url,
            author: { "@type": "Organization", name: "Hexa-AI", url: "https://gethexa.ai" },
          }),
        }}
      />

      <CaseStudyContent
        hero={{
          title: "How Hexa Ai Transformed Dental Clinic Operations",
          description: "SmileCare Dental Clinic transformed its patient communication system into a fully automated, intelligent workflow using Hexa Ai's voice agents and automation.",
          image: {
            src: UseCaseHealthCarePng,
            alt: "AI healthcare and clinics visualization",
            className: "mix-blend-multiply",
          },
        }}
        images={[
          { src: CsRecentActivity, alt: "Call activity dashboard", position: "start" },
          { src: CsCallDetails, alt: "Call details interface", position: "mid" },
          { src: CsAppointmentConversationFlow, alt: "Appointment scheduling interface", position: "text-middle" },
          { src: CsMakeCall2, alt: "Make a call interface", position: "start" },
        ]}
      >
        {/* 1. Overview - Left */}
        <CaseStudyTimelineSection title="Overview" side="left">
          <Paragraph text="SmileCare Dental Clinic is a multi-doctor dental practice handling a high volume of patient inquiries, appointment bookings, follow-ups, and emergency calls every day. Before Hexa Ai, the clinic relied heavily on front-desk staff to manually manage calls and scheduling, leading to delays, missed appointments, and operational overload." />
          <div className="mt-3">
            <Paragraph text="Hexa Ai was implemented to automate patient communication, appointment management, and call handling using AI-powered voice agents, conversation flows, scripts, and automated call systems." />
          </div>
        </CaseStudyTimelineSection>

        {/* 2. Challenges - Right */}
        <CaseStudyTimelineSection title="Challenges Faced by the Clinic" side="right">
          <Paragraph text="Before implementing Hexa Ai, the clinic struggled with:" />
          <div className="mt-2">
            <BulletList
              items={[
                "200-350 incoming calls daily during peak hours",
                "Frequent missed calls due to busy reception staff",
                "25-30% missed or delayed appointment bookings",
                "Manual scheduling errors and double bookings",
                "High workload on front-desk staff",
                "Lack of 24/7 patient support",
              ]}
            />
          </div>
        </CaseStudyTimelineSection>

        {/* 3. Solution - Left */}
        <CaseStudyTimelineSection title="Hexa Ai Solution" side="left">
          <Paragraph text="Hexa Ai introduced an intelligent communication system built around automated voice agents, scripts, and conversation flows tailored for healthcare workflows." />
          <SectionList
            items={[
              { title: "1. Automated Call Handling", text: "AI answers inbound and outbound calls instantly, handling patient queries 24/7 without human intervention and significantly reducing dependency on front-desk staff." },
              { title: "2. Smart Conversation Flows", text: "Structured flows for booking appointments, cancelling appointments, rescheduling visits, and checking doctor availability through natural language interaction with patients." },
              { title: "3. AI Agents with Predefined Use Cases", text: "Purpose-built agents for appointment scheduling, emergency triage assistance, clinic information queries, and follow-up reminders, each trained to handle its domain with accuracy." },
              { title: "4. Script-Based Automation", text: "Consistent patient communication with accurate data collection (name, symptoms, preferred time) that reduces human error during calls." },
              { title: "5. Real-Time Scheduling Integration", text: "Syncs with doctor availability calendar to prevent double booking and auto-confirms appointments via call or message." },
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

        {/* 5. Results & Impact - Left */}
        <CaseStudyTimelineSection title="Results & Impact" side="left">
          <Paragraph text="After implementing Hexa Ai, the clinic observed significant improvements:" />
          <div className="mt-3">
            <StatGrid
              items={[
                { value: "70%", label: "Reduction in missed calls" },
                { value: "60%", label: "Decrease in front-desk workload" },
                { value: "40%", label: "Faster appointment scheduling" },
                { value: "90%", label: "Improvement in response time" },
                { value: "24/7", label: "Patient support availability" },
                { value: "+35%", label: "Increase in appointment completion" },
              ]}
            />
          </div>
        </CaseStudyTimelineSection>

        {/* 6. Business Impact - Right */}
        <CaseStudyTimelineSection title="Business Impact" side="right">
          <BulletList
            items={[
              "Front-desk staff shifted from repetitive calling tasks to patient care support",
              "Doctors experienced smoother scheduling with fewer disruptions",
              "Patients received instant responses and confirmations",
              "Overall operational efficiency improved significantly",
            ]}
          />
        </CaseStudyTimelineSection>

        {/* 7. Conclusion - Left */}
        <CaseStudyTimelineSection title="Conclusion" side="left">
          <Paragraph text="Hexa Ai enabled SmileCare Dental Clinic to transform its patient communication system into a fully automated, intelligent workflow. By combining AI voice agents, scripts, conversation flows, and automation, the clinic reduced workload, improved patient experience, and significantly increased operational efficiency." />
          <div className="mt-3">
            <Paragraph text="This case study demonstrates how Hexa Ai can modernize healthcare communication systems and eliminate inefficiencies in appointment management." />
          </div>
        </CaseStudyTimelineSection>
      </CaseStudyContent>
    </>
  );
}