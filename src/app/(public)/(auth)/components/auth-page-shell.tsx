import Image from "next/image";
import Link from "next/link";

import { BackButton } from "@/app/(public)/components/BackLink";
import { HexaRGBLogo } from "@/assets";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { cn } from "@/lib/utils";

type AuthPageShellProps = {
  children: React.ReactNode;
  showBackButton?: boolean;
  backHref?: string;
  contentClassName?: string;
  centered?: boolean;
};

export function AuthPageShell({
  children,
  showBackButton = false,
  backHref = "/login",
  contentClassName,
  centered = false,
}: AuthPageShellProps) {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-background-login">
      <BackgroundGradient />

      <div className="absolute left-[12.5%] top-[4%] flex items-center gap-3">
        <Link
          href="/"
          className="flex cursor-pointer items-center gap-2"
        >
          <Image
            src={HexaRGBLogo}
            className="h-auto w-[30px] md:w-[36px]"
            alt="Hexa Logo"
          />
          <span className="text-lg font-bold text-auth-body md:text-xl">
            Hexa Ai
          </span>
        </Link>
      </div>

      {showBackButton && (
        <div
          className={cn(
            "absolute left-[12.5%] top-[12%] flex items-center gap-3 md:top-[16%]",
          )}
        >
          <BackButton href={backHref} />
        </div>
      )}

      <div
        className={cn(
          "relative z-10 w-full max-w-sm px-4 md:px-0",
          centered && "flex flex-col items-center justify-center gap-8",
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
