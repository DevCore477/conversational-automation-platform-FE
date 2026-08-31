"use client";

import { Building2 } from "lucide-react";
import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRBAC } from "@/hooks/use-rbac";
import { useCompanyStore } from "@/store/company.store";

type SuperAdminCompanyScopePickerProps = {
  /** Path to navigate to with `?companyId=` (e.g. `/agents`, `/conversation-flow`) */
  scopePath: string;
  title: string;
  description: string;
};

/**
 * Lets platform admins (JWT admin without a company) choose which tenant to scope
 * before loading company-specific data.
 */
export function SuperAdminCompanyScopePicker({
  scopePath,
  title,
  description,
}: SuperAdminCompanyScopePickerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAdmin, isCompanyUser } = useRBAC();
  const isPlatformAdmin = isAdmin && !isCompanyUser;
  const { allCompanies, fetchAllCompanies } = useCompanyStore();
  const currentCompanyId = searchParams.get("companyId");

  useEffect(() => {
    if (isPlatformAdmin) {
      void fetchAllCompanies();
    }
  }, [isPlatformAdmin, fetchAllCompanies]);

  if (!isPlatformAdmin) {
    return null;
  }

  const handleCompanyChange = (companyId: string) => {
    // Create new URLSearchParams from current params
    const params = new URLSearchParams(searchParams.toString());
    
    // Update or add companyId
    if (companyId) {
      params.set("companyId", companyId);
    } else {
      params.delete("companyId");
    }
    
    // Construct new URL
    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    
    // Use router.push for client-side navigation (no full page reload)
    router.push(newUrl);
  };

  const selectedCompany = allCompanies.find(c => c.id === currentCompanyId);

  return (
    <div className="bg-surface-soft-light p-[5px] border rounded-2xl">
      <Card className="grid grid-cols-1 md:grid-cols-7 justify-between items-center border-none">
        <CardHeader className="pb- bg-sidebar md:col-span-4">
          <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
            <Building2 className="h-4 w-4" />
            {title}
          </CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
        </CardHeader>
        <CardContent className="md:col-span-3">
          <Select
            value={currentCompanyId || ""}
            onValueChange={handleCompanyChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a company">
                {/* {selectedCompany?.name} */}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {allCompanies.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
}