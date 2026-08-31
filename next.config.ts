import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ESLint during `next build` can be very slow and log thousands of warnings on small VPS/CI.
  // Run `npm run lint` locally or in a separate CI job; production builds stay fast and reliable.
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Optimize package imports to reduce bundle size
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "date-fns",
      "zustand",
      "sonner",
    ],
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hexa-ai-bucket.s3.ap-south-1.amazonaws.com",
        pathname: "/stage/logo/**",
      },
      // Add production bucket if different
      {
        protocol: "https",
        hostname: "hexa-ai-bucket.s3.ap-south-1.amazonaws.com",
        pathname: "/prod/logo/**",
      },
    ],
  },


  // Redirects
  async redirects() {
    return [
      // {
      //   source: "/",
      //   destination: "/dashboard",
      //   permanent: true,
      // },
    ];
  },
};

export default nextConfig;