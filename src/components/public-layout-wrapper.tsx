"use client";

import { usePathname } from "next/navigation";

import NavBar from "@/app/(public)/components/NavBar";
import FooterSection from "@/app/(public)/components/sections/FooterSection";

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/accept-invite",
];

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isAuthRoute) {
    return children;
  } else {
    return (
      <div className="bg-website-background w-full">
        <NavBar />
        {children}
        <FooterSection />
      </div>
    );
  }
}
