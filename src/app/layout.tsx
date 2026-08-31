import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";

import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/app/providers/auth.provider";

import "./globals.css";
import "./flow-builder.css";

// DM Sans font configuration
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const siteUrl = "https://gethexa.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
  },
  title: "Hexa-AI | Automated Voice Calling & Bulk WhatsApp Platform",
  description:
    "Automate inbound & outbound calls with human-like AI agents, custom script flows, and live dashboards. Scale marketing with automated Meta WhatsApp bulk messaging.",
  keywords: [
    "AI calling software",
    "AI phone agent",
    "AI voice calling platform",
    "automated outbound calling",
    "AI call automation",
    "WhatsApp bulk messaging",
    "AI voice agents",
    "conversational AI platform",
    "business phone automation",
    "intelligent virtual agent",
    "AI-powered customer communication",
    "automated call center solution",
    "voice AI for business",
    "AI phone automation platform",
  ],
  openGraph: {
    type: "website",
    siteName: "Hexa-AI",
    locale: "en_US",
    url: siteUrl,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    title: "Hexa-AI | Automated Voice Calling & Bulk WhatsApp Platform",
    description:
      "Automate inbound & outbound calls with human-like AI agents, custom script flows, and live dashboards. Scale marketing with automated Meta WhatsApp bulk messaging.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hexa-AI | Automated Voice Calling & Bulk WhatsApp Platform",
    description:
      "Automate inbound & outbound calls with human-like AI agents, custom script flows, and live dashboards. Scale marketing with automated Meta WhatsApp bulk messaging.",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-svh bg-background font-sans",
          dmSans.variable,
          "antialiased",
        )}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="root"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="relative flex min-h-svh flex-col bg-background">
              {children}
            </div>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${siteUrl}/#organization`,
                  name: "Hexa-AI",
                  url: siteUrl,
                  logo: `${siteUrl}/logo_default.png`,
                  description:
                    "AI-powered voice agents and WhatsApp automation platform for businesses.",
                  foundingDate: "2024",
                  contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "support",
                    email: "support@gethexa.ai",
                    url: `${siteUrl}/connect-us`,
                  },
                  sameAs: [
                    "https://www.facebook.com/share/1GYJuo89Ab/",
                    "https://www.instagram.com/gethexa.ai/",
                    "https://www.linkedin.com/company/gethexai/",
                    "https://x.com/GethexaAi",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": `${siteUrl}/#website`,
                  url: siteUrl,
                  name: "Hexa-AI",
                  description:
                    "Automate inbound & outbound calls with human-like AI agents, custom script flows, and live dashboards.",
                  publisher: { "@id": `${siteUrl}/#organization` },
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": `${siteUrl}/#software`,
                  name: "Hexa-AI",
                  applicationCategory: "BusinessApplication",
                  operatingSystem: "Web",
                  description:
                    "AI-powered platform for voice calling, WhatsApp messaging, and customer communication automation.",
                  url: siteUrl,
                  author: { "@id": `${siteUrl}/#organization` },
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
