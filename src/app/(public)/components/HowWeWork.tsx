import ProcessTimelineSection, {
  type ProcessStep,
} from "./sections/ProcessTimelineSection";

const processSteps: ProcessStep[] = [
  {
    number: "01",
    duration: "30 minutes",
    title: "Book a Meeting",
    description:
      "The process begins when you schedule a meeting with our team. This gives us an opportunity to understand your business, communication challenges, and goals.",
    tag: "Free consultation",
    timeline: "DAY 1",
  },
  {
    number: "02",
    duration: "1-2 hours",
    title: "Discuss Your Scope and Use Case",
    description:
      "During the meeting, we discuss your specific requirements, use cases, customer journey, preferred communication channels, and the outcomes you want to achieve with Hexa Ai.",
    tag: "Requirements analysis",
    timeline: "DAY 1",
  },
  {
    number: "03",
    duration: "1-2 days",
    title: "Receive Timeline and Estimation",
    description:
      "After reviewing your requirements, our team provides a clear project scope, estimated development timeline, and implementation plan. This helps you understand how long it will take to build and configure the required solution.",
    tag: "Project proposal",
    timeline: "WEEK 1",
  },
  {
    number: "04",
    duration: "2-6 weeks",
    title: "Build, Configure, and Test",
    description:
      "Our team starts developing and configuring your solution within the Hexa Ai platform. This may include setting up AI agents, scripts, conversation flows, integrations, calling workflows, WhatsApp campaigns, or other custom requirements. We thoroughly test the solution to ensure it works correctly before launch.",
    tag: "Development & testing",
    timeline: "WEEKS 2-8",
  },
  {
    number: "05",
    duration: "Ongoing",
    title: "Progress Meetings and Demos",
    description:
      "Throughout the development process, we arrange meetings or demos based on your preference. These sessions allow you to review progress, share feedback, and request adjustments where needed.",
    tag: "Weekly check-ins",
    timeline: "ONGOING",
  },
  {
    number: "06",
    duration: "1 week",
    title: "Final Demo and Handover",
    description:
      "Once the solution is complete, we conduct a final demonstration to walk you through all features and workflows. After your approval, we complete the handover process, provide relevant guidance, and ensure your team is ready to use the solution effectively.",
    tag: "Handover session",
    timeline: "WEEK 8-9",
  },
];

export default function HowWeWork() {
  return (
    <>
      <ProcessTimelineSection
        title="Our Process Breakdown"
        subtitle="At Hexa Ai, we follow a clear and collaborative process to ensure every solution is built around your business needs."
        steps={processSteps}
      />
    </>
  );
}
