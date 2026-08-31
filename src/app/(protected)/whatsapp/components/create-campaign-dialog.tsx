"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  extractTemplatePlaceholders,
  getTemplateComponent,
} from "@/lib/whatsapp-template-runtime";
import { whatsappService } from "@/service/whatsapp.service";
import type { WhatsAppMessageTemplate, ReplyRouting } from "@/types/whatsapp.types";
import { ReplyRoutingConfig } from "./reply-routing-config";

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface RecipientRow {
  phone: string;
  name: string;
  params: string[];
}

export function CreateCampaignDialog({ open, onOpenChange, onSuccess }: CreateCampaignDialogProps) {
  const [templates, setTemplates] = useState<WhatsAppMessageTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [confirmOptedIn, setConfirmOptedIn] = useState(true);
  const [recipients, setRecipients] = useState<RecipientRow[]>([{ phone: "", name: "", params: [] }]);
  const [bodyPlaceholders, setBodyPlaceholders] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [routing, setRouting] = useState<ReplyRouting>({});

  useEffect(() => {
    if (open) {
      setLoadingTemplates(true);
      whatsappService
        .getTemplates({ approvedOnly: true })
        .then((res) => setTemplates(res.data))
        .catch(() => toast.error("Failed to load templates"))
        .finally(() => setLoadingTemplates(false));
    }
  }, [open]);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = templates.find((t) => t.id === templateId);
    const body = getTemplateComponent(template, "BODY");
    const placeholders = extractTemplatePlaceholders(body?.text);
    setBodyPlaceholders(placeholders);
    setRecipients((prev) =>
      prev.map((r) => ({ ...r, params: Array.from({ length: placeholders.length }, () => "") }))
    );
  };

  const addRecipient = () => {
    setRecipients((prev) => [
      ...prev,
      { phone: "", name: "", params: Array.from({ length: bodyPlaceholders.length }, () => "") },
    ]);
  };

  const removeRecipient = (idx: number) => {
    setRecipients((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateRecipient = (idx: number, field: keyof RecipientRow, value: string | string[]) => {
    setRecipients((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const handleCreate = async () => {
    if (!campaignName.trim() || !selectedTemplateId) {
      toast.error("Campaign name and template are required");
      return;
    }
    const validRecipients = recipients.filter((r) => r.phone.trim());
    if (validRecipients.length === 0) {
      toast.error("At least one recipient is required");
      return;
    }

    setCreating(true);
    try {
      await whatsappService.createCampaign({
        name: campaignName.trim(),
        templateId: selectedTemplateId,
        recipients: validRecipients.map((r) => ({
          phone: r.phone.trim(),
          ...(r.name.trim() && { name: r.name.trim() }),
          ...(r.params.some((p) => p.trim()) && { templateParams: r.params.map((p) => p.trim()) }),
        })),
        confirmRecipientsOptedIn: confirmOptedIn,
        ...routing,
      });
      toast.success("Campaign created successfully");
      onSuccess?.();
      onOpenChange(false);
      resetForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create campaign");
    } finally {
      setCreating(false);
    }
  };

  const resetForm = () => {
    setCampaignName("");
    setSelectedTemplateId("");
    setBodyPlaceholders([]);
    setRecipients([{ phone: "", name: "", params: [] }]);
    setConfirmOptedIn(true);
    setRouting({});
  };

  const handleClose = () => {
    if (!creating) {
      resetForm();
      onOpenChange(false);
    }
  };

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle>Create Campaign</DialogTitle>
          <DialogDescription>
            Create a new WhatsApp bulk messaging campaign using a message template.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign Name</Label>
              <Input
                id="campaign-name"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="e.g. Summer Promo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template">Message Template</Label>
              <Select
                value={selectedTemplateId}
                onValueChange={handleTemplateSelect}
                disabled={loadingTemplates}
              >
                <SelectTrigger id="template" className="w-full">
                  <SelectValue placeholder={loadingTemplates ? "Loading templates..." : "Select a template"} />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.metaTemplateName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedTemplate && selectedTemplate.bodyPreview && (
            <div className="rounded-lg border bg-muted/50 p-3">
              <p className="text-xs font-medium text-muted-foreground">Template Preview:</p>
              <p className="text-sm mt-1">{selectedTemplate.bodyPreview}</p>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Recipients</Label>
              <Button type="button" variant="outline" size="sm" onClick={addRecipient}>
                <Plus className="mr-1 h-3 w-3" /> Add Recipient
              </Button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {recipients.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2 rounded-lg border p-2">
                  <div className="grid flex-1 grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
                    <Input
                      placeholder="Enter phone number"
                      value={rec.phone}
                      onChange={(e) => updateRecipient(idx, "phone", e.target.value)}
                      className="w-full"
                    />
                    {bodyPlaceholders.map((ph, pi) => (
                      <Input
                        key={ph}
                        placeholder={`Param ${ph}`}
                        value={rec.params[pi] || ""}
                        onChange={(e) => {
                          const next = [...rec.params];
                          next[pi] = e.target.value;
                          updateRecipient(idx, "params", next);
                        }}
                        className="w-full"
                      />
                    ))}
                  </div>
                  {recipients.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRecipient(idx)}
                      className="shrink-0"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <ReplyRoutingConfig value={routing} onChange={setRouting} />
        </div>

        <DialogFooter className="grid grid-cols-2 gap-3 sm:space-x-0">
          <Button type="button" variant="outline" onClick={handleClose} className="w-full">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => void handleCreate()}
            className="w-full"
            disabled={!campaignName.trim() || !selectedTemplateId || recipients.filter((r) => r.phone.trim()).length === 0 || creating}
          >
            {creating ? <Spinner className="mr-1 h-4 w-4" /> : null}
            Create Campaign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
