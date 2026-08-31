"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { RBACGuard } from "@/components/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/ui/page-header";
import { getErrorMessage } from "@/lib/get-error-message";
import { useCompanyStore } from "@/store/company.store";
import { ChevronsLeft } from "lucide-react";
import { useThemeStore } from "@/store/theme.store";

const companySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  description: z.string().optional(),
  industry: z.string().optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
});

type CompanyFormValues = z.infer<typeof companySchema>;

export default function CreateCompanyPage() {
  const router = useRouter();
  const { createCompany, isLoading } = useCompanyStore();
  const { theme, fetchTheme } = useThemeStore();
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      email: "",
      description: "",
      industry: "",
      website: "",
    },
  });

  const onSubmit = async (data: CompanyFormValues) => {
    try {
      await createCompany(data);
      toast.success("Company created successfully");
      router.push("/admin/companies");
      router.refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to create company"));
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <RBACGuard requireAdmin route="/admin/companies" redirectTo="/dashboard">
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <div className="flex items-center justify-between gap-2">
          <PageHeader
            title="Create Company"
            description="Add a new company to the platform"
          />
          <Button onClick={handleCancel} variant="outline" size="sm" className="rounded-full">
            <ChevronsLeft className="size-5"/>
            Back
          </Button>
        </div>
        

        <Card className="pt-6 border rounded-2xl bg-surface-soft-light p-[5px]">
          <CardContent className="bg-sidebar pt-6 pb-8 rounded-2xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Example Corp" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input placeholder="example@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief company description"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <div className="grid lg:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Technology, Healthcare, Finance" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
                <div className="flex gap-2 sm:gap-4 justify-end pt-4">
                  <Button
                    className="rounded-full"
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" showWave waveColor={theme?.primaryColor} disabled={isLoading} className="rounded-full">
                    {isLoading ? "Creating..." : "Create Company"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </RBACGuard>
  );
}