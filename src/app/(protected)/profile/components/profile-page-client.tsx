"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { User, Building2, Pencil, Save, X, Heading3 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCompanyForProfile, updateCurrentUser } from "../actions";
import type { Company } from "@/types/company.types";
import { useThemeStore } from "@/store/theme.store";

interface ProfilePageClientProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role?: string;
    companyId?: string;
    createdAt?: string;
  };
  isPlatformAdmin: boolean;
  companyRole?: string;
  companyStatus?: string;
}

const platformAdminSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.string().min(1, "Role is required"),
});

const companyUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

type PlatformAdminFormValues = z.infer<typeof platformAdminSchema>;
type CompanyUserFormValues = z.infer<typeof companyUserSchema>;

export function ProfilePageClient({
  user,
  isPlatformAdmin,
  companyRole,
  companyStatus,
}: ProfilePageClientProps) {
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoadingCompany, setIsLoadingCompany] = useState(!isPlatformAdmin);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { theme } = useThemeStore();
  const form = useForm<PlatformAdminFormValues | CompanyUserFormValues>({
    resolver: zodResolver(
      isPlatformAdmin ? platformAdminSchema : companyUserSchema,
    ),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      ...(isPlatformAdmin ? { role: user.role || "member" } : {}),
    },
  });

  useEffect(() => {
    if (isPlatformAdmin) {
      setIsLoadingCompany(false);
      return;
    }

    async function fetchCompany() {
      try {
        const companyData = await getCompanyForProfile();
        setCompany(companyData);
      } catch (error) {
        console.error("Failed to fetch company:", error);
      } finally {
        setIsLoadingCompany(false);
      }
    }

    fetchCompany();
  }, [isPlatformAdmin]);

  useEffect(() => {
    if (!isEditing) {
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        ...(isPlatformAdmin ? { role: user.role || "member" } : {}),
      });
    }
  }, [isEditing, user, form, isPlatformAdmin]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const onSubmit = async (
    data: PlatformAdminFormValues | CompanyUserFormValues,
  ) => {
    setIsSaving(true);
    try {
      const result = await updateCurrentUser(user.id, isPlatformAdmin, data);
      if (result.success) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="flex-1 space-y-2 md:space-y-6 p-4 lg:p-6">
      <PageHeader
        title="Profile"
        description="View and update your account information"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm xs:text-base">
              <User className="size-5" />
              Personal Information
            </CardTitle>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="size-4 4xl:size-5 xs:mr-1" />
                <span className="hidden xs:inline 4xl:text-base">Edit</span>
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {!isPlatformAdmin && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium leading-none">
                        Email
                      </p>
                      <Input
                        type="email"
                        value={user.email}
                        disabled
                        readOnly
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed.
                      </p>
                    </div>
                  )}
                  {isPlatformAdmin && (
                    <>
                      <div className="space-y-2">
                        <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Email
                        </p>
                        <Input
                          type="email"
                          value={user.email}
                          disabled
                          readOnly
                          className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">
                          Email cannot be changed.
                        </p>
                      </div>
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="member">Member</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      <X className="h-4 w-4 mr-" />
                      Cancel
                    </Button>
                    <Button 
                      type="submit" disabled={isSaving} 
                      showWave waveColor={theme?.primaryColor}
                    >
                      <Save className="size-4 mr-1" />
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-1">
                  <h3 className="text-sm md:text-base 4xl:text-lg font-medium text-text-dark dark:text-accent-foreground">
                    Full Name:
                  </h3>
                  <p className="text-sm md:text-base 4xl:text-lg text-muted-foreground">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-sm md:text-base 4xl:text-lg font-medium text-text-dark dark:text-accent-foreground">
                    Email
                  </h3>
                  <p className="text-sm md:text-base 4xl:text-lg text-muted-foreground">{user.email}</p>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-sm md:text-base 4xl:text-lg font-medium text-text-dark dark:text-accent-foreground">
                    Role
                  </h3>
                  <p className="capitalize text-sm md:text-base 4xl:text-lg text-muted-foreground">
                    {isPlatformAdmin
                      ? user.role || "member"
                      : companyRole || "member"}
                  </p>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-sm md:text-base 4xl:text-lg font-medium text-text-dark dark:text-accent-foreground">
                    Member Since
                  </h3>
                  <p className="text-sm md:text-base 4xl:text-lg text-muted-foreground">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {isPlatformAdmin ? (
          <Card className="gap-2!">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm xs:text-base">
                <Building2 className="h-5 w-5" />
                Platform Admin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs md:text-sm text-muted-foreground">
                You are a platform administrator with access to manage
                organizations and system settings.
              </p>
              {/* <div className="space-y-4 mt-4">
                <div className="grid gap-1">
                  <h3 className="text-sm lg:text-base font-medium text-text-dark dark:text-accent-foreground">
                    Company Role
                  </h3>
                  <p className="text-sm md:text-lg text-muted-foreground">
                    {companyRole}
                  </p>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-sm lg:text-base font-medium text-text-dark dark:text-accent-foreground">
                    Company Status
                  </h3>
                  <p className="text-sm md:text-lg text-muted-foreground">
                    {companyStatus}
                  </p>
                </div>

              </div> */}
            </CardContent>
          </Card>
        ) : isLoadingCompany ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm xs:text-base">
                <Building2 className="h-5 w-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
        ) : company ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm xs:text-base">
                <Building2 className="h-5 w-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-1">
                <h3 className="text-sm md:text-base 4xl:text-lg font-medium text-text-dark dark:text-accent-foreground">
                  Company Name
                </h3>
                <p className="text-sm md:text-base 4xl:text-lg text-muted-foreground">{company.name}</p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-sm md:text-base 4xl:text-lg font-medium text-text-dark dark:text-accent-foreground">
                  Industry
                </h3>
                <p className="text-sm md:text-base 4xl:text-lg text-muted-foreground">{company.industry || "N/A"}</p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-sm md:text-base 4xl:text-lg font-medium text-text-dark dark:text-accent-foreground">
                  Website
                </h3>
                <p className="text-sm md:text-base 4xl:text-lg text-muted-foreground">{company.website || "N/A"}</p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-sm md:text-base 4xl:text-lg font-medium text-text-dark dark:text-accent-foreground">
                  Plan
                </h3>
                <p className="text-sm md:text-base 4xl:text-lg">{company.plan || "free"}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm xs:text-base">
                <Building2 className="h-5 w-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                No company associated with your account.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
