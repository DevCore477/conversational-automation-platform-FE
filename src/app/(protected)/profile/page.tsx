import { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/data";
import { isGlobalPlatformAdmin } from "@/lib/rbac.utils";
import { ProfilePageClient } from "./components/profile-page-client";

export const metadata: Metadata = {
  title: "Profile | Hexa AI",
  description: "Your account profile",
};

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const isPlatformAdmin = isGlobalPlatformAdmin(currentUser);

  return (
    <ProfilePageClient
      user={currentUser}
      isPlatformAdmin={isPlatformAdmin}
      companyRole={currentUser.companyRole}
      companyStatus={currentUser.companyStatus}
    />
  );
}
