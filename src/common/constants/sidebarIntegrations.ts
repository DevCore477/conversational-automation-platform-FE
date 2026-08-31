
import {
  GoogleSheet, Gmail, Slack, GoogleDrive, Hubspot, Calendly, Airtable, SalesForce,  Notion, Homerun, Zoho, Holded, 
  Mailchimp, Joomla, Wordpress, Wix, WhatsAppBusiness, Wappalyzer, Jotform, YouTube, Binance, Twillio, ClickUp, GitHub, 
  MySQL, PeopleDataLabs, Perplexity, AI, LandyMeetingRecorder, AmazoneS3, Browser, Clarifai, Directory, Drip, Freshdesk, 
  GoogleDocs, HTTP, KnowledgeBase, LindyMail, Linear, Mastodon, NaturalLanguage, Pastebin, Telegram, Tidycal, 
  WeightsNBiases, Alexa, GoogleCalendar, Zendesk, LiveAgent, Jira, Shopfiy, Woo, SendFox, PrintfulOauth, MAP, 
  Cloudflare,  GPTZero, Vercel, Unsplash, TrackingTime, SwaggerHub, Supabase, Postman, PostgreSQL, Plivo, MondayCom, 
  SFTP, XAi, PhoneBurner, OpnForm, MicrosoftDynamic, Indeed, Canva, Netlify, npm
} from "@/assets";

export type PopularIntegration = {
  name: string;
  desc: string;
  img: any;
};

export type SidebarCategoryData = {
  description: string;
  integrations: PopularIntegration[];
};

export const sidebarCategories = [
  "Most Popular",
  "Sales",
  "Marketing",
  "Personal Assistant",
  "Customer Support",
] as const;

