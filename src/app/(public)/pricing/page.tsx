import { Info } from "lucide-react";
import { PlanCard} from "./components/PlanCard";
import SetupCard from "./components/SetupCard";
import AddonItem from "./components/AddonItem";
import PricingTable from "./components/PricingTable";

const url = "https://gethexa.ai/pricing";
const ogImage = "/og-image.png";

export async function generateMetadata() {
  return {
    title: "AI Voice Agent & WhatsApp Automation Pricing | Hexa-AI",
    description:
      "Find the right plan for your business. Compare AI voice agent pricing, WhatsApp campaign packages, and enterprise plans for automated calling and outreach.",
    keywords: [
      "AI voice agent pricing",
      "automated calling software pricing",
      "AI call center cost",
      "WhatsApp marketing pricing",
      "AI phone agent plans",
      "voice AI pricing",
      "outbound calling software cost",
      "AI agent subscription",
      "automated phone system pricing",
      "Hexa AI pricing plans",
      "voice bot cost per month",
      "AI calling platform packages",
      "business phone automation pricing",
      "conversational AI pricing",
      "AI call automation plans",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: "AI Voice Agent & WhatsApp Automation Pricing | Hexa-AI",
      description:
        "Find the right plan for your business. Compare AI voice agent pricing, WhatsApp campaign packages, and enterprise plans for automated calling and outreach.",
      type: "website",
      siteName: "Hexa-AI",
      locale: "en_US",
      url,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "AI Voice Agent & WhatsApp Automation Pricing | Hexa-AI",
      description:
        "Find the right plan for your business. Compare AI voice agent pricing, WhatsApp campaign packages, and enterprise plans for automated calling and outreach.",
      images: [ogImage],
    },
    robots: "index, follow",
  };
}

