import DemoSection from "../../components/sections/DemoSection";
import HowItWorksSection from "../../components/sections/HowItWorksSection";
import FAQSection from "../../components/sections/FAQSection";
import { UseCaseBenefits, UseCaseHero } from "../components";
import {
  CalendarTimeIcon,
  OutgoingCall,
  UseCaseEducationAndTraining,
  CallingIcon,
  SettingIcon,
} from "@/assets";
import LazyUseCaseTestimonials from "../components/LazyUseCaseTestimonials";
import { CalendarClock, FileText, PhoneCall, RadioTower } from "lucide-react";

const title = "AI Education Assistants & Automated Student Calling | Hexa-AI";
const description =
  "Automate student outreach with smart AI voice agents. Run custom scripts for enrollment follow-ups, fee reminders, and track stats on your live dashboard.";
const url = "https://gethexa.ai/use-cases/education";
const ogImage = "/og-image.png";

export async function generateMetadata() {
  return {
    title,
    description,
    keywords: [
      "AI education assistant",
      "automated student calling",
      "AI enrollment calls",
      "student outreach automation",
      "AI enrollment follow-up calls",
      "student debt collection automation",
      "admission confirmation calls",
      "educational institution AI calling",
      "automated parent notifications",
      "AI student engagement platform",
      "school AI call system",
      "automated university outreach",
      "AI tutoring center scheduling",
      "education automated notifications",
      "voice-based student communications",
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

export default function EducationAndTrainingPlatformsUseCasePage() {
  const faqs = [
    {
      question: "How can Hexa AI support educational institutions?",
      answer:
        "Hexa AI can handle calls from students, parents, and applicants by answering common questions, sharing admission details, collecting inquiries, and directing callers to the right department.",
    },
    {
      question: "Can Hexa AI provide admission and course information?",
      answer:
        "Yes. Hexa AI can share approved information about available programs, admission requirements, fees, deadlines, class timings, and enrollment processes.",
    },
    {
      question: "Can Hexa AI schedule counseling or admission appointments?",
      answer:
        "Yes. It can help students or parents book counseling sessions, campus visits, teacher meetings, or admission consultations based on available time slots.",
    },
    {
      question: "Can Hexa AI answer parent and student queries?",
      answer:
        "Yes. Hexa AI can respond to common questions about classes, schedules, attendance, course details, events, support services, and school policies.",
    },
    {
      question: "Can Hexa AI transfer calls to teachers or staff members?",
      answer:
        "Yes. When a caller needs more detailed support, Hexa AI can transfer the call to admissions staff, teachers, administration, finance, or another relevant department.",
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
            name: "AI Education Assistants",
            serviceType: "AI Voice Agents for Education & Training Outreach",
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
        title="Education &amp; Training Platforms"
        description="AI platform that provide comprehensive courses and hands-on training to empower learners in mastering artificial intelligence technologies."
        image={{
          src: UseCaseEducationAndTraining,
          alt: "AI education and training platforms visualization",
          className: "mix-blend-multiply",
        }}
      />
      <UseCaseBenefits
        title="Benefits of Hexa AI in Education &amp; Training Platforms"
        items={[
          {
            icon: OutgoingCall,
            label: "Answer questions related to courses",
          },
          {
            icon: SettingIcon,
            label: "Guide enrolment process step-by-step to users",
          },
          {
            icon: CallingIcon,
            label: "Automated follow-ups for confirmation & deadlines",
          },
          {
            icon: CalendarTimeIcon,
            label: "Help with schedules and materials",
          },
        ]}
      />
      <HowItWorksSection
        title="From inquiry to enrollment"
        subtitle="Automate student outreach, answer program questions, and schedule advisor calls at scale."
        steps={[
          {
            title: "Define outreach scripts",
            description: "Define outreach scripts for admissions, reminders, and scheduling.",
            icon: <FileText className="size-5" />,
          },
          {
            title: "Answer program questions",
            description: "Answer program questions using a structured knowledge base.",
            icon: <PhoneCall className="size-5" />,
          },
          {
            title: "Book advisor calls",
            description: "Book advisor calls or route complex cases to staff.",
            icon: <CalendarClock className="size-5" />,
          },
          {
            title: "Improve with insights",
            description: "Improve performance with post-call insights and QA.",
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