export const sidebarData: Record<string, SidebarCategoryData> = {
  "Most Popular": {
    description: "",
    integrations: [
      { name: "Google Sheets", img: GoogleSheet, desc: "Integrate Google Sheets with your AI Workflows."},
      { name: "Gmail", img: Gmail, desc: "Integrate Gmail with your AI Workflows."},
      { name: "Slack", img: Slack, desc: "Integrate Slack with your AI Workflows."},
      { name: "Google Drive", img: GoogleDrive, desc: "Integrate Google Drive with your AI Workflows."},
      { name: "HubSpot", img: Hubspot, desc: "Integrate HubSpot with your AI Workflows."},
      { name: "Calendly", img: Calendly, desc: "Integrate Calendly with your AI Workflows."},
      { name: "Airtable", img: Airtable, desc: "Integrate Airtable with your AI Workflows."},
      { name: "Salesforce", img: SalesForce, desc: "Integrate Salesforce with your AI Workflows."},
      { name: "Jotform", img: Jotform, desc: "Integrate Jotform with your AI Workflows. " },
      { name: "WhatsApp Business", img: WhatsAppBusiness, desc: "Integrate WhatsApp Business with your AI Workflows." },
      { name: "YouTube", img: YouTube, desc: "Integrate YouTube with your AI Workflows." },
      { name: "Binance", img: Binance, desc: "Integrate Binance with your AI Workflows." },
      { name: "ClickUp ", img: ClickUp, desc: "Integrate ClickUp with your AI Workflows." },
      { name: "GitHub  ", img: GitHub, desc: "Integrate GitHub  with your AI Workflows." },
      { name: "MySQL ", img: MySQL, desc: "Integrate MySQL with your AI Workflows." },
      { name: "AI", img: AI, desc: "Integrate AI with your AI Workflows." },
      { name: "Twilio", img: Twillio, desc: "Integrate Twilio with your AI Workflows." },
      { name: "Perplexity ", img: Perplexity, desc: "Integrate Perplexity with your AI Workflows." },
      { name: "People Data Labs", img: PeopleDataLabs, desc: "Integrate People Data Labs with your AI Workflows." },
      { name: "Lindy Meeting Recorder", img: LandyMeetingRecorder, desc: "Integrate Lindy Meeting Recorder with your AI Workflows." },
      { name: "Webhook ", img: AI, desc: "Integrate Webhook  with your AI Workflows." },
      { name: "Amazon S3", img: AmazoneS3, desc: "Integrate Amazon S3 with your AI Workflows." },
      { name: "Clarifai", img: Clarifai, desc: "Integrate Clarifai with your AI Workflows." },
      { name: "Directory", img: Directory, desc: "Integrate Directory with your AI Workflows." },
      { name: "Drip", img: Drip, desc: "Integrate Drip with your AI Workflows." },
      { name: "Browser", img: Browser, desc: "Integrate Browser with your AI Workflows." },
      { name: "Freshdesk", img: Freshdesk, desc: "Integrate Freshdesk with your AI Workflows." },
      { name: "Google Docs", img: GoogleDocs, desc: "Integrate Google Docs with your AI Workflows." },
      { name: "HTTP", img: HTTP, desc: "Integrate HTTP with your AI Workflows." },
      { name: "Knowledge Base", img: KnowledgeBase, desc: "Integrate Knowledge Base with your AI Workflows." },
      { name: "Lindy Mail", img: LindyMail, desc: "Integrate Lindy Mail with your AI Workflows." },
      { name: "Linear", img: Linear, desc: "Integrate Linear with your AI Workflows." },
      { name: "Mastodon", img: Mastodon, desc: "Integrate Mastodon with your AI Workflows." },
      { name: "Natural Language", img: NaturalLanguage, desc: "Integrate Natural Language with your AI Workflows." },
      { name: "Pastebin", img: Pastebin, desc: "Integrate Pastebin with your AI Workflows." },
      { name: "Telegram", img: Telegram, desc: "Integrate Telegram with your AI Workflows." },
      { name: "Tidycal", img: Tidycal, desc: "Integrate Tidycal  with your AI Workflows." },
      { name: "Weights & Biases", img: WeightsNBiases, desc: "Integrate Weights & Biases with your AI Workflows." },
    ]
  },

  "Personal Assistant": {
    description: "",
    integrations: [
      { name: "Slack", img: Slack, desc: "Scale your AI agent operations with enterprise-grade Slack integration for seamless team collaboration and real-time workflow automation." },
      { name: "Google Calendar", desc: "Manage your schedule and reminders with AI voice assistance", img: GoogleCalendar },
      { name: "Amazon Alexa", desc: "Integrate Amazon Alexa with your AI Workflows", img: Alexa },
      { name: "Notion", desc: "Create and update personal notes and tasks through conversation", img: Notion },
      { name: "Evernote", desc: "Capture ideas and organize your personal knowledge base", img: null },
    ]
  },

  "Sales": {
    description: "",
    integrations: [
      { name: "HubSpot", img: Hubspot, desc: "Sync leads and deals from AI conversations directly into HubSpot" },
      { name: "Salesforce", img: SalesForce, desc: "Update opportunities, accounts, and activities automatically" },
      { name: "YouTube (Data API)", img: YouTube, desc: "Integrate YouTube with your AI Workflows." },
      { name: "Shopify", img: Shopfiy, desc: "Connect your AI agent to Shopify store for order management and inventory sync" },
      { name: "Pipedrive", img: null, desc: "Automate your sales pipeline with voice-driven updates" },
      { name: "WooCommerce", img: Woo, desc: "Automate WooCommerce orders, customers, and product updates via voice" },
      { name: "monday.com (API Key)", img: MondayCom, desc: "Connect monday.com (API Key) with hundreds of popular tools, AI models, or AI agents. Automate your work faster and better than ever before - all visually with no-code ease." },
      { name: "SFTP password-based auth", img: SFTP, desc: "Integrate SFTP password-based auth with your AI Workflows." },
      { name: "SFTP key-based auth", img: SFTP, desc: "Connect SFTP key-based auth with hundreds of popular tools, AI models, or AI agents. Automate your work faster and better than ever before - all visually with no-code ease." },
      { name: "xAI", img: XAi, desc: "Connect xAI with hundreds of popular tools, AI models, or AI agents. Automate your work faster and better than ever before - all visually with no-code ease." },
      { name: "PhoneBurner", img: PhoneBurner, desc: "Integrate PhoneBurner with your AI Workflows." },
      { name: "OpnForm", img: OpnForm, desc: "Connect OpnForm with hundreds of popular tools, AI models, or AI agents. Automate your work faster and better than ever before - all visually with no-code ease." },
      { name: "Microsoft Dynamics 365 Business Central API", img: MicrosoftDynamic, desc: "Integrate Microsoft Dynamics 365 Business Central API with your AI Workflows." },
      { name: "Indeed", img: Indeed, desc: "Connect Indeed with hundreds of popular tools, AI models, or AI agents. Automate your work faster and better than ever before - all visually with no-code ease." },
      { name: "Canva", img: Canva, desc: "Integrate Canva with your AI Workflows." },
    ]
  },

  "Marketing": {
    description: "",
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
      { name: "Sendfox Personal Access Token", img: SendFox, desc: "Integrate Sendfox Personal Access Token with your AI Workflows." },
      { name: "Sendfox OAuth", img: SendFox, desc: "Integrate Sendfox OAuth with your AI Workflows." },
      { name: "Printful OAuth", img: PrintfulOauth, desc: "Integrate Printful OAuth with your AI Workflows." },
      { name: "Google Maps Places API", img: MAP, desc: "Integrate Google Maps Places API with your AI Workflows." },
      { name: "Cloudflare (API key)", img: Cloudflare, desc: "Integrate Cloudflare (API key) with your AI Workflows." },
      { name: "GPTZero Detect AI", img: GPTZero, desc: "Integrate GPTZero Detect AI with your AI Workflows." },
      { name: "Vercel", img: Vercel, desc: "Integrate Vercel with your AI Workflows." },
      { name: "Unsplash", img: Unsplash, desc: "Integrate Unsplash with your AI Workflows." },
      { name: "TrackingTime", img: TrackingTime, desc: "Integrate TrackingTime with your AI Workflows." },
      { name: "SwaggerHub ", img: SwaggerHub, desc: "Integrate SwaggerHub with your AI Workflows." },
      { name: "Plivo", img: Plivo, desc: "Scale your voice interactions with real-time AI agents that deliver consistent, high-quality customer experiences through your existing Plivo infrastructure." },
      { name: "Supabase", img: Supabase, desc: "Integrate Supabase with your AI Workflows." },
      { name: "Supabase Management API", img: Supabase, desc: "Integrate Supabase Management API with your AI Workflows." },
      { name: "Printful", img: PrintfulOauth, desc: "Integrate Printful with your AI Workflows." },
      { name: "Postman", img: Postman, desc: "Integrate Postman with your AI Workflows." },
      { name: "postgresql", img: PostgreSQL, desc: "Integrate PostgreSQL with your AI Workflows." },
      { name: "npm", img: npm, desc: "Integrate npm with your AI Workflows." },
      { name: "Netlify", img: Netlify, desc: "Integrate Netlify with your AI Workflows." },
    ]
  },

  "Customer Support": {
    description: "",
    integrations: [
      { name: "Zendesk", img: Zendesk, desc: "Create and manage support tickets from voice conversations" },
      { name: "Freshdesk", img: Freshdesk, desc: "Integrate Freshdesk with your AI Workflows." },
      { name: "LiveAgent", img: LiveAgent, desc: "Integrate LiveAgent with your AI Workflows." },
      { name: "Jira Service Desk", img: Jira, desc: "Integrate Jira Service Desk with your AI Workflows." },
      { name: "Intercom", img: null, desc: "Enhance customer experience with proactive AI support"},
      { name: "Freshdesk", img: Freshdesk, desc: "Streamline customer support workflows and ticketing"},
      { name: "Slack", img: Slack, desc: "Send real-time support notifications to your team"},
    ]
  },
};