import { Metadata } from "next";

import { InboundInsightsPageClient } from "./components/inbound-insights-page-client";

export const metadata: Metadata = {
  title: "Inbound insights | Hexa AI",
  description:
    "Platform admin view — calls with inbound insight (category, purpose, summary)",
};

export default function InboundInsightsPage() {
  return <InboundInsightsPageClient />;
}
