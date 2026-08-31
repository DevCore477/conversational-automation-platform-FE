import BookAppointmentHero from "../../components/product/book-appointment/BookAppointmentHero";
import HowItWorksSection from "../../components/sections/HowItWorksSection";
import FAQSection from "../../components/sections/FAQSection";
import { BookAppointmentLazySections } from "../../components/product/lazy-product-sections";
import { CalendarClock, Info, PhoneOutgoing, RadioTower, Settings } from "lucide-react";

const title = "AI Appointment Booking & Automated Scheduling | Hexa-AI";
const description =
  "Automate appointment scheduling with human-like AI voice agents. Let your AI phone bot handle bookings, confirm availability, and sync live dashboard updates.";
const url = "https://gethexa.ai/product/book-appointment";
const ogImage = "/og-image.png";

export async function generateMetadata() {
  return {
    title,
    description,
    keywords: [
      "AI appointment booking",
      "automated scheduling",
      "AI voice scheduling",
      "automated call booking",
      "AI appointment scheduling software",
      "automated appointment confirmation",
      "voice agent scheduling",
      "AI calendar integration",
      "phone-based appointment booking",
      "conversational scheduling assistant",
      "AI appointment reminder calls",
      "automated booking system with AI",
      "intelligent appointment routing",
      "voice-activated scheduling",
      "AI booking confirmation",
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
      question: "Can Hexa AI book appointments over phone calls?",
      answer:
        "Yes. Hexa AI can speak with customers, check available time slots, collect required details, and confirm appointments automatically during a phone call.",
    },
    {
      question: "Can customers reschedule or cancel their appointments?",
      answer:
        "Yes. Hexa AI can help customers reschedule missed appointments, confirm upcoming bookings, or cancel appointments based on the rules you set.",
    },
    {
      question: "Can Hexa AI check calendar availability in real time?",
      answer:
        "Yes. Hexa AI can use appointment booking functions to check available slots and offer suitable options to customers before confirming a booking.",
    },
    {
      question: "What happens if a customer needs human assistance?",
      answer:
        "Hexa AI can transfer the call to a team member when the request is complex, urgent, or outside the configured booking flow.",
    },
    {
      question: "Can we track appointments created by Hexa AI?",
      answer:
        "Yes. You can view upcoming, past, cancelled, and unconfirmed appointments from the dashboard and use the insights to improve your booking flow.",
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
            name: "Hexa-AI Appointment Booking",
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
      <BookAppointmentHero />
      <BookAppointmentLazySections />

      <HowItWorksSection
        title="From call to confirmed booking"
        subtitle="Let AI voice agents handle scheduling conversations while your team focuses on complex cases."
        steps={[
          {
            title: "Configure scheduling rules",
            description:
              "Set availability, booking windows, and validation rules for your workflow.",
            icon: <Settings className="size-5.5" />,
          },
          {
            title: "Handle booking calls",
            description:
              "AI agents confirm availability, book slots, and collect required details.",
            icon: <CalendarClock className="size-5.5" />,
          },
          {
            title: "Escalate when needed",
            description:
              "Transfer calls to staff with context when appointments need human review.",
            icon: <PhoneOutgoing className="size-5" />,
          },
          {
            title: "Track outcomes",
            description:
              "Review transcripts and analytics to improve booking conversion.",
            icon: <RadioTower className="size-5" />,
          },
        ]}
      />

      <FAQSection faqs={faqs} />
    </div>
  );
};

export default BookAppointmentPage;
