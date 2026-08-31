"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { ChevronsLeft } from "lucide-react";

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
import { Card, CardContent } from "@/components/ui/card";
import { useCompanyStore } from "@/store/company.store";
import { whatsappService } from "@/service/whatsapp.service";
import { getErrorMessage } from "@/lib/get-error-message";
import { PageHeader } from "@/components/ui/page-header";
import { RBACGuard } from "@/components/auth";
import { useThemeStore } from "@/store/theme.store";

const sendMessageSchema = z.object({
  to: z
    .string()
    .min(1, "Phone number is required")
    .refine(
      (val) => /^\+[1-9]\d{6,14}$/.test(val.replace(/[\s\-()]/g, "")),
      "Enter a valid phone number starting with + (e.g. +923001234567)",
    ),
  body: z.string().min(1, "Message body is required"),
  mediaUrl: z.string().optional(),
});

type SendMessageFormValues = z.infer<typeof sendMessageSchema>;

export default function SendMessagePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme, fetchTheme } = useThemeStore();
  const { company, fetchMyCompany } = useCompanyStore();

  useEffect(() => {
    if (!theme?.primaryColor) {
      fetchTheme();
    }
  }, [theme, fetchTheme]);

  useEffect(() => {
    if (!company) {
      void fetchMyCompany();
    }
  }, [company, fetchMyCompany]);

  const form = useForm<SendMessageFormValues>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      to: "",
      body: "",
      mediaUrl: "",
    },
  });

  const detectMediaType = (url: string): string | undefined => {
    const ext = url.split("?").shift()?.split(".").pop()?.toLowerCase();
    if (!ext) return undefined;
    const imageExts = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"];
    const videoExts = ["mp4", "webm", "avi", "mov", "mkv"];
    const audioExts = ["mp3", "wav", "ogg", "m4a", "aac"];
    const docExts = ["pdf", "doc", "docx", "xls", "xlsx", "txt", "csv"];
    if (imageExts.includes(ext)) return "image";
    if (videoExts.includes(ext)) return "video";
    if (audioExts.includes(ext)) return "audio";
    if (docExts.includes(ext)) return "document";
    return undefined;
  };

  const onSubmit = async (data: SendMessageFormValues) => {
    setIsSubmitting(true);
    try {
      const cleaned = data.to.replace(/[\s\-()]/g, "");
      const url = data.mediaUrl?.trim() || "";
      const payload: Parameters<typeof whatsappService.sendMessage>[0] = {
        to: cleaned,
        body: data.body.trim(),
      };
      if (url) {
        payload.mediaUrl = [url];
        const mediaType = detectMediaType(url);
        if (mediaType) payload.mediaType = mediaType;
      }
      await whatsappService.sendMessage(payload);
      toast.success("Message sent successfully");
      router.push("/whatsapp/messages");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to send message"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/whatsapp/messages");
  };

  return (
    <RBACGuard route="/whatsapp/messages" redirectTo="/dashboard">
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <div className="flex items-center justify-between gap-2">
          <PageHeader
            title="Send WhatsApp Message"
            description="Send a message to a phone number."
          />
          <Button
            onClick={handleCancel}
            variant="ghost"
            size="sm"
            className="gap-2 text-text-dark dark:text-accent-foreground bg-accent py-6 !px-4 rounded-full"
          >
            <ChevronsLeft className="size-5" />
            Back
          </Button>
        </div>

        <Card className="pt-6 border rounded-2xl bg-surface-soft-light p-[5px]">
          <CardContent className="bg-sidebar pt-6 pb-8 rounded-2xl">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                  <FormField
                    control={form.control}
                    name="to"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="+923001234567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="body"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Type your message..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mediaUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Media URL (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    className="rounded-full"
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    showWave
                    disabled={isSubmitting}
                    waveColor={theme?.primaryColor}
                    className="rounded-full px-4 lg:px-6"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
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
