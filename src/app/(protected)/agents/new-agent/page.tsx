import { Metadata } from "next";
import { Suspense } from "react";
import NewAgentPageContent from "./components/NewAgentPageContent";

export const metadata: Metadata = {
  title: "New Agent | Hexa AI",
  description: "Manage voice agents and their conversation flows or scripts",
};

export default function NewAgentPage() {

  return (
    <Suspense>
      <NewAgentPageContent />
    </Suspense>
  );
}