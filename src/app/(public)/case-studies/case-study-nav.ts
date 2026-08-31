/** Case study titles as shown in nav — add href when the page exists */
export type CaseStudyNavItem = { title: string; href: string | null; description?: string };

export const CASE_STUDY_NAV_ITEMS: CaseStudyNavItem[] = [
  {
    title: "Dental Clinic Operations",
    href: "/case-studies/dental-clinic",
    description: "How HEXA AI transformed SmileCare Dental Clinic operations with automated patient communication and appointment management.",
  },
  {
    title: "Marketing Agency WhatsApp Automation",
    href: "/case-studies/marketing-agency",
    description: "How HEXA AI helped a digital marketing agency scale WhatsApp campaigns 10x with automated messaging and AI agents.",
  },
  {
    title: "Banking & Finance Customer Communication",
    href: "/case-studies/banking-finance",
    description: "How HEXA AI helped a banking institution reduce call center workloads by 65% with AI-powered voice agents and automation.",
  },
  {
    title: "Restaurant Order Management",
    href: "/case-studies/restaurant-order-management",
    description: "How HEXA AI helped a restaurant chain reduce missed calls by 75% and improve order accuracy with AI voice agents.",
  },
  {
    title: "Courier & Logistics Operations",
    href: "/case-studies/courier-logistics",
    description: "How HEXA AI helped a courier company reduce support call volume by 75% with automated voice agents and real-time tracking.",
  },
];

export const CASE_STUDY_FIRST_COLUMN = CASE_STUDY_NAV_ITEMS.slice(0, 2);
export const CASE_STUDY_SECOND_COLUMN = CASE_STUDY_NAV_ITEMS.slice(2);