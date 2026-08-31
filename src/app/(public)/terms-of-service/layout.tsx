import type { Metadata } from "next";

const title = "Terms of Service | Hexa AI";
const description =
  "Hexa AI Terms of Service — the terms governing your use of our AI voice agent, WhatsApp automation, and communication platform.";
const url = "https://gethexa.ai/terms-of-service";
const ogImage = "/og-image.png";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Hexa AI terms of service",
    "AI voice platform terms",
    "AI calling service agreement",
    "WhatsApp automation terms",
    "AI agent usage terms",
    "call automation service terms",
    "business AI platform terms",
    "voice bot service agreement",
    "AI communication platform terms",
    "SaaS terms AI calling",
    "automated calling terms conditions",
    "conversational AI platform terms",
    "AI voice provider terms",
    "call data usage policy",
    "AI platform acceptable use",
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

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      {children}
    </>
  );
}
