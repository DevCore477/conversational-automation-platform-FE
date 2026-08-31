import Image from "next/image";
import Link from "next/link";

import { AuthPageShell } from "@/app/(public)/(auth)/components/auth-page-shell";
import {
  authGradientHeadingClass,
  authSuccessBodyClass,
} from "@/app/(public)/(auth)/components/auth-form.styles";
import { SuccessIcon } from "@/assets";

export default function PasswordChangedPage() {
  return (
    <AuthPageShell centered>
      <Image src={SuccessIcon} alt="Success" />
      <div className="flex flex-col items-center gap-6 px-4 text-center">
        <h1 className={authGradientHeadingClass}>Successfully</h1>
        <p className={`${authSuccessBodyClass} max-w-[500px]`}>
          Your password has been changed now you can access your account with a
          new password.
        </p>
        <p className="text-base text-auth-body sm:text-sm md:text-sm">
          <Link
            href="/login"
            className="bg-gradient-to-r from-[#0EA5E9] to-[#EE10E5] bg-clip-text font-medium text-transparent underline"
          >
            Back to Sign In
          </Link>
        </p>
      </div>
    </AuthPageShell>
  );
}
