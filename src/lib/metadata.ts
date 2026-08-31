import type { Metadata } from "next";

const siteName = "Hexa-AI";
const siteUrl = "https://gethexa.ai";

export function createMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName,
      locale: "en_US",
      url: siteUrl,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: siteUrl,
    },
  };
}
