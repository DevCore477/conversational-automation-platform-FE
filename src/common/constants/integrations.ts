
import { 
  Zaiper, N8N, Make, Hubspot, SalesForce, Airtable, Calendly, Slack, Cal, GoogleSheet, Jotform,  Zoho, PipeDrive, 
  Zendesk ,ServiceNow, Supabase, Mailchimp, Docusign, Shopfiy, Woo, Stripe,  Exotel, Ozonetel, Genesys, Twillio, 
  Telnyx, Vonage, RingCentral, AmazonConnect, SIP, Homerun,  Asana, Palantir, Notion, Wappalyzer, WhatsAppBusiness, 
  Wix, Wordpress, Joomla, Plivo, Holded, Freshdesk, LiveAgent, Jira
} from "@/assets";

export type Integration = {
  name: string;
  img: any;
  desc: string;
};

export type CategoryData = {
  integrations: Integration[];
  description: string;
};

export const integrationsData: Record<string, CategoryData> = {
  "Retail": {
    description: "Power your retail operations with seamless AI-driven store and payment integrations.",
    integrations: [
      { name: "Shopify", img: Shopfiy, desc: "Connect your AI agent to Shopify store for order management and inventory sync." },
      { name: "WooCommerce", img: Woo, desc: "Automate WooCommerce orders, customers, and product updates via voice." },
      { name: "Stripe", img: Stripe, desc: "Process payments, handle refunds, and manage subscriptions automatically." },
    ]
  },

  "Scheduling & Communication": {
    description: "Schedule meetings, book appointments, and manage communication with ease.",
    integrations: [
      { name: "Supabase", img: Supabase, desc: "Seamless Real-Time Voice AI with Database Power." },
      { name: "Slack", img: Slack, desc: "Scale your AI agent operations with enterprise-grade Slack integration for seamless team collaboration and real-time workflow automation." },
      { name: "Mailchimp", img: Mailchimp, desc: "Enable your AI voice agents to deliver intelligent, personalized email follow-ups and subscription management through seamless Mailchimp integration." },
      { name: "Docusign", img: Docusign, desc: "Transform your AI voice agents into contract-closing powerhouses. Enable real-time agreement workflows that convert conversations into signed documents instantly." },
      { name: "Calendly", img: Calendly, desc: "Enable your AI voice agents to handle real-time appointment scheduling through natural voice conversations." },
      { name: "Cal.com", img: Cal, desc: "Enable your AI voice agents to handle end-to-end scheduling conversations with real-time calendar integration." },
      { name: "Google Calendar", img: null, desc: "Sync meetings, availability, and reminders automatically." },
      { name: "Microsoft Teams", img: null, desc: "Integrate with Teams for internal communication." },
    ]
  },

  "Telephony": {
    description: "Connect your telephony system to your conversational AI to handle calls and voice interactions.",
    integrations: [
      { name: "Exotel", img: Exotel, desc: "Deploy AI voice agents across your Indian contact center using Exotel's cloud telephony infrastructure." },
      { name: "Ozonetel", img: Ozonetel, desc: "Run real-time AI voice agents at scale – purpose-built for India's contact center landscape with Ozonetel." },
      { name: "Genesys", img: Genesys, desc: "Scale your voice interactions with real-time AI agents that deliver consistent, high-quality customer experiences through your existing Genesys infrastructure." },
      { name: "Twilio", img: Twillio, desc: "Use AI Voice Agents with your Twilio phone numbers for seamless, automated inbound and outbound calls." },
      { name: "Telnyx", img: Telnyx, desc: "Unite enterprise-grade SIP trunking with ElevenLabs' Conversational AI Voice Agents to scale voice interactions without scaling headcount." },
      { name: "Vonage", img: Vonage, desc: "Advanced telephony features and outbound calling automation." },
      { name: "RingCentral", img: RingCentral, desc: "Power enterprise-grade voice AI agents with human-like conversations and enterprise telephony infrastructure." },
      { name: "Amazon Connect", img: AmazonConnect, desc: "Transform your contact center with ultra-realistic AI voice agents that handle real-time phone conversations at enterprise scale." },
      { name: "SIP Trunking", img: SIP, desc: "Bridge your existing telephony infrastructure with our real-time Conversational AI platform for seamless voice agent deployment." },
      { name: "Plivo", img: Plivo, desc: "Scale your voice interactions with real-time AI agents that deliver consistent, high-quality customer experiences through your existing Plivo infrastructure." },
    ]
  },

  "Automation": {
    description: "Automate repetitive tasks and streamline workflows with pre-built integrations.",
    integrations: [
      { name: "Zapier", img: Zaiper, desc: "Turn your voice AI agents into action-driven assistants that execute real-world tasks across thousands of apps without custom coding." },
      { name: "n8n", img: N8N, desc: "Build real-time AI voice agents that execute workflows - no code required." },
      { name: "Make", img: Make, desc: "Empower your AI voice agents to orchestrate complex workflows through conversation." },
    ]
  },

  "CRM": {
    description: "Connect your CRM to streamline customer interactions and data management.",
    integrations: [
      { name: "Jotform", img: Jotform, desc: "Transform form submissions into intelligent voice conversations with real-time AI agents." },
      { name: "Zoho", img: Zoho, desc: "Scale voice interactions with real-time CRM data access and automated workflow management." },
      { name: "HubSpot", img: Hubspot, desc: "Sync leads, deals, and contacts from AI conversations directly into HubSpot." },
      { name: "Salesforce", img: SalesForce, desc: "Real-time CRM integration that transforms customer data into intelligent voice conversations with enterprise-grade reliability." },
      { name: "Monday.com", img: SalesForce, desc: "Voice-enable your project management workflows with real-time AI agents that seamlessly integrate with Monday.com's Work OS." },
      { name: "Pipedrive", img: PipeDrive, desc: "Build real-time AI voice agents that leverage your CRM data for personalized, contextual conversations at scale." },
    ]
  },

  "Customer Support & CX": {
    description: "Deliver exceptional customer experiences with automated support workflows.",
    integrations: [
      { name: "Zendesk", img: Zendesk, desc: "Enable intelligent voice-first customer support with real-time ticket resolution and automated support workflows." },
      { name: "Slack", img: Slack, desc: "Send real-time support notifications to your team"},
      { name: "ServiceNow", img: ServiceNow, desc: "Build voice-first service automation that scales conversations without scaling headcount." },
      { name: "Freshdesk", img: Freshdesk, desc: "Streamline customer support workflows and ticketing." },
      { name: "LiveAgent", img: LiveAgent, desc: "Integrate LiveAgent with your AI Workflows." },
      { name: "Intercom", img: null, desc: "Enhance customer experience with proactive AI support." },
      { name: "Jira Service Desk", img: Jira, desc: "Integrate Jira Service Desk with your AI Workflows." },
    ]
  },

  "Data": {
    description: "Log, analyze, and manage data from AI conversations in real time.",
    integrations: [
      { name: "Google Sheets", img: GoogleSheet, desc: "Log conversation data, analytics, and metrics in real time." },
      { name: "Airtable", img: Airtable, desc: "Transform your database into a real-time, voice-driven knowledge base for Voice AI agents." },
      { name: "Notion", img: Notion, desc: "Update knowledge bases, wikis, and documentation automatically." },
      { name: "Asana", img: Asana, desc: "Enable your AI agents to manage tasks through natural voice conversations, transforming project workflows into seamless voice-driven experiences." },
      { name: "Palantir Foundry", img: Palantir, desc: "Transform your enterprise data into intelligent voice conversations with seamless real-time AI agents." },
    ]
  },

  "Marketing": {
    description: "Automate campaigns, emails, and marketing workflows through conversational AI.",
    integrations: [
      { name: "Homerun", img: Homerun, desc: "Connect Homerun with hundreds of popular tools, AI models, or AI agents. Automate your work faster and better than ever before - all visually with no-code ease." },
      { name: "Zoho CRM", img: Zoho, desc: "Connect Zoho CRM with hundreds of popular tools, AI models, or AI agents. Automate your work faster and better than ever before - all visually with no-code ease." },
      { name: "Holded", img: Holded, desc: "Connect Holded with hundreds of popular tools, AI models, or AI agents. Automate your work faster and better than ever before - all visually with no-code ease." },
      { name: "Mailchimp", img: Mailchimp, desc: "Automate email campaigns based on customer conversations." },
      { name: "Joomla ", img: Joomla, desc: "Connect Joomla with hundreds of popular tools, AI models, or AI agents. Automate your work faster and better than ever before - all visually with no-code ease." },
      { name: "Wordpress.org", img: Wordpress, desc: "Connect Wordpress.org with hundreds of popular tools, AI models, or AI agents. Automate your work faster and better than ever before - all visually with no-code ease." },
      { name: "Wix", img: Wix, desc: "Connect Wix with hundreds of popular tools, AI models, or AI agents. Automate your work faster and better than ever before - all visually with no-code ease." },
      { name: "WhatsApp Business", img: WhatsAppBusiness, desc: "Connect WhatsApp Business with hundreds of popular tools, AI models, or AI agents. Automate your work faster and better than ever before - all visually with no-code ease." },
      { name: "Wappalyzer", img: Wappalyzer, desc: "Connect Wappalyzer with hundreds of popular tools, AI models, or AI agents. Automate your work faster and better than ever before - all visually with no-code ease." },
    ]
  },
};

export const categories = [
  "Retail",
  "Scheduling & Communication",
  "Telephony",
  "Automation",
  "CRM",
  "Customer Support & CX",
  "Data",
  "Marketing",
] as const;