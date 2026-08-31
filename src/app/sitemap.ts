import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://gethexa.ai";

  const routes = [
    "",
    "/about-us",
    "/careers",
    "/connect-us",
    "/integrations",
    "/multilingual-support",
    "/privacy-policy",
    "/terms-of-service",
    "/product/book-appointment",
    "/product/call-transfer",
    "/product/knowledge-base",
    "/product/navigate-ivr",
    "/product/post-call-analysis",
    "/product/verified-phone-numbers",
    "/use-cases/automated-orders",
    "/use-cases/banking",
    "/use-cases/customer-feedback",
    "/use-cases/customer-support",
    "/use-cases/education",
    "/use-cases/healthcare",
    "/use-cases/logistics",
    "/use-cases/real-estate",
    "/use-cases/receptionist",
    "/use-cases/sales",
    "/case-studies/dental-clinic",
    "/case-studies/marketing-agency",
    "/case-studies/banking-finance",
    "/case-studies/restaurant-order-management",
    "/case-studies/courier-logistics",
  ];

  return routes.map((route) => {
    const url = `${base}${route}`;

    const isHome = route === "";
    const isProduct = route.startsWith("/product/");
    const isUseCase = route.startsWith("/use-cases/");
    const isLegal = route === "/privacy-policy" || route === "/terms-of-service";
    const isSupport =
      route === "/connect-us" ||
      route === "/integrations" ||
      route === "/about-us" ||
      route === "/careers" ||
      route === "/multilingual-support";

    const changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] =
      isHome ? "weekly" : isLegal ? "yearly" : "monthly";

    const priority: MetadataRoute.Sitemap[number]["priority"] = isHome
      ? 1
      : isProduct
        ? 0.9
        : isUseCase
          ? 0.8
          : isSupport
            ? 0.6
            : 0.5;

    return {
      url,
      lastModified: new Date(),
      changeFrequency,
      priority,
    };
  });
}
