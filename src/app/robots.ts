import type { MetadataRoute } from "next";

const siteUrl = "https://gethexa.ai";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/accept-invite",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

