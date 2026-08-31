"use client";

import { useState, useEffect, useRef } from "react";
import { FileDown, Upload, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  extractTemplatePlaceholders,
  getTemplateComponent,
} from "@/lib/whatsapp-template-runtime";
import { whatsappService } from "@/service/whatsapp.service";
import type {
  WhatsAppMessageTemplate,
  ReplyRouting,
} from "@/types/whatsapp.types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReplyRoutingConfig } from "./reply-routing-config";
import { set } from "zod";

interface UploadCampaignCsvDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const csvEscape = (value: string) => {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
};

const toSampleValue = (placeholder: string, index: number) => {
  const normalized = placeholder
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return normalized
    ? `sample_${normalized.toLowerCase()}`
    : `sample_param_${index + 1}`;
};

const toCsvFileName = (templateName: string) => {
  const safeName = templateName
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return `${safeName || "template"}-campaign-template.csv`;
};

export function UploadCampaignCsvDialog({
  open,
  onOpenChange,
  onSuccess,
}: UploadCampaignCsvDialogProps) {
  const [templates, setTemplates] = useState<WhatsAppMessageTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [templatePlaceholders, setTemplatePlaceholders] = useState<string[]>(
    [],
  );
  const [campaignName, setCampaignName] = useState("");
  const [confirmOptedIn, setConfirmOptedIn] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [loadingTemplateDetails, setLoadingTemplateDetails] = useState(false);
  const [routing, setRouting] = useState<ReplyRouting>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvError, setCsvError] = useState("");

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

  const handleTemplateSelect = async (templateId: string) => {
    setSelectedTemplateId(templateId);
    setTemplatePlaceholders([]);
    setCsvError("");

    const template = templates.find((t) => t.id === templateId);
    const body = getTemplateComponent(template, "BODY");
    const listPlaceholders = extractTemplatePlaceholders(body?.text);

    if (listPlaceholders.length > 0) {
      setTemplatePlaceholders(listPlaceholders);
      return;
    }

    setLoadingTemplateDetails(true);
    try {
      const detail = await whatsappService.getTemplate(templateId);
      const detailBody = getTemplateComponent(detail, "BODY");
      setTemplatePlaceholders(extractTemplatePlaceholders(detailBody?.text));
    } catch {
      toast.error("Failed to load template parameters");
    } finally {
      setLoadingTemplateDetails(false);
    }
  };

  const handleDownloadTemplateCsv = () => {
    if (!selectedTemplateId) {
      toast.error("Select a template first");
      return;
    }

    const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);
    const parameterHeaders = templatePlaceholders.map(
      (_, index) => `param${index + 1}`,
    );
    const headers = ["phone", "name", ...parameterHeaders];
    const sampleRows = [
      ["+923001234567", "Ali", ...templatePlaceholders.map(toSampleValue)],
      ["+923007654321", "Sara", ...templatePlaceholders.map(toSampleValue)],
    ];
    const csv = [headers, ...sampleRows]
      .map((row) => row.map(csvEscape).join(","))
      .join("\n");

    const blob = new Blob([`${csv}\n`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = toCsvFileName(
      selectedTemplate?.metaTemplateName || "template",
    );
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Template CSV downloaded");
  };

  const validateCsvHeaders = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const firstLine = text.split("\n")[0]?.trim();
        if (!firstLine) {
          resolve("CSV file is empty");
          return;
        }
        const result = Papa.parse(firstLine, { header: false });
        const headers =
          (result.data[0] as string[])?.map((h) => h.trim().toLowerCase()) ??
          [];

        if (
          headers.length < 2 ||
          headers[0] !== "phone" ||
          headers[1] !== "name"
        ) {
          resolve('CSV must have "phone" and "name" as the first two columns');
          return;
        }

        const paramColumns = headers
          .slice(2)
          .filter((h) => h.startsWith("param"));
        if (
          templatePlaceholders.length > 0 &&
          paramColumns.length !== templatePlaceholders.length
        ) {
          resolve(
            `CSV has ${paramColumns.length} parameter column(s), but the template expects ${templatePlaceholders.length}. Download the correct template CSV for this template.`,
          );
          return;
        }

        resolve("");
      };
      reader.onerror = () => resolve("Failed to read CSV file");
      reader.readAsText(file.slice(0, 4096));
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);
    setCsvError("");

    if (selectedFile && templatePlaceholders.length > 0) {
      const error = await validateCsvHeaders(selectedFile);
      setCsvError(error);
    }
  };

  const handleCreate = async () => {
    if (!campaignName.trim() || !selectedTemplateId || !file) {
      toast.error("Campaign name, template, and file are required");
      return;
    }

    if (!csvError && file && templatePlaceholders.length > 0) {
      const error = await validateCsvHeaders(file);
      setCsvError(error);
      if (error) return;
    }

    if (csvError) return;

    setCreating(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", campaignName.trim());
      formData.append("templateId", selectedTemplateId);
      formData.append("confirmRecipientsOptedIn", String(confirmOptedIn));

      if (routing.routingMode)
        formData.append("routingMode", routing.routingMode);
      if (routing.agentId) formData.append("agentId", routing.agentId);
      if (routing.flowId) formData.append("flowId", routing.flowId);
      if (routing.scriptId) formData.append("scriptId", routing.scriptId);
      if (routing.aiModel) formData.append("aiModel", routing.aiModel);
      if (routing.aiSystemPrompt)
        formData.append("aiSystemPrompt", routing.aiSystemPrompt);

      await whatsappService.createCampaignFromCsv(formData);
      toast.success("Campaign created from CSV");
      onSuccess?.();
      onOpenChange(false);
      resetForm();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create campaign",
      );
    } finally {
      setCreating(false);
    }
  };

  const resetForm = () => {
    setCampaignName("");
    setSelectedTemplateId("");
    setTemplatePlaceholders([]);
    setFile(null);
    setConfirmOptedIn(true);
    setCsvError("");
    setRouting({});
  };

  const handleClose = () => {
    if (!creating) {
      resetForm();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl bg-card">
        <DialogHeader>
          <DialogTitle>Import Campaign from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file with phone numbers and template parameters to
            create a campaign.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="csv-name">Campaign Name</Label>
            <Input
              id="csv-name"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="e.g. Summer Promo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="csv-template">Message Template</Label>
            <Select
              value={selectedTemplateId}
              onValueChange={(value) => void handleTemplateSelect(value)}
              disabled={loadingTemplates}
            >
              <SelectTrigger id="csv-template" className="w-full">
                <SelectValue
                  placeholder={
                    loadingTemplates
                      ? "Loading templates..."
                      : "Select a template"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {templates.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.metaTemplateName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadTemplateCsv}
                    disabled={!selectedTemplateId || loadingTemplateDetails}
                    className="shrink-0"
                  >
                    {loadingTemplateDetails ? (
                      <Spinner className="mr-1 h-4 w-4" />
                    ) : (
                      <FileDown className="mr-1 h-4 w-4" />
                    )}
                    Download Template
                  </Button>
                </span>
              </TooltipTrigger>

              <TooltipContent>
                <p>Download the selected template as a CSV file</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="space-y-2">
            <Label>CSV File</Label>
            <div
              className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-6 hover:bg-muted/50"
              onClick={() => fileInputRef.current?.click()}
            >
              {file ? (
                <>
                  <FileText className="h-8 w-8 text-primary" />
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload CSV file
                  </p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {csvError && (
              <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{csvError}</span>
              </div>
            )}
          </div>

          <ReplyRoutingConfig value={routing} onChange={setRouting} />
        </div>

        <DialogFooter className="grid grid-cols-2 gap-3 sm:space-x-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="w-full"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => void handleCreate()}
            className="w-full"
            disabled={
              !campaignName.trim() || !selectedTemplateId || !file || creating
            }
          >
            {creating ? <Spinner className="mr-1 h-4 w-4" /> : null}
            Import Campaign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
