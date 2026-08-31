"use client";

import Image from "next/image";
import Link from "next/link";

import { useThemeStore } from "@/store/theme.store";
import { useAuthStore } from "@/store/auth.store";
import { UserRole } from "@/common/enums/user.types";

interface MainLogoProps {
  className?: string;
  path?: string;
  showText?: boolean;
  width?: number;
  height?: number;
  logoClassName?: string;
}

function MainLogo({
  className = "",
  path = "/",
  showText = false,
  width = 32,
  height = 24,
  logoClassName = "",
}: MainLogoProps) {

  const { theme } = useThemeStore();
  const user = useAuthStore((s) => s.user);
  const isPlatformAdmin = user?.role === UserRole.ADMIN && !user?.companyId;
  const showSkeleton = theme === null && !isPlatformAdmin;

  if (showSkeleton) {
    return (
      <Link href={path} className={`flex items-center justify-center gap-2 ${className}`} prefetch={false}>
        <div className="h-[24px] w-[32px] animate-pulse rounded bg-gray-200" />
        {showText && <div className="hidden h-4 w-20 animate-pulse rounded bg-gray-200 md:block" />}
      </Link>
    );
  }

  const logoSrc = theme?.logo && theme.logo.trim() !== "" ? theme.logo : "/logo_default.png";
  const isThemeLogo = logoSrc !== "/logo_default.png";

  return (
  <Link
    href={path}
      className={`flex items-center justify-center ${
        isThemeLogo ? "flex-col gap-2" : "gap-2"
      } ${className}`}
      prefetch={false}
      >
      <div
        className={
          isThemeLogo ? "relative h-[20px] w-full max-w-[160px] sm:h-[24px] md:h-[30px] lg:h-[36px]" : "relative"
        }
      >
        <Image
          src={logoSrc}
          alt="Hexa AI Logo"
          width={isThemeLogo ? 160 : width}
          height={isThemeLogo ? 64 : height}
          className={`object-contain transition-opacity duration-300 ${
            isThemeLogo ? "h-full w-full" : ""
          } ${logoClassName}`}
          priority
        />
      </div>

      {showText && (
        <span className="hidden truncate font-semibold md:block">Hexa AI</span>
      )}
    </Link>
  );
}

export { MainLogo };