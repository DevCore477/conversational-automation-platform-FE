import { Suspense } from "react";
import { getBlogs } from "@/lib/blog-data";
import BlogPageClient from "./components/blog-page-client";

const title = "Blog | AI Voice Automation & Omnichannel Platform | Hexa-AI";
const description =
  "Explore the latest insights, guides, and news about AI voice agents, call automation, WhatsApp marketing, and omnichannel communication from Hexa-AI.";
const url = "https://gethexa.ai/blog";
const ogImage = "/og-image.png";

export async function generateMetadata() {
  return {
    title,
    description,
    keywords: [
      "AI voice blog",
      "voice automation insights",
      "AI calling guide",
      "Hexa AI blog",
      "conversational AI articles",
      "call automation tips",
      "WhatsApp marketing blog",
      "AI agent tutorials",
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

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: title,
            description,
            url,
          }),
        }}
      />
      <Suspense fallback={<div className="min-h-screen" />}>
        <BlogPageClient blogs={blogs} />
      </Suspense>
    </>
  );
}
