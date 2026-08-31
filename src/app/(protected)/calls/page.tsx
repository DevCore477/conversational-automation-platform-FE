"use client";

import { MakeCallForm } from "@/app/(protected)/calls/components/make-call.form";
import { PlatformInboundVoiceSettingsForm } from "@/app/(protected)/calls/components/platform-inbound-voice-settings.form";
import { PlatformPhoneRouteSettingsForm } from "@/app/(protected)/calls/components/platform-phone-route-settings.form";
import { useRBAC } from "@/hooks/use-rbac";

export default function CallsPage() {
  const { isAdmin, isCompanyUser } = useRBAC();
  const isPlatformAdmin = isAdmin && !isCompanyUser;

  if (isPlatformAdmin) {
    return (
      <main className="flex-1 space-y-6 p-4 lg:p-6 h-full">
        <div className="flex flex-col gap-6 items-start">
          <MakeCallForm />
          <PlatformInboundVoiceSettingsForm />
          <PlatformPhoneRouteSettingsForm />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 space-y-6 p-4 lg:p-6">
      <MakeCallForm />
    </main>
  );
}
