"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/get-error-message";
import { useCompanyStore } from "@/store/company.store";
import { type UpdateCompanyDto } from "@/types/company.types";
import { useThemeStore } from "@/store/theme.store";


interface CompanyInfoFormProps {
  companyId?: string;
  isDisabled?: boolean; 
}

const companyInfoSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  description: z.string().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  industry: z.string().optional(),
});

type CompanyInfoFormValues = z.infer<typeof companyInfoSchema>;

export function CompanyInfoForm({ companyId, isDisabled }: CompanyInfoFormProps) {
  const { company, updateMyCompany, updateCompanyAsAdmin, isLoading } = useCompanyStore();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<CompanyInfoFormValues>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      name: "",
      description: "",
      website: "",
      industry: "",
    },
  });

  useEffect(() => {
    if (company) {
      form.reset({
        name: company.name || "",
        description: company.description || "",
        website: company.website || "",
        industry: company.industry || "",
      });
    }
  }, [company, form]);

  const onSubmit = async (data: CompanyInfoFormValues) => {
    try {
      setIsSaving(true);
      const payload: UpdateCompanyDto = {
        name: data.name,
        description: data.description,
        website: data.website || undefined,
        industry: data.industry,
      };

      if (companyId) {
        await updateCompanyAsAdmin(companyId, payload);
      } else {
        await updateMyCompany(payload);
      }
      toast.success("Company information updated successfully");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update company information"));
    } finally {
      setIsSaving(false);
    }
  };

    const { theme, fetchTheme } = useThemeStore();
  
    useEffect(() => {
      if (!theme?.primaryColor) {
        fetchTheme();
      }
    }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
        <CardDescription>
          Update your company&apos;s basic information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Inc." {...field} disabled={isDisabled}/>
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
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://example.com" {...field} disabled={isDisabled}/>
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your company..."
                      className="min-h-[100px]"
                      {...field}
                      disabled={isDisabled}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description of your company
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <FormControl>
                    <Input placeholder="Technology" {...field} disabled={isDisabled}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*<FormField*/}
            {/*  control={form.control}*/}
            {/*  name="size"*/}
            {/*  render={({ field }) => (*/}
            {/*    <FormItem>*/}
            {/*      <FormLabel>Company Size</FormLabel>*/}
            {/*      <FormControl>*/}
            {/*        <Input placeholder="1-10, 11-50, 51-200..." {...field} />*/}
            {/*      </FormControl>*/}
            {/*      <FormMessage />*/}
            {/*    </FormItem>*/}
            {/*  )}*/}
            {/*/>*/}
            {/*</div>*/}

            <div className="flex justify-end">
              {!isDisabled && (
              <Button 
                type="submit" 
                // disabled={isSaving || isLoading} 
                showWave 
                waveColor={theme?.primaryColor}
                size="lg" className="rounded-full"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              )}

            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
