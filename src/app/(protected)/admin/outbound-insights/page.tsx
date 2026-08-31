import { Metadata } from "next";

import { OutboundInsightsPageClient } from "./components/outbound-insights-page-client";

export const metadata: Metadata = {
  title: "Outbound insights | Hexa AI",
  description:
    "Platform admin view — outbound calls with trusted caller attribution",
};

export default function OutboundInsightsPage() {
  return <OutboundInsightsPageClient />;
}
