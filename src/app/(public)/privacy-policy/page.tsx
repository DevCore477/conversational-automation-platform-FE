import React from 'react'
import LegalTabs from '../components/sections/LegalTabs';
import { PrivacyHeroSm, PrivacyHeroBg } from '@/assets';

const title = "Privacy Policy | Hexa AI";
const description =
  "Hexa AI Privacy Policy — how we collect, use, store, share, and protect personal information when you use our AI voice agent, WhatsApp automation, and communication platform.";
const url = "https://gethexa.ai/privacy-policy";
const ogImage = "/og-image.png";

export async function generateMetadata() {
  return {
    title,
    description,
    keywords: [
      "Hexa AI privacy",
      "AI voice data privacy",
      "call data protection",
      "AI platform privacy policy",
      "AI calling data security",
      "voice conversation privacy",
      "AI call recording policy",
      "customer data protection AI",
      "WhatsApp data privacy",
      "AI communication data policy",
      "automated call data handling",
      "business AI platform privacy",
      "voice agent data storage",
      "AI call data compliance",
      "conversational AI privacy",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Hexa-AI",
      locale: "en_US",
      url,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

const tabsData = [
  { title: "Introduction",
    content: (
      <>
        <h3 className="text-xl 2xl:text-2xl 4xl:text-3xl text-cyan-blue font-medium mb-2">Privacy Policy</h3>

        <p className="mb-1">
          This Privacy Policy explains how Hexa AI collects, uses, stores,
          shares, and protects personal information when you visit our website,
          use our platform, interact with our AI agents, communicate with
          businesses using Hexa AI, or otherwise engage with our services.
        </p>

        <p className="mb-2">
          Hexa AI provides AI-powered voice agents, chat automation, customer
          support automation, call handling, WhatsApp messaging, appointment
          booking, knowledge base automation, call transfer, and related AI
          communication services.
        </p>

        <p className="mb-1">
          For this Privacy Policy:
        </p>

        <ul className="list-disc list-inside space-y-1 mb-4 ml-4">
          <li>
            Hexa AI means Hexa AI, operating Hexa AI platform
          </li>
          <li>
            Customer  means a business, company, organization, or individual that subscribes to or uses Hexa AI to manage AI agents, customer conversations, calls, messages, workflows, campaigns, or integrations
          </li>
          <li>
            End User means a person who interacts with a Customer through Hexa AI, including by phone call, WhatsApp, SMS, web chat, email, voice agent, chatbot, or any other communication channel
          </li>
          <li>
            Services means the Hexa AI website, dashboard, APIs, AI agents, integrations, messaging tools, voice tools, analytics, knowledge base features, and related products
          </li>
        </ul>
      </>
    ),
  },
  { title: "Personal Data",
    content: (
      <>
        <h3 className="text-xl 2xl:text-2xl 4xl:text-3xl text-cyan-blue font-medium mb-2">Who We Are</h3>

        <p className='mb-2'>Hexa AI is an AI communication and automation platform that helps businesses create, manage, and deploy AI-powered voice and messaging agents.</p>
        
        <ul className="list-disc list-inside mb-4 ml-4">
          <li><span className='font-medium'>Company Name:</span> Hexa AI</li>
          <li><span className='font-medium'>Brand Name:</span> Hexa AI</li>
          <li>
            <span className='font-medium'>Website: </span>   
            <a href="https://gethexa.ai/" target="_blank" rel="noopener noreferrer" className="text-cyan-blue hover:underline">
              https://gethexa.ai/
            </a>
          </li>
          <li>
            <span className='font-medium'>Email: </span>
            <a href="mailto:support@gethexa.ai" className="text-cyan-blue hover:underline">support@gethexa.ai</a>
          </li>
          {/* <li><strong>Address:</strong> 772/A, G4 Block Johar Town Lahore, Lahore, Pakistan, 54000</li> */}
        </ul>

        <p className="mb-4">
          Depending on the situation, Hexa AI may act as either:
        </p>

        <ul className="list-disc list-inside space-y-1 mb-4">
          <li>
            Data Controller — when we collect and use personal
            data for our own purposes, including website analytics, account
            registration, billing, sales, marketing, support, and platform
            security
          </li>
          <li>
            Data Processor / Service Provider — when we process
            Customer-provided data on behalf of our Customers, including call
            recordings, transcripts, WhatsApp messages, contact lists,
            conversation history, support interactions, and campaign data
          </li>
        </ul>

        <p>
          When Hexa AI processes data on behalf of a Customer, the Customer
          remains responsible for determining the purpose and legal basis for
          collecting and using that data.
        </p>
      </>
    ),
  },
  { title: "Scope",
    content: (
      <>
        <h3 className="text-xl 2xl:text-2xl 4xl:text-3xl text-cyan-blue font-medium mb-2">Scope of This Privacy Policy</h3>
        <p className='mb-1'>This Privacy Policy applies to:</p>
        <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
          <li>Visitors to our website</li>
          <li>Users who create or manage Hexa AI accounts</li>
          <li>Company owners, admins, agents, and team members using the Hexa AI dashboard</li>
          <li>End Users who interact with AI voice agents, chatbots, WhatsApp messages, support flows, or call automation powered by Hexa AI</li>
          <li>People who communicate with us for sales, support, demos, partnerships, or business inquiries</li>
          <li>Users of our APIs, integrations, and automation tools</li>
        </ul>

        <p>
          This Privacy Policy does not replace the privacy policy of any business that uses Hexa AI. If you are an End User communicating with a business through Hexa AI, that business may have its own privacy policy and data practices.
        </p>
      </>
    ),
  },
  { title: "Information We Collect",
    content: (
    <>
      <h3 className="text-xl 2xl:text-2xl 4xl:text-3xl text-cyan-blue font-medium mb-2">Information We Collect</h3>
      <p className="mb-4">
        We collect different types of information depending on how you interact with Hexa AI.
      </p>

      {/* 3.1 */}
      <h4 className="text-lg font-semibold mb-1">Account and Profile Information</h4>
      <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
        <li>Full name</li>
        <li>Email address</li>
        <li>Phone number</li>
        <li>Company name</li>
        <li>Job title or role</li>
        <li>Account password or authentication credentials</li>
        <li>Profile image, if provided</li>
        <li>Company settings and workspace configuration</li>
        <li>User role, permissions, and access level</li>
        <li>Login activity and account status</li>
      </ul>

      {/* 3.2 */}
      <h4 className="text-lg font-semibold">Customer Business Information</h4>
      <p className="mb-1">For business Customers, we may collect:</p>

      <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
        <li>Company name</li>
        <li>Company address</li>
        <li>Business email and phone number</li>
        <li>Billing details</li>
        <li>Tax or invoice information</li>
        <li>Business category or industry</li>
        <li>Subscription plan</li>
        <li>Team member details</li>
        <li>Company configuration</li>
        <li>Assigned phone numbers</li>
        <li>WhatsApp Business configuration</li>
        <li>Calling, messaging, and AI agent settings</li>
        <li>Knowledge base documents uploaded by the Customer</li>
        <li>Integration settings and API keys, where applicable</li>
      </ul>

      {/* 3.3 */}
      <h4 className="text-lg font-semibold ">Communication and Conversation Data</h4>
      <p className="mb-1">
        When Customers use Hexa AI to communicate with End Users, we may process:
      </p>  
      <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
        <li>Phone numbers</li>
        <li>Call logs</li>
        <li>Call recordings</li>
        <li>Voice inputs</li>
        <li>AI-generated voice responses</li>
        <li>Call transcripts</li>
        <li>Chat messages</li>
        <li>WhatsApp messages</li>
        <li>SMS messages</li>
        <li>Conversation history</li>
        <li>Message templates</li>
        <li>Customer support tickets</li>
        <li>Appointment booking details</li>
        <li>Call transfer logs</li>
        <li>Agent handoff details</li>
        <li>Intent detection results</li>
        <li>AI-generated summaries</li>
        <li>Conversation metadata, such as timestamps, duration, message status, delivery status, and communication channel</li>
      </ul>
      <p>This data is usually processed on behalf of our Customers.</p>

      {/* 3.4 */}
      <h4 className="text-lg font-semibold mt-4">AI Agent and Knowledge Base Data</h4>
      <p className="mb-1">
        Customers may upload or configure data to train, guide, or customize AI agents, including:
      </p>
      <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
        <li>Business FAQs</li>
        <li>Product information</li>
        <li>Service policies</li>
        <li>Sales scripts</li>
        <li>Customer service scripts</li>
        <li>Call flow instructions</li>
        <li>Knowledge base documents</li>
        <li>Website content</li>
        <li>Internal policy documents</li>
        <li>Menu, pricing, or service information</li>
        <li>Prompt instructions and agent behavior settings</li>
      </ul>

      <p className="mb-4">
        Customers are responsible for ensuring they have the right to upload and use such content within Hexa AI.
      </p>

      {/* 3.5 */}
      <h4 className="text-lg font-semibold ">Imported Contact Lists and Bulk Messaging Data</h4>
      <p className="mb-1">
        If a Customer uses Hexa AI for outbound campaigns, WhatsApp messaging, SMS, or bulk communication, we may process:
      </p>
      <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
        <li>Names</li>
        <li>Phone numbers</li>
        <li>Email addresses</li>
        <li>Customer IDs</li>
        <li>Tags or segments</li>
        <li>Message templates</li>
        <li>Campaign details</li>
        <li>Delivery status</li>
        <li>Opt-in and opt-out status</li>
        <li>Conversation history</li>
        <li>Response logs</li>
      </ul>

      <p className="mb-4">
        Customers are responsible for ensuring that all imported contacts have been collected lawfully and that required consent or another valid legal basis exists before sending messages.
      </p>

      {/* 3.6 */}
      <h4 className="text-lg font-semibold">Payment and Billing Information</h4>
      <p className="mb-1">
        When you subscribe to paid services, we may collect or process:
      </p>
      <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
        <li>Billing name</li>
        <li>Billing address</li>
        <li>Company details</li>
        <li>Invoice details</li>
        <li>Subscription plan</li>
        <li>Payment status</li>
        <li>Transaction references</li>
        <li>Tax information</li>
      </ul>

      <p className="mb-4">
        We do not store full payment card details unless explicitly stated. Payment processing may be handled by third-party payment providers.
      </p>

      {/* 3.7 */}
      <h4 className="text-lg font-semibold">Website, Device, and Usage Data</h4>
      <p className="mb-1">
        When you visit our website or use our platform, we may automatically collect:
      </p>
      <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
        <li>IP address</li>
        <li>Browser type</li>
        <li>Device type</li>
        <li>Operating system</li>
        <li>Referring URL</li>
        <li>Pages visited</li>
        <li>Session duration</li>
        <li>Clicks and interactions</li>
        <li>Login timestamps</li>
        <li>API usage logs</li>
        <li>Error logs</li>
        <li>Performance logs</li>
        <li>Approximate location based on IP address</li>
        <li>Cookies and tracking technologies</li>
      </ul>

      {/* 3.8 */}
      <h4 className="text-lg font-semibold">Support and Sales Communication Data</h4>
      <p className='mb-1'>When you contact us, we may collect:</p>

      <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
        <li>Name</li>
        <li>Email address</li>
        <li>Phone number</li>
        <li>Company name</li>
        <li>Message content</li>
        <li>Support request details</li>
        <li>Demo request details</li>
        <li>Attachments you provide</li>
        <li>Communication history with our team</li>
      </ul>

      {/* 3.9 */}
      <h4 className="text-lg font-semibold">Sensitive Information</h4>

      <p className="">
        Hexa AI is not designed for unnecessary collection of sensitive personal information. Customers should not upload or process sensitive data unless they have a lawful basis and appropriate safeguards.
      </p>
      <p className="mb-1">Sensitive information may include:</p>

      <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
        <li>Health information</li>
        <li>Financial information</li>
        <li>Government ID numbers</li>
        <li>Biometric data</li>
        <li>Children's data</li>
        <li>Religious, political, or union-related information</li>
        <li>Precise location data</li>
        <li>Criminal record information</li>
      </ul>

      <p>
        If a Customer uses Hexa AI in healthcare, financial services, insurance, legal, employment, or other regulated industries, the Customer is responsible for ensuring compliance with applicable laws and contractual requirements.
      </p>
    </>
    ),
  },
  { title: "How We Collect Information",
    content: (
      <>
        <h3 className="text-xl 2xl:text-2xl 4xl:text-3xl text-cyan-blue font-medium mb-2">How We Collect Information</h3>

        <p className='mb-2'>We collect information from the following sources:</p>
        
        <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
          <li>Directly from you when you sign up, request a demo, contact us, upload content, configure agents, or use the platform</li>
          <li>From our Customers when they import contacts, upload knowledge base files, configure workflows, or connect communication channels</li>
          <li>From End Users when they interact with AI agents, calls, messages, or chatbots powered by Hexa AI</li>
          <li>Automatically through our platform using logs, cookies, analytics tools, security tools, and monitoring systems</li>
          <li>From third-party integrations such as communication providers, AI providers, messaging platforms and telephony providers</li>
        </ul>
      </>
    ),
  },
  { title: "How We Use Information",
    content: (
    <>
      <h3 className="text-xl 2xl:text-2xl 4xl:text-3xl text-cyan-blue font-medium mb-2">How We Use Information</h3>
      <p className="mb-4">We use personal information for the following purposes.</p>

      {/*  */}
      <h4 className="text-lg font-semibold ">To Provide the Services</h4>
      <p className="mb-2">We use data to:</p>  

      <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
        <li>Create and manage user accounts</li>
        <li>Provide access to the Hexa AI dashboard</li>
        <li>Create and run AI agents</li>
        <li>Process calls, messages, and conversations</li>
        <li>Generate AI responses</li>
        <li>Convert speech to text</li>
        <li>Convert text to speech</li>
        <li>Manage inbound and outbound calls</li>
        <li>Support WhatsApp, SMS, chat, and voice workflows</li>
        <li>Route calls and messages to the correct Customer</li>
        <li>Manage company-specific phone numbers</li>
        <li>Process message templates</li>
        <li>Manage bulk messaging campaigns</li>
        <li>Handle appointment bookings</li>
        <li>Provide analytics and reporting</li>
        <li>Maintain conversation history</li>
      </ul>

      {/*  */}
      <h4 className="text-lg font-semibold ">To Improve and Maintain the Platform</h4>
      <p className="mb-2">We use data to:</p>  

      <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
        <li>Debug errors</li>
        <li>Monitor system performance</li>
        <li>Improve AI agent accuracy</li>
        <li>Improve call quality</li>
        <li>Improve message delivery</li>
        <li>Test new features</li>
        <li>Analyze usage trends</li>
        <li>Prevent downtime</li>
        <li>Improve user experience</li>
        <li>Maintain platform reliability</li>
      </ul>

      <p className='mb-4'>Unless separately agreed, we do not use Customer conversation data to train public AI models.</p>

      {/*  */}
      <h4 className="text-lg font-semibold ">To Provide Customer Support</h4>
      <p className="mb-2">We use data to:</p>  

      <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
        <li>Respond to support requests</li>
        <li>Troubleshoot technical issues</li>
        <li>Investigate bugs</li>
        <li>Resolve billing issues</li>
        <li>Provide onboarding assistance</li>
        <li>Help Customers configure AI agents and integrations</li>
      </ul>

      {/*  */}
      <h4 className="text-lg font-semibold ">To Communicate With You</h4>
      <p className="mb-2">We may use your contact information to send:</p>  
      <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
        <li>Account notifications</li>
        <li>Security alerts</li>
        <li>Product updates</li>
        <li>Billing reminders</li>
        <li>Service announcements</li>
        <li>Support responses</li>
        <li>Demo follow-ups</li>
        <li>Administrative messages</li>
      </ul>

      {/*  */}
      <h4 className="text-lg font-semibold ">For Security and Fraud Prevention</h4>
      <p className="mb-2">We use data to:</p>  
      <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
        <li>Detect unauthorized access</li>
        <li>Prevent abuse, spam, fraud, and misuse</li>
        <li>Monitor suspicious activity</li>
        <li>Enforce rate limits</li>
        <li>Protect platform infrastructure</li>
        <li>Verify user identity</li>
        <li>Maintain audit logs</li>
        <li>Secure APIs and integrations</li>
      </ul>

      {/*  */}
      <h4 className="text-lg font-semibold ">For Legal and Compliance Purposes</h4>
      <p className="mb-2">We may use data to:</p>  
      <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
        <li>Comply with applicable laws</li>
        <li>Respond to lawful requests</li>
        <li>Enforce our Terms of Service</li>
        <li>Maintain business records</li>
        <li>Resolve disputes</li>
        <li>Protect our rights, users, Customers, and the public</li>
      </ul>

      {/*  */}
      <h4 className="text-lg font-semibold ">For Marketing</h4>
      <p className="mb-2">Where permitted by law, we may use business contact information to:</p>  
      <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
        <li>Send product updates</li>
        <li>Share offers or educational content</li>
        <li>Invite users to demos or webinars</li>
        <li>Improve our sales process</li>
      </ul>
      <p>You can opt out of marketing emails at any time.</p>

    </>
    ),
  },
  { title: "Legal Bases for Processing", 
    content: (
      <>
        <h3 className="text-xl 2xl:text-2xl 4xl:text-3xl text-cyan-blue font-medium mb-2">Legal Bases for Processing</h3>
        <p className="mb-4">Where GDPR, UK GDPR, or similar laws apply, we rely on one or more of the following legal bases.</p>
        
        <h4 className="text-lg font-semibold ">Contract</h4>
        <p className="mb-2">We process personal data when necessary to provide the Services, manage accounts, process subscriptions, and fulfill our contractual obligations.</p>  

        <h4 className="text-lg font-semibold ">Legitimate Interests</h4>
        <p className="mb-2">We may process data for legitimate business interests, such as platform security, service improvement, fraud prevention, analytics, support, and business communication, provided those interests are not overridden by your rights.</p> 

        <h4 className="text-lg font-semibold ">Consent</h4>
        <p className="mb-2">We may rely on consent for certain activities, such as marketing communications, cookies, call recording notices, WhatsApp opt-ins, or other legally required permissions.</p> 

        <h4 className="text-lg font-semibold ">Legal Obligation</h4>
        <p className="mb-2">We may process data to comply with laws, tax obligations, accounting rules, regulatory requests, or court orders.</p> 

        <h4 className="text-lg font-semibold ">Customer Instructions</h4>
        <p className="mb-2">When we process Customer-provided conversation, contact, or campaign data, we usually do so as a processor/service provider based on the Customer’s instructions.</p> 
      </>
    ),
  },
  { title: "AI Processing and Automated Responses", 
    content: (
      <>
        <h3 className="text-xl 2xl:text-2xl 4xl:text-3xl text-cyan-blue font-medium mb-2">AI Processing and Automated Responses</h3>
        <p className="mb-4">Hexa AI uses artificial intelligence to help customers automate communication, including voice calls, chat replies, WhatsApp responses, appointment booking, lead qualification, customer support, and call routing.</p>
        <p className="mb-2">AI-generated outputs may include:</p>
        <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
          <li>Text replies</li>
          <li>Voice replies</li>
          <li>Conversation summaries</li>
          <li>Suggested responses</li>
          <li>Intent classification</li>
          <li>Call outcomes</li>
          <li>Routing decisions</li>
          <li>Knowledge base answers</li>
        </ul>
        <p className="mb-2">AI responses may not always be accurate, complete, or suitable for every situation. Customers are responsible for configuring their AI agents properly, reviewing outputs where needed, and ensuring that AI agents do not provide prohibited, unsafe, misleading, or unlawful responses.</p>
        <p>Hexa AI should not be used as the sole decision-maker for decisions that have legal, financial, medical, employment, insurance, or similarly significant effects on individuals unless appropriate human review and legal safeguards are in place.</p>
      </>
    ),
  },
  { title: "Call Recording and Transcription", 
    content: (
      <>
        <h3 className="text-xl 2xl:text-2xl 4xl:text-3xl text-cyan-blue font-medium mb-2">Call Recording and Transcription</h3>
        <p className="mb-4">Hexa AI may support call recording, call transcription, voice analytics, and AI-generated call summaries.</p>
        <p className="mb-2">Where calls are recorded or transcribed, Customers are responsible for:</p>
        <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
          <li>Notifying callers that the call may be recorded or transcribed</li>
          <li>Obtaining consent where required</li>
          <li>Configuring lawful call recording notices</li>
          <li>Ensuring compliance with local call recording laws</li>
          <li>Handling deletion or access requests from End Users</li>
        </ul>
        <p>Hexa AI may process recordings and transcripts only to provide the Services, improve service reliability, support Customer workflows, and comply with legal obligations.</p>
      </>
    ),
  },
  { title: "Messaging Compliance", 
    content: (
      <>
        <h3 className="text-xl 2xl:text-2xl 4xl:text-3xl text-cyan-blue font-medium mb-2">WhatsApp, SMS, and Messaging Compliance</h3>
        <p className="mb-2">If Customers use Hexa AI for WhatsApp, SMS, or bulk messaging, Customers are responsible for:</p>
        <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
          <li>Obtaining valid opt-in or consent where required</li>
          <li>Using approved message templates where required</li>
          <li>Respecting opt-out requests</li>
          <li>Avoiding spam, harassment, misleading content, or unlawful campaigns</li>
          <li>Maintaining accurate contact lists</li>
          <li>Complying with Meta, WhatsApp, telecom, and local messaging rules</li>
          <li>Ensuring that messages are sent only to users who have a lawful basis to receive them</li>
        </ul>
        <p className="mb-2">Hexa AI may process message content, delivery status, phone numbers, templates, and conversation history to provide messaging services.</p>
        <p>We may suspend or limit messaging features if we detect abuse, policy violations, suspicious activity, excessive failure rates, or unlawful use.</p>
      </>
    ),
  },
  { title: "Cookies and Tracking Technologies", 
    content: (
      <>
        <h3 className="text-xl 2xl:text-2xl 4xl:text-3xl text-cyan-blue font-medium mb-2">Cookies and Tracking Technologies</h3>
        <p className="mb-2">We may use cookies, pixels, local storage, and similar technologies to:</p>
        <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
          <li>Keep users logged in</li>
          <li>Remember preferences</li>
          <li>Improve website performance</li>
          <li>Understand website usage</li>
          <li>Analyze product usage</li>
          <li>Detecting security issues</li>
          <li>Support marketing and analytics</li>
        </ul>
        <p className="mb-2">Types of cookies we may use:</p>

        <h4 className="text-lg font-semibold ">Essential Cookies</h4>
        <p className="mb-2">Required for login, security, session management, and core platform functionality.</p>

        <h4 className="text-lg font-semibold ">Analytics Cookies</h4>
        <p className="mb-2">Help us understand how users interact with our website and platform.</p>

        <h4 className="text-lg font-semibold ">Preference Cookies</h4>
        <p className="mb-2">Remember settings such as language, region, or interface preferences.</p>

        <h4 className="text-lg font-semibold ">Marketing Cookies</h4>
        <p className="">May be used to measure campaigns and show relevant content, where permitted by law.</p>
        <p className="mb-2">You can control cookies through your browser settings. Some features may not work properly if essential cookies are disabled.</p>

      </>
    ),
  },
  { title: "How We Share Information", 
    content: (
      <>
        <h3 className="text-xl 2xl:text-2xl 4xl:text-3xl text-cyan-blue font-medium mb-2">How We Share Information</h3>
        <p className="mb-1">We do not sell personal data in the ordinary meaning of selling personal data for money.</p>
        <p className="mb-4">We may share personal information in the following situations.</p>
        <h4 className="text-lg font-semibold ">With Service Providers and Subprocessors</h4>
        <p className="mb-2">We may share data with trusted vendors that help us operate Hexa AI, such as:</p>
        <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
          <li>Cloud hosting providers</li>
          <li>Database providers</li>
          <li>AI model providers</li>
          <li>Speech-to-text providers</li>
          <li>Text-to-speech providers</li>
          <li>Telephony providers</li>
          <li>WhatsApp or messaging providers</li>
          <li>Email providers</li>
          <li>Payment processors</li>
          <li>Analytics providers</li>
          <li>Security and monitoring providers</li>
          <li>Customer support tools</li>
          <li>CRM and sales tools</li>
        </ul>
        <p className="mb-4">These providers are authorized to process data only as needed to provide services to us or our Customers.</p>

        <h4 className="text-lg font-semibold ">With Customers</h4>
        <p className="mb-4">If you are an End User interacting with a business through Hexa AI, your messages, calls, recordings, transcripts, contact details, and conversation history may be available to that business.</p>

        <h4 className="text-lg font-semibold ">With Team Members and Authorized Users</h4>
        <p className="mb-4">Customer account owners and admins may access data within their workspace according to role-based permissions.</p>

        <h4 className="text-lg font-semibold">With Integration Partners</h4>
        <p className="mb-4">If a Customer connects Hexa AI to third-party tools, such as CRM systems, calendars, helpdesk tools, WhatsApp Business accounts, or telephony providers, data may be shared with those integrations as configured by the Customer.</p>

        <h4 className="text-lg font-semibold ">For Legal Reasons</h4>
        <p className="mb-2">We may disclose information if required to:</p>

        <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
          <li>Comply with law</li>
          <li>Respond to lawful requests</li>
          <li>Enforce our Terms of Service</li>
          <li>Protect our rights or property</li>
          <li>Investigate security incidents</li>
          <li>Prevent fraud or abuse</li>
          <li>Protect users, Customers, or the public</li>
        </ul>

        <h4 className="text-lg font-semibold ">Business Transfers</h4>
        <p className="mb-2">If Hexa AI is involved in a merger, acquisition, investment, financing, restructuring, or sale of assets, personal data may be transferred as part of that transaction.</p>

      </>
    ),
  },
  { title: "Third-Party Services", 
    content: (
      <>
        <h3 className="text-xl 2xl:text-2xl 4xl:text-3xl text-cyan-blue font-medium mb-2">Third-Party Services</h3>
        <p className="mb-1">Hexa AI may integrate with or rely on third-party services, including but not limited to:</p>
        <ul className="list-disc list-inside mb-1 space-y-0.3 ml-4">
          <li>Meta / WhatsApp Business Platform</li>
          <li>AI model providers</li>
          <li>Telephony providers</li>
          <li>SMS providers</li>
          <li>Speech-to-text providers</li>
          <li>Text-to-speech providers</li>
          <li>Cloud hosting providers</li>
          <li>Payment processors</li>
          <li>CRM systems</li>
          <li>Calendar systems</li>
          <li>Email providers</li>
          <li>Analytics tools</li>
        </ul>
        <p>Third-party services may process data according to their own terms and privacy policies. Customers are responsible for reviewing and accepting the terms of third-party services they connect to Hexa AI.</p>
      </>
    ),
  },
  { title: "Data Retention",
    content: (
      <>
        <h3 className="text-xl 2xl:text-2xl 4xl:text-3xl text-cyan-blue font-medium mb-2">Data Retention</h3>
        <p className="mb-4">
          We retain personal data only for as long as reasonably necessary for the purposes described in this Privacy Policy, unless a longer retention period is required by law, contract, security needs, dispute resolution, or legitimate business purposes.
        </p>
        <p className="mb-2">General retention examples:</p>

        <div className="overflow-x-auto mb-4">
          <table className="w-full border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2 border">Data Type</th>
                <th className="text-left p-2 border">Typical Retention</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="p-2 border">Account data</td>
                <td className="p-2 border">While account is active, then as required for legal/business records</td>
              </tr>

              <tr>
                <td className="p-2 border">Billing records</td>
                <td className="p-2 border">Usually 7 years or as required by tax/accounting law</td>
              </tr>

              <tr>
                <td className="p-2 border">Support messages</td>
                <td className="p-2 border">Up to 3 years after resolution</td>
              </tr>

              <tr>
                <td className="p-2 border">Website analytics</td>
                <td className="p-2 border">Usually 12–24 months</td>
              </tr>

              <tr>
                <td className="p-2 border">Security logs</td>
                <td className="p-2 border">Usually 6–24 months</td>
              </tr>

              <tr>
                <td className="p-2 border">Call logs</td>
                <td className="p-2 border">Based on Customer configuration or contract</td>
              </tr>

              <tr>
                <td className="p-2 border">Call recordings</td>
                <td className="p-2 border">Based on Customer configuration or contract</td>
              </tr>

              <tr>
                <td className="p-2 border">Transcripts</td>
                <td className="p-2 border">Based on Customer configuration or contract</td>
              </tr>

              <tr>
                <td className="p-2 border">WhatsApp/SMS conversation history</td>
                <td className="p-2 border">Based on Customer configuration or contract</td>
              </tr>

              <tr>
                <td className="p-2 border">Imported contact lists</td>
                <td className="p-2 border">Until deleted by Customer or account termination</td>
              </tr>

              <tr>
                <td className="p-2 border">Deleted account data</td>
                <td className="p-2 border">Removed or anonymized within a reasonable period, unless retention is required</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mb-1">Customers may request custom retention settings where supported.</p>
        <p className="mb-2">We may retain anonymized or aggregated data that does not identify individuals.</p>
      </>
    )
  },
  { title: "Data Security",
    content: (
      <>
        <h3 className="text-xl 2xl:text-2xl 4xl:text-3xl text-cyan-blue font-medium mb-2">Data Security</h3>
        <p className="mb-2">We use technical, administrative, and organizational safeguards designed to protect personal data, including:</p>
        <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
          <li>Encryption in transit</li>
          <li>Encryption at rest where applicable</li>
          <li>Access controls</li>
          <li>Role-based permissions</li>
          <li>Authentication controls</li>
          <li>Audit logs</li>
          <li>Network security controls</li>
          <li>Secure cloud infrastructure</li>
          <li>Monitoring and alerting</li>
          <li>Vulnerability management</li>
          <li>Backup and recovery controls</li>
          <li>Internal access restrictions</li>
          <li>Employee confidentiality obligations</li>
        </ul>
        <p className="mb-4">No system is 100% secure. Customers are responsible for securing their own accounts, passwords, API keys, integrations, user permissions, and devices.</p>
      </>
    )
  },
  { title: "International Data Transfers",
    content: (
      <>
        <h3 className="text-xl 2xl:text-2xl 4xl:text-3xl text-cyan-blue font-medium mb-2"> International Data Transfers</h3>
        <p className="mb-4">Hexa AI may process and store data in countries other than the country where you are located. These countries may have data protection laws that differ from your jurisdiction.</p>
        <p className="mb-2">Where required, we use appropriate safeguards for international data transfers, such as:</p>
        <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
          <li>Data processing agreements</li>
          <li>Standard contractual clauses</li>
          <li>Vendor security reviews</li>
          <li>Contractual confidentiality obligations</li>
          <li>Technical and organizational safeguards</li>
        </ul>
        <p className="mb-4">Customers are responsible for ensuring that their use of Hexa AI complies with local data transfer requirements.</p>
      </>
    )
  },
  { title: "Your Privacy Rights",
    content: (
      <>
        <h3 className="text-xl 2xl:text-2xl 4xl:text-3xl text-cyan-blue font-medium mb-2">Your Privacy Rights</h3>
        <p className="mb-1">Depending on your location, you may have rights regarding your personal data.</p>
        <p className="">These rights may include:</p>
        <ul className="list-disc list-inside mb-2 ml-4">
          <li>Right to access your personal data</li>
          <li>Right to correct inaccurate data</li>
          <li>Right to delete your data</li>
          <li>Right to restrict processing</li>
          <li>Right to object to processing</li>
          <li>Right to data portability</li>
          <li>Right to withdraw consent</li>
          <li>Right to opt out of marketing</li>
          <li>Right to opt out of certain data sharing, where applicable</li>
          <li>Right to lodge a complaint with a data protection authority</li>
        </ul>

        <p className="mb-1">To exercise your rights, contact us at:</p>
        <p className="mb-2 ml-4">
          <span className="font-medium">Email: </span>
          <a href="mailto:support@gethexa.ai" className="text-cyan-blue hover:underline">support@gethexa.ai</a>
        </p>
        <p className="">If you are an End User of one of our Customers, we may direct your request to the relevant Customer because they may be the data controller responsible for your data.</p>
      </>
    )
  },
  { title: "California Privacy Notice",
    content: (
      <>
        <h3 className="text-xl 2xl:text-2xl 4xl:text-3xl text-cyan-blue font-medium mb-2">California Privacy Notice</h3>
        <p className="mb-4">This section applies to California residents where the California Consumer Privacy Act, as amended by the California Privacy Rights Act, applies.</p>
        <p className="mb-4">We may collect the following categories of personal information:</p>

        <div className="overflow-x-auto mb-4">
          <table className="w-full border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left px-2 py-1 border">Category</th>
                <th className="text-left px-2 py-1 border">Examples</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="px-2 py-1 border">Identifiers</td>
                <td className="px-2 py-1 border">Name, email, phone number, IP address, account ID</td>
              </tr>

              <tr>
                <td className="px-2 py-1 border">Commercial informatio</td>
                <td className="px-2 py-1 border">Subscription plan, billing status, invoice records</td>
              </tr>

              <tr>
                <td className="px-2 py-1 border">Internet activity</td>
                <td className="px-2 py-1 border">Website visits, dashboard usage, device data</td>
              </tr>

              <tr>
                <td className="px-2 py-1 border">Audio/electronic data</td>
                <td className="px-2 py-1 border">Call recordings, voice inputs, transcripts, messages</td>
              </tr>

              <tr>
                <td className="px-2 py-1 border">Professional information</td>
                <td className="px-2 py-1 border">Company name, job title, business contact details</td>
              </tr>

              <tr>
                <td className="px-2 py-1 border">Geolocation data</td>
                <td className="px-2 py-1 border">Approximate location based on IP address</td>
              </tr>

              <tr>
                <td className="px-2 py-1 border">Inferences</td>
                <td className="px-2 py-1 border">Usage patterns, AI agent performance insights</td>
              </tr>

              <tr>
                <td className="px-2 py-1 border">Sensitive personal information</td>
                <td className="px-2 py-1 border">Only where provided by Customer or required for specific use cases</td>
              </tr>

            </tbody>
          </table>
        </div>

        <p className="mb-2">We use this information for the purposes described in this Privacy Policy.</p>
        <p className="mb-4">We do not knowingly sell personal information for money. If any activity is considered “sharing” under California law, you may have the right to opt out.</p>

        <p className="mb-2">California residents may have the right to:</p>
        <ul className="list-disc list-inside mb-4 ml-4">
          <li>Know what personal information we collect</li>
          <li>Access personal information</li>
          <li>Delete personal information</li>
          <li>Correct inaccurate personal information</li>
          <li>Opt out of sale or sharing</li>
          <li>Limit use of sensitive personal information</li>
          <li>Not be discriminated against for exercising privacy rights</li>
        </ul>
        <p className="mb-1">Requests can be submitted to:</p>
        <p className="mb-4 ml-4">
          <span className='font-medium'>Email: </span>
          <a href="mailto:support@gethexa.ai" className="text-cyan-blue hover:underline">support@gethexa.ai</a>
        </p>
      </>
    )
  },
  { title: "GDPR / UK GDPR Notice",
    content: (
      <>
        <h3 className="text-xl 2xl:text-2xl 4xl:text-3xl text-cyan-blue font-medium mb-2">GDPR / UK GDPR Notice</h3>
        <p className="mb-4">If you are located in the European Economic Area, United Kingdom, or another region with similar privacy laws, the following applies.</p>

        <h4 className="text-lg font-semibold mb-1">Controller</h4>
        <p className="mb-1">For account, website, billing, marketing, and support data, the controller is:</p>

        <p className=" ml-4 font-medium">Hexa AI</p>
        {/* <p className="mb-4"> [772/A, G4 block Johar Town Lahore, Lahore, Pakistan, 54000]</p> */}
        <p className="mb-3 ml-4">
          <span className='font-medium'>Email: </span>
          <a href="mailto:support@gethexa.ai" className="text-cyan-blue hover:underline">support@gethexa.ai</a>
        </p>

        <h4 className="text-lg font-semibold mb-1">Processor</h4>
        <p className="mb-3">For Customer conversation data, campaign data, imported contacts, call recordings, transcripts, WhatsApp messages, SMS messages, and AI agent workflows, Hexa AI generally acts as a processor on behalf of the Customer.</p>

        {/* <h4 className="text-lg font-semibold mb-2">Data Protection Officer</h4>
        <p className="mb-2">If applicable:</p>
        <p className="mb-2 ml-4">[DPO Name / DPO Contact]</p>
        <p className="mb-2">If no DPO is appointed:</p>
        <p className="mb-2 ml-4">For privacy matters, contact <a href="mailto:support@gethexa.ai" className="text-cyan-blue hover:underline">support@gethexa.ai</a>.</p> */}

        <h4 className="text-lg font-semibold mb-1">Supervisory Authority</h4>
        <p className="mb-2">You may have the right to lodge a complaint with your local data protection authority.</p>
      </>
    )
  },
  { title: "Children's Privacy",
    content: (
      <>
        <h3 className="text-xl 2xl:text-2xl 4xl:text-3xl text-cyan-blue font-medium mb-2">Children's Privacy</h3>
        <p className="mb-2">Hexa AI is intended for business use and is not directed to children.</p>
        <p className="mb-2">We do not knowingly collect personal information from children under the age required by applicable law. If we become aware that we have collected personal information from a child without proper authorization, we will take steps to delete it.</p>
        <p className="mb-2">Customers must not use Hexa AI to knowingly collect data from children unless they have a lawful basis and required parental or guardian consent.</p>
      </>
    )
  },
  { title: "Healthcare and Regulated Data",
    content: (
      <>
        <h3 className="text-xl 2xl:text-2xl 4xl:text-3xl text-cyan-blue font-medium mb-2">Healthcare and Regulated Data</h3>
        <p className="mb-2">Hexa AI may be used by Customers in regulated industries, including healthcare, finance, insurance, legal services, or employment-related workflows.</p>
        <p className="mb-2">Unless we have signed a specific written agreement, such as a Business Associate Agreement where required, Customers must not use Hexa AI to process protected health information or other highly regulated data.</p>
        <p className="mb-2">Customers are responsible for ensuring that their use of Hexa AI complies with applicable industry-specific laws, regulations, consent requirements, and security standards.</p>
      </>
    )
  },
  { title: "Customer Responsibilities",
    content: (
    <>
      <h3 className="text-xl 2xl:text-2xl 4xl:text-3xl text-cyan-blue font-medium mb-2">Customer Responsibilities</h3>
      <p className="mb-2">Customers using Hexa AI are responsible for:</p>

      <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
        <li>Providing their own privacy notices to End Users</li>
        <li>Obtaining legally required consent</li>
        <li>Ensuring imported contacts are lawful</li>
        <li>Managing opt-ins and opt-outs</li>
        <li>Configuring AI agents responsibly</li>
        <li>Reviewing AI outputs where appropriate</li>
        <li>Avoiding unlawful, harmful, misleading, or discriminatory use</li>
        <li>Securing account credentials</li>
        <li>Managing user roles and permissions</li>
        <li>Complying with call recording laws</li>
        <li>Complying with WhatsApp, SMS, telecom, and anti-spam rules</li>
        <li>Responding to End User privacy requests where the Customer is the controller</li>
      </ul>
    </>
    ),
  },
  { title: "Prohibited Use of Personal Data",
    content: (
    <>
      <h3 className="text-xl 2xl:text-2xl 4xl:text-3xl text-cyan-blue font-medium mb-2">Prohibited Use of Personal Data</h3>
      <p className="mb-2">Customers must not use Hexa AI to:</p>

      <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
        <li>Send spam or unlawful bulk messages</li>
        <li>Harass, threaten, or deceive individuals</li>
        <li>Impersonate others</li>
        <li>Collect data without proper notice or consent</li>
        <li>Process sensitive data unlawfully</li>
        <li>Make illegal automated decisions</li>
        <li>Violate WhatsApp, Meta, telecom, or messaging platform rules</li>
        <li>Upload data they do not have permission to use</li>
        <li>Use AI agents for fraud, phishing, scams, or harmful content</li>
      </ul>
      <p>We may suspend or terminate access if we detect misuse.</p>
    </>
    ),
  },
  { title: "Data Deletion",
    content: (
    <>
      <h3 className="text-xl 2xl:text-2xl 4xl:text-3xl text-cyan-blue font-medium mb-2">Data Deletion</h3>
      <p className="mb-2">Customers may delete certain data through the Hexa AI dashboard where supported.</p>
      <p className="mb-2">You may also request deletion by contacting:</p>
      <p className="mb-4 ml-4"><span className='font-medium'>Email: </span><a href="mailto:support@gethexa.ai" className="text-cyan-blue hover:underline">support@gethexa.ai</a></p>

      <p className="mb-2">Deletion may be limited where retention is required for:</p>
      <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
        <li>Legal obligations</li>
        <li>Security investigations</li>
        <li>Billing records</li>
        <li>Dispute resolution</li>
        <li>Fraud prevention</li>
        <li>Backup systems</li>
        <li>Contractual obligations</li>
      </ul>
      <p>Backup copies may remain for a limited period before being securely deleted or overwritten.</p>
    </>
    ),
  },
  { title: "Data Breach Notification",
    content: (
      <>
        <h3 className="text-xl 2xl:text-2xl 4xl:text-3xl text-cyan-blue font-medium mb-2">Data Breach Notification</h3>
        <p className="mb-2">If we become aware of a security incident involving personal data, we will investigate and take appropriate steps.</p>
        <p className="mb-2">Where required by law or contract, we will notify affected Customers, users, authorities, or individuals.</p>
        <p className="mb-2">Customers are responsible for notifying their own End Users where they act as the data controller.</p>
      </>
    )
  },
  { title: "Do Not Track",
    content: (
      <>
        <h3 className="text-xl 2xl:text-2xl 4xl:text-3xl text-cyan-blue font-medium mb-2">Do Not Track</h3>
        <p className="mb-4">Some browsers offer <span className='font-medium'>Do Not Track</span> signals. Because there is no consistent industry standard for responding to these signals, we may not respond to them. You can control cookies through your browser settings or cookie preferences where available.</p>
      </>
    )
  },
  { title: "Changes to This Privacy Policy",
    content: (
      <>
        <h3 className="text-xl 2xl:text-2xl 4xl:text-3xl text-cyan-blue font-medium mb-2">Changes to This Privacy Policy</h3>
        <p className="mb-2">We may update this Privacy Policy from time to time.</p>
        <p className="mb-2">When we make changes, we will update the <span className='font-medium'>Last Updated</span> date. If changes are material, we may provide additional notice, such as through the website, dashboard, or email.</p>
        <p className="mb-2">Your continued use of the Services after an update means you acknowledge the updated Privacy Policy.</p>
      </>
    )
  },
  { title: "Contact Us",
    content: (
      <>
        <h3 className="text-xl 2xl:text-2xl 4xl:text-3xl text-cyan-blue font-medium mb-2">Contact Us</h3>
        <p className="mb-2">For privacy questions, requests, or concerns, contact us at:</p>

        <div className="ml-4 space-y-1">
          <p className="font-medium">Hexa AI Privacy Team</p>
          <p className="font-medium">Hexa AI</p>
          <p className="">
            <span className='font-medium'>Email: </span>
            <a href="mailto:support@gethexa.ai" className="text-cyan-blue hover:underline">support@gethexa.ai</a>
          </p>
          <p className="">
            <span className='font-medium'>Website: </span> 
            <a href="https://gethexa.ai/" target="_blank" rel="noopener noreferrer" className="text-cyan-blue hover:underline">
              https://gethexa.ai/
            </a>
          </p>
        </div>
      </>
    )
  },
];

const PrivacyPolicy = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: title,
            description,
            url,
          }),
        }}
      />
    {/* Header Section */}
    <div className="relative md:w-11/12 2xl:w-10/12 max-w-7xl md:mt-4 mx-auto  mb-12 md:mb-24 md:bg-contain"
      style={{
        backgroundImage: `url(${PrivacyHeroBg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="font-dm-sans py-10 md:py-16 space-y-2 flex flex-col items-center relative">
        <p className="text-slate-gray text-sm lg:text-base 2xl:text-lg 4xl:text-xl font-light">Last Updated: January 1, 2026</p>
        <h1 className='text-3xl lg:text-4xl 2xl:text-5xl 4xl:text-7xl font-medium bg-linear-to-r from-cyan-blue to-neon-pink bg-clip-text text-transparent'>
          Privacy Policy
        </h1>
        <p className="text-slate-gray text-sm lg:text-base 2xl:text-lg 4xl:text-xl font-light">How Hexa Ai handles your data</p>
      </div>
    </div>

    <LegalTabs tabsData={tabsData} />
    </>
  )
}

export default PrivacyPolicy