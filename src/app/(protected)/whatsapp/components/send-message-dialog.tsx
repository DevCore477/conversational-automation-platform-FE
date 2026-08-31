"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { MessageSquare, LayoutTemplate, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Label } from "@/components/ui/label";
import {
  buildRuntimeButtonValues,
  buildTemplateButtonParameters,
  buildTemplateContentVariables,
  extractTemplatePlaceholders,
  getTemplateComponent,
  renderTemplateTextWithValues,
  type RuntimeTemplateButtonValue,
} from "@/lib/whatsapp-template-runtime";
import { whatsappService } from "@/service/whatsapp.service";
import { getErrorMessage } from "@/lib/get-error-message";
import { useThemeStore } from "@/store/theme.store";
import type { WhatsAppMessageTemplate, ReplyRouting } from "@/types/whatsapp.types";
import { ReplyRoutingConfig } from "./reply-routing-config";

const simpleMessageSchema = z.object({
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

type SimpleMessageFormValues = z.infer<typeof simpleMessageSchema>;

interface SendMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedPhone?: string;
  onSuccess?: () => void;
}

export function SendMessageDialog({
  open,
  onOpenChange,
  preselectedPhone,
  onSuccess,
}: SendMessageDialogProps) {
  const router = useRouter();
  const { theme } = useThemeStore();
  const [mode, setMode] = useState<"choose" | "simple" | "template">("choose");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [templatePhone, setTemplatePhone] = useState(preselectedPhone || "");
  const [templates, setTemplates] = useState<WhatsAppMessageTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templateBody, setTemplateBody] = useState<string | null>(null);
  const [templateParams, setTemplateParams] = useState<string[]>([]);
  const [paramValues, setParamValues] = useState<string[]>([]);
  const [templateHeader, setTemplateHeader] = useState<string | null>(null);
  const [headerParams, setHeaderParams] = useState<string[]>([]);
  const [headerValues, setHeaderValues] = useState<string[]>([]);
  const [buttonValues, setButtonValues] = useState<RuntimeTemplateButtonValue[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [routing, setRouting] = useState<ReplyRouting>({});

  const simpleForm = useForm<SimpleMessageFormValues>({
    resolver: zodResolver(simpleMessageSchema),
    defaultValues: {
      to: preselectedPhone || "",
      body: "",
      mediaUrl: "",
    },
  });

  useEffect(() => {
    if (open) {
      setMode("choose");
      setTemplatePhone(preselectedPhone || "");
      setSelectedTemplate("");
      setTemplateBody(null);
      setTemplateParams([]);
      setParamValues([]);
      setTemplateHeader(null);
      setHeaderParams([]);
      setHeaderValues([]);
      setButtonValues([]);
      simpleForm.reset({ to: preselectedPhone || "", body: "", mediaUrl: "" });
      setRouting({});
    }
  }, [open, preselectedPhone, simpleForm]);

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

  const handleSimpleSubmit = async (data: SimpleMessageFormValues) => {
    setIsSubmitting(true);
    try {
      const cleaned = data.to.replace(/[\s\-()]/g, "");
      const url = data.mediaUrl?.trim() || "";
      const payload: Parameters<typeof whatsappService.sendMessage>[0] = {
        to: cleaned,
        body: data.body.trim(),
        ...routing,
      };
      if (url) {
        payload.mediaUrl = [url];
        const mediaType = detectMediaType(url);
        if (mediaType) payload.mediaType = mediaType;
      }
      await whatsappService.sendMessage(payload);
      toast.success("Message sent successfully");
      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to send message"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadTemplates = async () => {
    if (templates.length > 0) {
      if (!selectedTemplate && templates[0]) {
        await handleTemplateSelect(templates[0].metaTemplateName, templates);
      }
      return;
    }
    setLoadingTemplates(true);
    try {
      const res = await whatsappService.getTemplates({ approvedOnly: true });
      setTemplates(res.data);
      if (!selectedTemplate && res.data[0]) {
        await handleTemplateSelect(res.data[0].metaTemplateName, res.data);
      }
    } catch {
      toast.error("Failed to load templates");
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleTemplateSelect = async (
    name: string,
    availableTemplates = templates,
  ) => {
    setSelectedTemplate(name);
    setTemplateBody(null);
    setTemplateParams([]);
    setParamValues([]);
    setTemplateHeader(null);
    setHeaderParams([]);
    setHeaderValues([]);
    setButtonValues([]);
    const tmpl = availableTemplates.find((t) => t.metaTemplateName === name);
    if (!tmpl?.id) return;
    try {
      const detail = await whatsappService.getTemplate(tmpl.id);
      const headerComp = getTemplateComponent(detail, "HEADER");
      if (headerComp?.text) {
        const params = extractTemplatePlaceholders(headerComp.text);
        setTemplateHeader(headerComp.text);
        setHeaderParams(params);
        setHeaderValues(Array.from({ length: params.length }, () => ""));
      }

      const bodyComp = getTemplateComponent(detail, "BODY");
      if (bodyComp?.text) {
        setTemplateBody(bodyComp.text);
        const params = extractTemplatePlaceholders(bodyComp.text);
        setTemplateParams(params);
        setParamValues(Array.from({ length: params.length }, () => ""));
      }

      setButtonValues(buildRuntimeButtonValues(detail));
    } catch {
      toast.error("Failed to load template details");
    }
  };

  const handleTemplateSend = async () => {
    const cleaned = templatePhone.replace(/[\s\-()]/g, "");
    if (!selectedTemplate || !cleaned) return;
    setIsSubmitting(true);
    try {
      const tmpl = templates.find((t) => t.metaTemplateName === selectedTemplate);
      const headers = headerValues.map((v) => v.trim()).filter(Boolean);
      const buttons = buildTemplateButtonParameters(buttonValues);
      const contentVariables = buildTemplateContentVariables(
        templateParams,
        paramValues,
      );
      await whatsappService.sendTemplate({
        to: cleaned,
        templateId: tmpl?.id || selectedTemplate,
        contentVariables,
        headerParameters: headers.length > 0 ? headers : undefined,
        buttonParameters: buttons.length > 0 ? buttons : undefined,
        languageCode: tmpl?.language || "en",
        ...routing,
      });
      toast.success("Template sent successfully");
      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to send template"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setMode("choose");
      onOpenChange(false);
    }
  };

  if (mode === "simple") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg bg-card">
          <button
            onClick={() => setMode("choose")}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <DialogHeader>
            <DialogTitle>Send Simple Message</DialogTitle>
            <DialogDescription>Send a plain text or media message.</DialogDescription>
          </DialogHeader>
          <Form {...simpleForm}>
            <form onSubmit={simpleForm.handleSubmit(handleSimpleSubmit)} className="space-y-4">
              <FormField
                control={simpleForm.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={simpleForm.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Type your message..." className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={simpleForm.control}
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
              <ReplyRoutingConfig value={routing} onChange={setRouting} />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setMode("choose")}>Cancel</Button>
                <Button type="submit" showWave disabled={isSubmitting} waveColor={theme?.primaryColor}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }

  if (mode === "template") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-card">
          <button
            onClick={() => setMode("choose")}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <DialogHeader>
            <DialogTitle>Send Template Message</DialogTitle>
            <DialogDescription>Send a Meta-approved message template.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="template-phone">Recipient *</Label>
                <Input id="template-phone" value={templatePhone} onChange={(e) => setTemplatePhone(e.target.value)} placeholder="Enter phone number" className="w-full" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="template">Message Template</Label>
                <Select value={selectedTemplate} onValueChange={handleTemplateSelect} disabled={loadingTemplates} onOpenChange={(o) => { if (o) void loadTemplates(); }}>
                  <SelectTrigger id="template" className="w-full">
                    <SelectValue placeholder={loadingTemplates ? "Loading templates..." : "Select a template"} />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((t) => (
                      <SelectItem key={t.id} value={t.metaTemplateName}>{t.metaTemplateName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {templateHeader && (
              <div className="space-y-2">
                <Label>Header Preview</Label>
                <div className="rounded-lg border bg-muted/50 p-3 text-sm text-muted-foreground">
                  {renderTemplateTextWithValues(templateHeader, headerValues)}
                </div>
              </div>
            )}

            {templateBody && (
              <div className="space-y-2">
                <Label>Template Body Preview</Label>
                <div className="rounded-lg border bg-muted/50 p-3 text-sm text-muted-foreground">
                  {renderTemplateTextWithValues(templateBody, paramValues)}
                </div>
              </div>
            )}

            {headerParams.length > 0 && (
              <div className="space-y-3">
                <Label>Header Name</Label>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {headerParams.map((param, idx) => (
                    <div key={param} className="space-y-1">
                      <Label className="text-xs capitalize text-muted-foreground">{param.replace(/_/g, " ")}</Label>
                      <Input
                        placeholder={`Enter ${param.replace(/_/g, " ")}`}
                        value={headerValues[idx] || ""}
                        onChange={(e) => {
                          const next = [...headerValues];
                          next[idx] = e.target.value;
                          setHeaderValues(next);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {templateParams.length > 0 && (
              <div className="space-y-3">
                <Label>Parameters</Label>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {templateParams.map((param, idx) => (
                    <div key={idx} className="space-y-1">
                      <Label className="text-xs capitalize text-muted-foreground">{param.replace(/_/g, " ")}</Label>
                      <Input
                        placeholder={`Enter ${param.replace(/_/g, " ")}`}
                        value={paramValues[idx] || ""}
                        onChange={(e) => {
                          const next = [...paramValues];
                          next[idx] = e.target.value;
                          setParamValues(next);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {buttonValues.length > 0 && (
              <div className="space-y-3">
                <Label>Template Buttons</Label>
                <div className="space-y-2">
                  {buttonValues.map((button, idx) => (
                    <div key={`${button.index}-${button.subType}`} className="space-y-2 rounded-lg border p-3 w-full">
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Button Name</Label>
                          <Input
                            className="w-full"
                            value={button.text}
                            onChange={(e) => {
                              const next = [...buttonValues];
                              next[idx] = { ...button, text: e.target.value };
                              setButtonValues(next);
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">
                            {button.subType === "url" ? "Button Link" : "Button Payload"}
                          </Label>
                          <Input
                            className="w-full"
                            placeholder={
                              button.subType === "url"
                                ? button.url || "https://example.com"
                                : "Quick reply payload"
                            }
                            value={button.value}
                            disabled={button.subType === "url" && !button.hasDynamicUrl}
                            onChange={(e) => {
                              const next = [...buttonValues];
                              next[idx] = { ...button, value: e.target.value };
                              setButtonValues(next);
                            }}
                          />
                        </div>
                      </div>
                      {button.subType === "url" && !button.hasDynamicUrl && (
                        <p className="text-xs text-muted-foreground">
                          This template has a fixed Meta URL; link overrides only send when the approved template URL contains a variable.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <ReplyRoutingConfig value={routing} onChange={setRouting} />

          <DialogFooter className="grid grid-cols-2 gap-3 sm:space-x-0">
            <Button type="button" variant="outline" onClick={() => setMode("choose")} className="w-full">Cancel</Button>
            <Button type="button" onClick={() => void handleTemplateSend()} className="w-full" disabled={!selectedTemplate || !templatePhone || isSubmitting}>
              {isSubmitting ? <Spinner className="h-4 w-4 mr-1" /> : null}
              Send Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-card">
          <DialogHeader>
          <DialogTitle>Send Message</DialogTitle>
          <DialogDescription>Choose how you want to send your message.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          <button
            onClick={() => { setMode("simple"); }}
            className="flex flex-col items-center gap-3 rounded-xl border-2 border-border hover:border-primary p-6 transition-colors text-center"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">Simple Message</p>
              <p className="text-xs text-muted-foreground mt-1">Send a plain text or media message</p>
            </div>
          </button>
          <button
            onClick={() => { void loadTemplates(); setMode("template"); }}
            className="flex flex-col items-center gap-3 rounded-xl border-2 border-border hover:border-primary p-6 transition-colors text-center"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <LayoutTemplate className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">Template Message</p>
              <p className="text-xs text-muted-foreground mt-1">Send a Meta-approved message template</p>
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
