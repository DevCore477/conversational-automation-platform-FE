"use client";

import Image from "next/image";
import Link from "next/link";

import { useThemeStore } from "@/store/theme.store";
import { useCompanyStore } from "@/store/company.store";

interface CompanyLogoProps {
  className?: string;
  path?: string;
  showText?: boolean;
  width?: number;
  height?: number;
  isCollapsed?: boolean;
}

function CompanyLogo({
  className = "",
  path = "/",
  showText = false,
  width = 32,
  height = 24,
  isCollapsed = false,
}: CompanyLogoProps) {
  // const { resolvedTheme } = useTheme();
  const { theme } = useThemeStore();
  // const [mounted, setMounted] = useState(false);
  const { company, isLoading } = useCompanyStore();
  // useEffect(() => {
  //   setMounted(true);
  // }, []);
  // const currentTheme = mounted ? (resolvedTheme || theme) : 'light';
  const logoSrc = company?.logo
    ? company.logo !== ""
      ? company.logo
      : ""
    : "";
  const companyName = company?.name || "";
  const firstLetter = companyName.charAt(0).toUpperCase();

  if (isCollapsed) {
    if (logoSrc.trim() === "") {
      return null;
    }
    return (
      <Link
        href={path}
        className={`flex justify-center items-center ${className}`}
        prefetch={false}
      >
        <Image
          src={logoSrc}
          alt={companyName}
          width={28}
          height={28}
          className="object-contain"
        />
      </Link>
    );
  }

  return (
    <Link
      href={path}
      className={`flex justify-center items-center gap-2 ${className}`}
      prefetch={false}
    >
      <div className="relative">
        {logoSrc.trim() !== "" && (
          <Image
            src={logoSrc}
            alt="Hexa AI Logo"
            width={width}
            height={height}
            className="object-contain transition-opacity duration-300"
          />
        )}
      </div>
      <span
        className="hidden md:block truncate font-semibold"
        title={company?.name}
      >
        {company?.name}
      </span>
    </Link>
  );
}

export { CompanyLogo };
