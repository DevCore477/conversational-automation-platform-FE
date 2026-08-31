import DemoSection from "../../components/sections/DemoSection";
import HowItWorksSection from "../../components/sections/HowItWorksSection";
import FAQSection from "../../components/sections/FAQSection";
import { UseCaseBenefits, UseCaseHero } from "../components";
import {
  UseCaseHealthCare,
  UseCaseHealthCarePng,
  EmergancyCall,
  UserSupportBlue,
  ClockIcon,
  CallBackIcon,
  Signals,
} from "@/assets";
import LazyUseCaseTestimonials from "../components/LazyUseCaseTestimonials";
import { ClockAlert, PhoneCall, PhoneIncoming, RadioTower } from "lucide-react";

const title = "AI Healthcare Assistants & Automated Patient Calling | Hexa-AI";
const description =
  "Automate patient outreach with secure AI voice agents. Run custom scripts for appointment reminders, care check-ins, and update your live dashboard.";
const url = "https://gethexa.ai/use-cases/healthcare";
const ogImage = "/og-image.png";

export async function generateMetadata() {
  return {
    title,
    description,
    keywords: [
      "AI healthcare assistant",
      "automated patient calling",
      "AI appointment reminders",
      "patient outreach automation",
      "HIPAA-compliant patient calling",
      "appointment reminder voice automation",
      "automated prescription refill calls",
      "AI patient engagement platform",
      "secure healthcare voice calls",
      "AI medical appointment scheduling",
      "automated patient notifications",
      "HIPAA-secure AI calling",
      "voice-based patient outreach",
      "AI healthcare call automation",
      "patient care call automation",
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

export default function HealthcareAndClinicsUseCasePage() {
  const faqs = [
    {
      question: "Can Hexa AI send appointment reminder calls?",
      answer:
        "Yes. Hexa AI can automatically call patients with appointment reminders, helping clinics reduce missed appointments and keep schedules organized.",
    },
    {
      question: "Can patients book, confirm, or reschedule appointments by phone?",
      answer:
        "Yes. Patients can speak naturally with Hexa AI to book a new appointment, confirm an existing one, or request a suitable time to reschedule.",
    },
    {
      question: "Can Hexa AI answer common clinic questions?",
      answer:
        "Yes. Hexa AI can answer approved questions about clinic hours, locations, services, appointment preparation, required documents, and general service information.",
    },
    {
      question: "Can Hexa AI provide medical advice or diagnose patients?",
      answer:
        "No. Hexa AI is designed to support communication and administrative workflows. For medical concerns, urgent questions, or sensitive cases, it can route the call to the appropriate clinic staff member.",
    },
    {
      question: "What happens when a patient needs to speak with a staff member?",
      answer:
        "Hexa AI can transfer the call to the right receptionist, care coordinator, department, or healthcare professional based on the clinic's configured escalation process.",
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
            name: "AI Healthcare Assistants",
            serviceType: "AI Voice Agents for Healthcare & Clinics",
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
        title="Healthcare &amp; Clinics"
        description="Hexa-AI agents are capable of managing appointment scheduling, answering patient inquiries, providing health information, and streamlining communication between patients and healthcare providers."
        image={{
          src: UseCaseHealthCarePng,
          alt: "AI healthcare and clinics visualization",
          className: "mix-blend-multiply",
        }}
      />
      <UseCaseBenefits
        title="Benefits of Hexa AI in Healthcare &amp; Clinics"
        items={[
          {
            icon: EmergancyCall,
            label: "Book, confirm, or reschedule appointments",
          },
          {
            icon: UserSupportBlue,
            label: "Answer basic health or service-related questions",
          },
          {
            icon: ClockIcon,
            label: "Share clinic timings and instructions",
          },
          {
            icon: CallBackIcon,
            label: "Provide extra info and support as needed",
          },
        ]}
      />
      <HowItWorksSection
        title="From reminder call to better care"
        subtitle="Automate patient outreach, scheduling, and FAQs while escalating sensitive cases to staff."
        steps={[
          {
            title: "Define reminder scripts",
            description: "Define appointment reminder and scheduling scripts for your clinic.",
            icon: <ClockAlert className="size-5.5" />,
          },
          {
            title: "Answer patient FAQs",
            description: "Answer common patient questions with a knowledge base.",
            icon: <PhoneCall className="size-5.5" />,
          },
          {
            title: "Book or reschedule",
            description: "Book or reschedule appointments and escalate when needed.",
            icon: <PhoneIncoming className="size-5" />,
          },
          {
            title: "Improve patient experience",
            description: "Use call analytics to improve patient experience over time.",
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