export default function Pricing() {
  // Plan data
  const plans = [
    {
      name: "Starter",
      tagline: "Small businesses testing AI calls / WhatsApp",
      price: "$270",
      badge: "Starter",
      extraRate: "Extra PKR 60/min",
      features: [
        { text: "1 AI Voice Agent", included: true },
        { text: "Up to 5 call scripts", included: true },
        { text: "Up to 2 conversation flows", included: true },
        { text: "500 call minutes", included: true },
        { text: "Basic call dashboard", included: true },
        { text: "Basic post-call summaries", included: true },
        { text: "1 WhatsApp number", included: true },
        { text: "WhatsApp templates", included: true },
        { text: "2 team members", included: true },
        { text: "Email/WhatsApp support", included: true },
      ],
      buttonText: "Started",
      buttonVariant: "outline" as const,
    },
    {
      name: "Growth",
      tagline: "Growing companies with regular customer calls",
      price: "$630",
      badge: "Growth",
      extraRate: "Extra PKR 55/min",
      // highlighted: true,
      features: [
        { text: "Up to 3 AI Voice Agents", included: true },
        { text: "Up to 15 scripts", included: true },
        { text: "Up to 8 conversation flows", included: true },
        { text: "2,000 call minutes", included: true },
        { text: "WhatsApp templates and campaigns", included: true },
        { text: "Multilingual conversations", included: true },
        { text: "Call history and analytics", included: true },
        { text: "Post-call analysis", included: true },
        { text: "5 team members", included: true },
        { text: "Basic integrations", included: true },
        { text: "Priority support", included: true },
      ],
      buttonText: "Get Started",
      buttonVariant: "primary" as const,
    },
    {
      name: "Business",
      tagline: "Companies needing automation + integrations",
      price: "$1259",
      badge: "Business",
      extraRate: "Extra PKR 50/min",
      features: [
        { text: "Up to 8 AI Voice Agents", included: true },
        { text: "Unlimited scripts", included: true },
        { text: "Up to 25 conversation flows", included: true },
        { text: "6,000 call minutes", included: true },
        { text: "Advanced branching conversation flows", included: true },
        { text: "Call transfer and warm transfer", included: true },
        { text: "WhatsApp campaigns and customer response handling", included: true },
        { text: "Advanced analytics and reporting", included: true },
        { text: "CRM/API/Slack/Twilio/Telnyx integrations", included: true },
        { text: "Up to 15 team members", included: true },
        { text: "Priority onboarding and support", included: true },
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
    },
    {
      name: "Enterprise",
      tagline: "Banks, clinics, real estate, logistics, large teams",
      price: "$2157+",
      priceLabel: "custom",
      badge: "Enterprise",
      extraRate: "Custom rate",
      features: [
        { text: "Custom number of AI agents", included: true },
        { text: "Unlimited scripts and flows", included: true },
        { text: "Custom workflows and automations", included: true },
        { text: "Dedicated environment or security requirements", included: true },
        { text: "CRM, ERP, API, and custom integrations", included: true },
        { text: "Dedicated account manager", included: true },
        { text: "SLA and priority support", included: true },
        { text: "High-volume call-minute rates", included: true },
        { text: "Custom reporting and compliance requirements", included: true },
      ],
      buttonText: "Talk to Experts",
      buttonVariant: "outline" as const,
    },
  ];

  // Setup data
  const setups = [
    {
      title: "Basic Setup",
      price: "$180",
      description: "1 agent, 1 script, 1 flow, WhatsApp setup",
    },
    {
      title: "Advanced Setup",
      price: "$359 – $899",
      description: "Multiple agents, custom flows, integrations, testing, training",
    },
    {
      title: "Enterprise Setup",
      price: "Custom",
      description: "Dedicated onboarding, custom API/CRM integration, compliance review",
    },
  ];

  // Add-ons data
  const addons = [
    { label: "Extra AI Agent", price: "$90/mo" },
    { label: "Extra Conversation Flow", price: "$36-$90" },
    { label: "Extra Script ", price: "$11-$29" },
    { label: "Complex Custom Flow", price: "$108-$269" },
    { label: "Extra Call Minutes", price: "$0.18-$0.22" },
    { label: "Extra User Seat", price: "$18/mo" },
    { label: "Extra WhatsApp Number", price: "$54/mo" },
    { label: "Extra Team Member", price: "$18/mo" },
    { label: "CRM/API Integration", price: "$359+" },
    { label: "Dedicated Support Manager", price: "$269/mo" },
    { label: "Advanced Analytics", price: "$180/mo" },
    { label: "SLA / Priority Support", price: "$359+/mo" },
    { label: "Custom Voice / Brand Voice", price: "$269+" },
  ];

  // Feature table data
  const featureRows = [
    { feature: "AI Voice Agents", starter: "1", growth: "3", business: "8", enterprise: "Custom", },
    { feature: "Conversation Flows", starter: "Basic", growth: "Advanced + function", business: "Advanced + transfer + function", enterprise: "Custom",},
    { feature: "Scripts", starter: "Yes", growth: "Yes", business: "Yes", enterprise: "Yes", },
    { feature: "Make a Call", starter: "Yes", growth: "Yes", business: "Yes", enterprise: "Yes", },
    { feature: "Dashboard", starter: "Basic", growth: "Standard", business: "Advanced", enterprise: "Custom", },
    { feature: "WhatsApp Templates", starter: "Yes", growth: "Yes", business: "Yes", enterprise: "Yes", },
    { feature: "WhatsApp Campaigns", starter: "Limited", growth: "Yes", business: "Yes", enterprise: "High-volume", },
    { feature: "Post‑call Analysis", starter: "No", growth: "Yes", business: "Advanced", enterprise: "Custom", },
    { feature: "Multilingual Support", starter: "NO", growth: "NO", business: "Yes", enterprise: "Yes", },
    { feature: "Integrations", starter: "No", growth: "Yes", business: "Yes", enterprise: "Custom", },
    { feature: "Users", starter: "2", growth: "5", business: "15", enterprise: "Custom", },
    { feature: "Support", starter: "Yes", growth: "Yes", business: "Yes", enterprise: "Dedicated", },
  ];

  return (
    <>
    <div className="min-h-screen text-slate-gray font-sans p-6 md:p-8">
      <div className=" max-w-7xl mx-auto">
        {/* Header */}
        <div className="font-dm-sans text-center mb-20 mt-12 w-full max-w-lg mx-auto">
          <h1 className="text-dark-gray text-3xl lg:text-4xl 2xl:text-5xl 4xl:text-[56px] font-medium lg:font-semibold mb-2">
            Plans & Pricing
          </h1>
          <p className="text-center md:text-lg lg:text-xl 2xl:text-xl text-slate-gray max-w-xl mb-8">
            AI Voice Agents, WhatsApp campaigns, conversation flows, post‑call
            analysis & integrations
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {plans.map((plan, index) => (
            <PlanCard key={index} {...plan} />
          ))}
        </div>

        {/* Setup Fee Section */}
        <div className="mb-12">
          <h2 className="font-dm-sans text-2xl text-dark-gray font-semibold mb-4">
            One‑Time Setup
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {setups.map((setup, index) => (
              <SetupCard key={index} {...setup} />
            ))}
          </div>
        </div>

        {/* Feature Breakdown Table */}
        <div className="mb-12">
          <h2 className="text-2xl text-dark-gray font-semibold mb-4">
            Feature Breakdown
          </h2>
          <PricingTable rows={featureRows} />
        </div>

        {/* Add-ons */}
        <div>
          <h2 className="text-2xl text-dark-gray font-semibold mb-4">
            Add‑Ons
          </h2>
          <div className="flex flex-wrap gap-3">
            {addons.map((addon, index) => (
              <AddonItem key={index} {...addon} />
            ))}
          </div>
          <div className="font-dm-sans mt-4 text-xs text-slate-gray bg-slate-100 inline-block px-4 py-1.5 rounded-full">
            <Info className="w-3 h-3 inline mr-1" /> 
            All prices in PKR, usage-based extras apply.
          </div>
        </div>
      </div>
    </div>
    </>
  );
}