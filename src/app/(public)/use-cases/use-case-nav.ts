/** Use case titles as shown in nav — add href when the page exists */
export type UseCaseNavItem = { title: string; href: string | null; description?: string };

export const USE_CASE_NAV_ITEMS: UseCaseNavItem[] = [
  {
    title: "AI Receptionist",
    href: "/use-cases/receptionist",
    description: "Hexa AI acts as a smart virtual receptionist, handling incoming calls, scheduling appointments, and providing instant responses to customer inquiries 24/7.",
  },
  {
    title: "Automated Customer Feedback",
    href: "/use-cases/customer-feedback",
    description: "Automate collection and analysis of customer feedback through intelligent voice interactions, helping businesses improve their services based on real insights.",
  },
  {
    title: "Automatic Ordering & Reordering",
    href: "/use-cases/automated-orders",
    description: "Streamline order processing with AI that handles placements, confirmations, and automatic reordering based on customer preferences and inventory levels.",
  },
  {
    title: "Customer Support & Call Centers",
    href: "/use-cases/customer-support",
    description: "Enhance customer support with AI agents that handle common inquiries, route complex issues to human agents, and provide instant solutions around the clock.",
  },
  {
    title: "Healthcare & Clinics",
    href: "/use-cases/healthcare",
    description: "Hexa-AI agents are capable of managing appointment scheduling, answering patient inquiries, providing health information, and streamlining communication between patients and healthcare providers.",
  },
  {
    title: "Sales & Lead Generation",
    href: "/use-cases/sales",
    description: "Boost sales pipeline with AI-powered lead qualification, follow-ups, and personalized outreach that converts prospects into customers efficiently.",
  },
  {
    title: "Banking & Financial Services",
    href: "/use-cases/banking",
    description: "Transform banking operations with AI handling account inquiries, transaction disputes, loan applications, and personalized financial advice securely.",
  },
  {
    title: "Real Estate",
    href: "/use-cases/real-estate",
    description: "Revolutionize property dealings with AI assistants that handle property inquiries, schedule viewings, and qualify leads while you focus on closing deals.",
  },
  {
    title: "Logistics & Delivery Services",
    href: "/use-cases/logistics",
    description: "Advanced AI-driven logistics and delivery services optimizing routes, tracking, and efficiency for seamless supply chain management.",
  },
  {
    title: "Education & Training Platforms",
    href: "/use-cases/education",
    description: "Enhance learning experiences with AI tutors that provide personalized instruction, answer questions, and support students throughout their educational journey.",
  },
];

export const USE_CASE_FIRST_COLUMN = USE_CASE_NAV_ITEMS.slice(0, 6);
export const USE_CASE_SECOND_COLUMN = USE_CASE_NAV_ITEMS.slice(6);
