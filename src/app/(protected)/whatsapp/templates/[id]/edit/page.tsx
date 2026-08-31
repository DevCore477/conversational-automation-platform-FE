"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ChevronsLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Spinner } from "@/components/ui/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { whatsappService } from "@/service/whatsapp.service";
import { getErrorMessage } from "@/lib/get-error-message";
import { useThemeStore } from "@/store/theme.store";
import type { WhatsAppMessageTemplate } from "@/types/whatsapp.types";

const editTemplateSchema = z.object({
  name: z.string().min(1, "Name is required").max(128, "Max 128 characters"),
  category: z.string().optional(),
  status: z.string().optional(),
  bodyPreview: z.string().optional(),
});

type EditTemplateFormValues = z.infer<typeof editTemplateSchema>;

export default function EditTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = typeof params.id === "string" ? params.id : "";
  const companyId = searchParams.get("companyId");
  const { theme } = useThemeStore();

  const [template, setTemplate] = useState<WhatsAppMessageTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const form = useForm<EditTemplateFormValues>({
    resolver: zodResolver(editTemplateSchema),
    defaultValues: {
      name: "",
      category: "",
      status: "",
      bodyPreview: "",
    },
  });

  const returnUrl = companyId
    ? `/whatsapp/templates?companyId=${companyId}`
    : "/whatsapp/templates";

  useEffect(() => {
    if (!id) return;

    const fetchTemplate = async () => {
      setLoading(true);
      try {
        const data = await whatsappService.getTemplate(id, companyId ?? undefined);
        setTemplate(data);
        form.reset({
          name: data.name || "",
          category: data.category || "",
          status: data.status || "",
          bodyPreview: data.bodyPreview || "",
        });
      } catch (err) {
        toast.error(getErrorMessage(err, "Failed to load template"));
        router.push(returnUrl);
      } finally {
        setLoading(false);
      }
    };

    void fetchTemplate();
  }, [id, form, router, returnUrl]);

  const onSubmit = async (values: EditTemplateFormValues) => {
    if (!template) return;
    setSaving(true);
    try {
      await whatsappService.updateTemplate(template.id, {
        name: values.name,
        category: values.category || undefined,
        status: values.status || undefined,
        bodyPreview: values.bodyPreview || undefined,
      }, companyId ?? undefined);
      toast.success("Template updated successfully");
      router.push(returnUrl);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update template"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!template) return;
    setDeleting(true);
    try {
      await whatsappService.deleteTemplate(template.id, companyId ?? undefined);
      toast.success(`Template "${template.name}" deleted`);
      router.push(returnUrl);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete template"));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-0 flex-1 flex-col gap-6 p-4 lg:p-6">
        <div className="flex items-center justify-center py-24">
          <Spinner className="h-8 w-8" />
        </div>
      </main>
    );
  }

  if (!template) {
    return (
      <main className="flex min-h-0 flex-1 flex-col gap-6 p-4 lg:p-6">
        <div className="flex items-center justify-center py-24">
          <p className="text-muted-foreground">Template not found</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 space-y-6 p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
        <PageHeader
          title={`Edit: ${template.name}`}
          description="Update template name, status, category, or body preview. This does not update the template in Meta."
        />
        <div className="text-end">
        <Button
          onClick={() => router.push(returnUrl)}
          variant="outline" size="sm" className="rounded-full"
        >
          <ChevronsLeft className="size-5" />
          Back
        </Button>
        </div>
      </div>

      <Card className="pt-6 border rounded-2xl bg-surface-soft-light p-[5px]">
        <CardContent className="bg-sidebar pt-6 pb-8 rounded-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 gap-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="xl:col-span-2">
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Template display name" {...field} maxLength={128} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              
                <div className="grid grid-cols-1 sm:grid-cols-2 sm:col-span-2 gap-3">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={(val) => field.onChange(val === "_" ? "" : val)}
                        value={field.value || "_"}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="_" className="hidden">None</SelectItem>
                          <SelectItem value="utility">Utility</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="authentication">Authentication</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={(val) => field.onChange(val === "_" ? "" : val)}
                        value={field.value || "_"}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="_" className="hidden">None</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="paused">Paused</SelectItem>
                          <SelectItem value="disabled">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
              </div>
              <FormField
                control={form.control}
                name="bodyPreview"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body Preview</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Hi {{1}}, your order {{2}} is ready."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* {template && (
                <div className="border rounded-lg p-4 bg-muted/20 space-y-2">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Meta Template Name:</span> {template.metaTemplateName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Language:</span> {template.language}
                  </p>
                  {template.metaTemplateId && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Meta ID:</span> {template.metaTemplateId}
                    </p>
                  )}
                  {template.bodyPreview && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Current Body Preview:</span> {template.bodyPreview}
                    </p>
                  )}
                </div>
              )} */}

              <div className="flex justify-end gap-3 pt-4">
                {/* <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20"
                      disabled={deleting}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {deleting ? "Deleting..." : "Delete Template"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Template</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{template.name}"? This action only removes it from Hexa AI — it does not delete the template from Meta Business Manager.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => void handleDelete()}
                        className="rounded-full bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog> */}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => router.push(returnUrl)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    showWave
                    waveColor={theme?.primaryColor}
                    className="rounded-full px-4 lg:px-6"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
