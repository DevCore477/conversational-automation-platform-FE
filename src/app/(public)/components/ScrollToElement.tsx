"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export const useRouteScroll = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    () => new URLSearchParams(typeof window !== "undefined" ? window.location.search : "")
  );
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    pathnameRef.current = pathname;
    setSearchParams(new URLSearchParams(window.location.search));
  }, [pathname]);

  useEffect(() => {
    const origPushState = history.pushState;
    const origReplaceState = history.replaceState;

    const trigger = () => {
      setSearchParams(new URLSearchParams(window.location.search));
    };

    history.pushState = function (...args) {
      origPushState.apply(this, args);
      trigger();
    };

    history.replaceState = function (...args) {
      origReplaceState.apply(this, args);
      trigger();
    };

    window.addEventListener("popstate", trigger);

    return () => {
      history.pushState = origPushState;
      history.replaceState = origReplaceState;
      window.removeEventListener("popstate", trigger);
    };
  }, []);

  const scrollTo = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const routeToSection = useCallback(
    (path: string, sectionId: string) => {
      const currentScroll = searchParams?.get("scrollTo");

      if (pathnameRef.current === path && currentScroll === sectionId) {
        scrollTo(sectionId);
        return;
      }

      if (pathnameRef.current === path) {
        router.replace(`${path}?scrollTo=${sectionId}`);
        scrollTo(sectionId);
        return;
      }

      router.push(`${path}?scrollTo=${sectionId}`);
    },
    [router, searchParams]
  );

  useEffect(() => {
    const section = searchParams.get("scrollTo");
    if (!section) return;

    const timeout = setTimeout(() => {
      scrollTo(section);
    }, 100);

    return () => clearTimeout(timeout);
  }, [searchParams]);

  return { routeToSection };
};
