"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Palette, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useThemeStore } from "@/store/theme.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import { ColorPicker } from "@/components/ui/color-picker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import { ImageUpload } from "@/components/ui/image-upload";
import { getErrorMessage } from "@/lib/get-error-message";
import { useCompanyStore } from "@/store/company.store";
import { type UpdateCompanyThemeDto } from "@/types/company.types";
import { Input } from "@/components/ui/input";
import { ImagePreview } from "@/components/ui/image-preview";

const companyThemeSchema = z.object({
  logo: z.union([z.literal(""), z.string().url().or(z.literal(""))]),
  icon: z.union([z.literal(""), z.string().url().or(z.literal(""))]),
  primaryColor: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, "Invalid hex color")
    .optional()
    .or(z.literal("")),
  secondaryColor: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, "Invalid hex color")
    .optional(),
});

type CompanyThemeFormValues = z.infer<typeof companyThemeSchema>;

interface CompanyThemeFormProps {
  isDisabled?: boolean;
  companyId?: string;
}

export function CompanyThemeForm({
  isDisabled = false,
  companyId,
}: CompanyThemeFormProps) {
  const { company, updateTheme, updateThemeAsAdmin, isLoading } =
    useCompanyStore();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<CompanyThemeFormValues>({
    resolver: zodResolver(companyThemeSchema),
    defaultValues: {
      logo: "",
      icon: "",
      primaryColor: "",
      secondaryColor: "",
    },
  });

  useEffect(() => {
    if (company) {
      form.reset({
        logo: company.theme?.logo || company.logo || "",
        icon: company.theme?.icon || company.icon || "",
        primaryColor: company.theme?.primaryColor || company.primaryColor || "",
        secondaryColor:
          company.theme?.secondaryColor || company.secondaryColor || "",
      });
    }
  }, [company, form]);

  const onSubmit = async (data: CompanyThemeFormValues) => {
    try {
      setIsSaving(true);
      const logo = (data.logo ?? "").trim();
      const icon = (data.icon ?? "").trim();
      const payload: UpdateCompanyThemeDto = {
        logo: logo === "" ? "" : logo,
        icon: icon === "" ? "" : icon,
        primaryColor: data.primaryColor?.trim() || undefined,
        secondaryColor: data.secondaryColor?.trim() || undefined,
      };

      if (companyId) {
        await updateThemeAsAdmin(companyId, payload);
      } else {
        await updateTheme(payload);
      }
      await fetchTheme();
      toast.success("Company theme updated successfully");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update company theme"));
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
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Company Theme
        </CardTitle>
        {!isDisabled ? (
          <CardDescription>
            Update your company&apos;s basic Theme information.
          </CardDescription>
        ) : (
          <CardDescription>
            You don&#39;t have permission to manage company themes.
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 space-x-"
          >
            <div className="grid gap-4 lg:grid-cols-2 ">
              <FormField
                control={form.control}
                name="logo"
                disabled={isDisabled}
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Company Logo</FormLabel> */}
                    <FormControl>
                      <ImageUpload
                        label=""
                        description="JPG, PNG, GIF, or WebP · max 5MB. Remove to clear the logo."
                        value={field.value ?? ""}
                        onChange={(url) => field.onChange(url)}
                        disabled={isDisabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="icon"
                disabled={isDisabled}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        label=""
                        description="JPG, PNG, GIF, or WebP · max 5MB. Remove to clear the icon."
                        value={field.value ?? ""}
                        onChange={(url) => field.onChange(url)}
                        disabled={isDisabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <div className="space-y-5 flex flex-col justify-between">
                <div className="space-y-6">
              <FormField
                control={form.control}
                name="primaryColor"
                disabled={isDisabled}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Color</FormLabel>
                    <FormControl>
                      <ColorPicker
                        disabled={isDisabled}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="secondaryColor"
                disabled={isDisabled}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Color</FormLabel>
                    <FormControl>
                      <ColorPicker
                        disabled={isDisabled}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSaving || isLoading || isDisabled}
                  showWave
                  waveColor={theme?.primaryColor}
                  className="rounded-full"
                  size="lg"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
