"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

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
  buildRuntimeButtonValues,
  buildTemplateButtonParameters,
  buildTemplateContentVariables,
  extractTemplatePlaceholders,
  getTemplateComponent,
  renderTemplateTextWithValues,
  type RuntimeTemplateButtonValue,
} from "@/lib/whatsapp-template-runtime";
import { whatsappService } from "@/service/whatsapp.service";
import type { WhatsAppMessageTemplate, ReplyRouting } from "@/types/whatsapp.types";
import { ReplyRoutingConfig } from "./reply-routing-config";

interface SendTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedNumbers: string[];
  onSuccess?: () => void;
}

export function SendTemplateDialog({
  open,
  onOpenChange,
  selectedNumbers,
  onSuccess,
}: SendTemplateDialogProps) {
  const [templates, setTemplates] = useState<WhatsAppMessageTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [parameters, setParameters] = useState<string[]>([""]);
  const [bodyPlaceholders, setBodyPlaceholders] = useState<string[]>([]);
  const [headerPlaceholders, setHeaderPlaceholders] = useState<string[]>([]);
  const [headerValues, setHeaderValues] = useState<string[]>([]);
  const [buttonValues, setButtonValues] = useState<RuntimeTemplateButtonValue[]>([]);
  const [sending, setSending] = useState(false);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [routing, setRouting] = useState<ReplyRouting>({});

  useEffect(() => {
    if (open && templates.length === 0) {
      setLoadingTemplates(true);
      whatsappService
        .getTemplates({ approvedOnly: true })
        .then((res) => {
          setTemplates(res.data);
          if (!selectedTemplate && res.data[0]) {
            handleTemplateSelect(res.data[0].metaTemplateName, res.data);
          }
        })
        .catch(() => toast.error("Failed to load templates"))
        .finally(() => setLoadingTemplates(false));
    } else if (open && !selectedTemplate && templates[0]) {
      handleTemplateSelect(templates[0].metaTemplateName, templates);
    }
  }, [open, selectedTemplate, templates]);

  const resetTemplateFields = () => {
    setParameters([""]);
    setBodyPlaceholders([]);
    setHeaderPlaceholders([]);
    setHeaderValues([]);
    setButtonValues([]);
    setRouting({});
  };

  const handleTemplateSelect = (
    name: string,
    availableTemplates = templates,
  ) => {
    setSelectedTemplate(name);

    const template = availableTemplates.find((t) => t.metaTemplateName === name);
    const body = getTemplateComponent(template, "BODY");
    const header = getTemplateComponent(template, "HEADER");
    const nextBodyPlaceholders = extractTemplatePlaceholders(body?.text);
    const nextHeaderPlaceholders = extractTemplatePlaceholders(header?.text);

    setBodyPlaceholders(nextBodyPlaceholders);
    setParameters(
      nextBodyPlaceholders.length > 0
        ? Array.from({ length: nextBodyPlaceholders.length }, () => "")
        : [""],
    );
    setHeaderPlaceholders(nextHeaderPlaceholders);
    setHeaderValues(Array.from({ length: nextHeaderPlaceholders.length }, () => ""));
    setButtonValues(buildRuntimeButtonValues(template));
  };

  const handleSend = async () => {
    if (!selectedTemplate || selectedNumbers.length === 0) {
      return;
    }
    setSending(true);
    const contentVariables = buildTemplateContentVariables(
      bodyPlaceholders,
      parameters,
    );
    const headers = headerValues.map((p) => p.trim()).filter(Boolean);
    const buttons = buildTemplateButtonParameters(buttonValues);
    let successCount = 0;
    let failCount = 0;

    for (const to of selectedNumbers) {
      try {
        const tmpl = templates.find((t) => t.metaTemplateName === selectedTemplate);
        await whatsappService.sendTemplate({
          to,
          templateId: tmpl?.id || selectedTemplate,
          contentVariables,
          headerParameters: headers.length > 0 ? headers : undefined,
          buttonParameters: buttons.length > 0 ? buttons : undefined,
          languageCode: tmpl?.language || "en",
          ...routing,
        });
        successCount++;
      } catch {
        failCount++;
      }
    }

    setSending(false);

    if (failCount === 0) {
      toast.success(`Message sent to ${successCount} number(s)`);
    } else {
      toast.warning(
        `Sent to ${successCount}, failed for ${failCount} number(s)`
      );
    }

    onSuccess?.();
    onOpenChange(false);
    setSelectedTemplate("");
    resetTemplateFields();
  };

  const handleClose = () => {
    if (!sending) {
      setSelectedTemplate("");
      resetTemplateFields();
      onOpenChange(false);
    }
  };

  const selectedTemplateData = templates.find(
    (t) => t.metaTemplateName === selectedTemplate
  );
  const selectedHeader = getTemplateComponent(selectedTemplateData, "HEADER");
  const selectedBody = getTemplateComponent(selectedTemplateData, "BODY");

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Template Message</DialogTitle>
          <DialogDescription>
            Send a Meta-approved message template to{" "}
            <strong>{selectedNumbers.length}</strong> number(s).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Recipients</Label>
              <div className="border rounded-lg p-2 max-h-24 overflow-y-auto w-full">
                {selectedNumbers.map((num) => (
                  <p key={num} className="text-sm font-mono">
                    {num}
                  </p>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="template">Message Template</Label>
              <Select
                value={selectedTemplate}
                onValueChange={handleTemplateSelect}
                disabled={loadingTemplates}
              >
                <SelectTrigger id="template" className="w-full">
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
                    <SelectItem key={t.id} value={t.metaTemplateName}>
                      {t.metaTemplateName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedTemplateData && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Template Preview</Label>
              <div className="border rounded-lg p-3 bg-muted/50">
                <p className="text-sm font-medium">{selectedTemplateData.metaTemplateName}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  ID: {selectedTemplateData.id}
                </p>
                {selectedHeader?.text && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Header: {renderTemplateTextWithValues(selectedHeader.text, headerValues)}
                  </p>
                )}
                {selectedBody?.text && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Body: {renderTemplateTextWithValues(selectedBody.text, parameters)}
                  </p>
                )}
                {parameters.length > 0 && parameters[0] && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Parameters: {parameters.filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
            </div>
          )}

          {headerPlaceholders.length > 0 && (
            <div className="space-y-2">
              <Label>Header Name</Label>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {headerPlaceholders.map((placeholder, idx) => (
                  <Input
                    key={placeholder}
                    placeholder={`Header ${placeholder}`}
                    value={headerValues[idx] || ""}
                    onChange={(e) => {
                      const next = [...headerValues];
                      next[idx] = e.target.value;
                      setHeaderValues(next);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Template Parameters</Label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {parameters.map((param, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    placeholder={
                      bodyPlaceholders[idx]
                        ? `Parameter ${bodyPlaceholders[idx]}`
                        : `Parameter ${idx + 1}`
                    }
                    value={param}
                    onChange={(e) => {
                      const next = [...parameters];
                      next[idx] = e.target.value;
                      setParameters(next);
                    }}
                  />
                  {parameters.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setParameters((p) => p.filter((_, i) => i !== idx))
                      }
                    >
                      &times;
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setParameters((p) => [...p, ""])}
            >
              Add Parameter
            </Button>
          </div>

          {buttonValues.length > 0 && (
            <div className="space-y-3">
              <Label>Template Buttons</Label>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
          <Button type="button" variant="outline" onClick={handleClose} className="w-full">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => void handleSend()}
            className="w-full"
            disabled={!selectedTemplate || selectedNumbers.length === 0 || sending}
          >
            {sending ? <Spinner className="h-4 w-4 mr-1" /> : null}
            Send to {selectedNumbers.length} number(s)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
