import { Metadata } from "next";

import { ConnectWithUsPageClient } from "./components/connect-with-us-page.client";

export const metadata: Metadata = {
  title: "Requests | Hexa AI",
  description:
    "Platform admin — captured connect / user requests across channels",
};

export default function AdminRequestsPage() {
  return <ConnectWithUsPageClient />;
}
