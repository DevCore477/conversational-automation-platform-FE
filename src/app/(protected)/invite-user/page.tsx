"use client";

import { InviteUserForm } from "@/app/(protected)/invite-user/components/invite-user.form";
import { RBACGuard } from "@/components/auth";

/**
 * Invite User Page (Admin Only)
 * This page allows admins to invite new team members
 */
export default function InviteUsers() {
  return (
    <RBACGuard requireAdmin redirectTo="/dashboard">
      <main className="flex-1 space-y-6 p-6">
        <InviteUserForm />
      </main>
    </RBACGuard>
  );
}
