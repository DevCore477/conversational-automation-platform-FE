"use client";

import { Upload, Download, FileJson, X, Loader2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FLOW_TEMPLATES } from "@/lib/flows/templates";
import { getErrorMessage } from "@/lib/get-error-message";
import {
  type CreateFlowDto,
  type BackendFlowPayload,
} from "@/types/flow.types";
import { createFlow } from "../actions";
import { useThemeStore } from "@/store/theme.store";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
  onSuccess: () => void;
}

/** Shape after one unwrap from `{ flow: ... }` at file root (may still contain nested `flow` = BackendFlow). */
type ImportedInnerFlow = {
  start?: string;
  nodes?: unknown;
  flow?: {
    nodes?: unknown[];
    start_node_id?: string;
    start_speaker?: string;
    tools?: unknown;
  };
  intents?: object;
  start_node_id?: string;
  start_speaker?: string;
  tools?: unknown;
};

/**
 * Accept exports like `{ name, flow: { start, flow: { nodes, tools, ... }, intents } }`
 * where nodes live on `flow.flow`, not `flow`.
 */
function normalizeImportedInnerFlow(raw: ImportedInnerFlow): ImportedInnerFlow {
  const nested = raw.flow;
  if (
    nested &&
    typeof nested === "object" &&
    Array.isArray(nested.nodes) &&
    nested.nodes.length > 0
  ) {
    return {
      ...raw,
      nodes: nested.nodes,
      start_node_id:
        nested.start_node_id ?? raw.start_node_id ?? (raw.start as string | undefined),
      start_speaker: nested.start_speaker ?? raw.start_speaker,
      tools: nested.tools ?? raw.tools,
    };
  }
  return raw;
}

const MAX_JSON_FILE_MB = 50;
const ACCEPTED_JSON = ".json,application/json";

export function UploadDialog({
  open,
  onOpenChange,
  companyId,
  onSuccess,
}: UploadDialogProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadFlowName, setUploadFlowName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useThemeStore();
  const setSingleFile = useCallback((file: File | null) => {
    setUploadedFile(file);
    setUploadError(null);
    if (file) {
      setUploadFlowName((prev) =>
        prev.trim() ? prev : file.name.replace(/\.json$/i, ""),
      );
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const validateJsonFile = useCallback((file: File): string | null => {
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      return "Please upload a valid JSON file";
    }
    const maxBytes = MAX_JSON_FILE_MB * 1024 * 1024;
    if (file.size > maxBytes) {
      return `File must be under ${MAX_JSON_FILE_MB}MB`;
    }
    return null;
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateJsonFile(file);
    if (err) {
      setUploadError(err);
      setUploadedFile(null);
      return;
    }
    setSingleFile(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragActive(false);
      const file = e.dataTransfer.files[0];
      if (!file) return;
      const err = validateJsonFile(file);
      if (err) {
        setUploadError(err);
        setUploadedFile(null);
        return;
      }
      setSingleFile(file);
    },
    [validateJsonFile, setSingleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleRemoveFile = useCallback(() => {
    setUploadedFile(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleDownloadTemplate = () => {
    // Use the new appointment booking template in the new format
    const newFormatTemplate = FLOW_TEMPLATES.find(
      (t) => t.id === "appointment-booking",
    );
    if (newFormatTemplate) {
      const jsonString = JSON.stringify(newFormatTemplate.payload, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "flow-template-new-format.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("New format template downloaded");
      return;
    }

    // Fallback to legacy template
    const salesTemplate = FLOW_TEMPLATES.find((t) => t.id === "support-sales");
    if (!salesTemplate) {
      toast.error("Template not found");
      return;
    }
    const jsonString = JSON.stringify(salesTemplate.payload, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "flow-template.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Template downloaded");
  };

  const handleUploadFlow = async () => {
    if (!companyId) {
      toast.error("Company not loaded");
      return;
    }
    if (!uploadedFile) {
      setUploadError("Please select a JSON file");
      return;
    }
    if (!uploadFlowName.trim()) {
      setUploadError("Please enter a flow name");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const fileContent = await uploadedFile.text();
      let parsedFlow: unknown;

      try {
        parsedFlow = JSON.parse(fileContent);
      } catch {
        throw new Error("Invalid JSON file format");
      }

      if (!parsedFlow || typeof parsedFlow !== "object") {
        throw new Error("Invalid flow structure");
      }

      // Handle potential wrapper: { flow: { start, flow, intents } } or direct { start, flow, intents }
      let innerFlow: ImportedInnerFlow;

      const parsedObj = parsedFlow as Record<string, unknown>;

      // Check if JSON is wrapped in a "flow" key
      if (parsedObj.flow && typeof parsedObj.flow === "object") {
        innerFlow = parsedObj.flow as ImportedInnerFlow;
      } else {
        // Direct format (no wrapper)
        innerFlow = parsedFlow as ImportedInnerFlow;
      }

      innerFlow = normalizeImportedInnerFlow(innerFlow);

      // Check for new format (flow.nodes) or legacy format (nodes)
      // New format: { flow: { nodes: [...], start_node_id: "..." } } - nodes is directly on innerFlow after unwrapping
      // Legacy format: { start: "...", nodes: {...} }
      const hasNewFormat =
        Array.isArray(innerFlow.nodes) && innerFlow.nodes.length > 0;
      const hasLegacyFormat =
        innerFlow.start && innerFlow.nodes && !Array.isArray(innerFlow.nodes);

      if (!hasNewFormat && !hasLegacyFormat) {
        throw new Error(
          "Flow must have either 'flow.nodes' (new format) or 'start' and 'nodes' (legacy format)",
        );
      }

      let createDto: CreateFlowDto;

      if (hasNewFormat) {
        // New format: flow.nodes structure
        // innerFlow = { nodes: [...], start_node_id: "..." }
        const startNodeId =
          innerFlow.start_node_id ||
          innerFlow.start ||
          "";
        const rawSpeaker = innerFlow.start_speaker;
        const startSpeaker: "agent" | "user" =
          rawSpeaker === "user" ? "user" : "agent";
        const tools = innerFlow.tools;
        createDto = {
          name: uploadFlowName.trim(),
          flow: {
            start: startNodeId,
            flow: {
              nodes: innerFlow.nodes as BackendFlowPayload["flow"] extends {
                nodes: infer N;
              }
                ? N
                : never,
              start_node_id: startNodeId,
              start_speaker: startSpeaker,
              ...(Array.isArray(tools) && tools.length > 0 ? { tools } : {}),
            },
            intents: (innerFlow.intents as BackendFlowPayload["intents"]) || {},
          },
        };
      } else {
        // Legacy format: start + nodes structure
        createDto = {
          name: uploadFlowName.trim(),
          flow: {
            start: innerFlow.start!,
            nodes: innerFlow.nodes as BackendFlowPayload["nodes"],
            intents: (innerFlow.intents as BackendFlowPayload["intents"]) || {},
          },
        };
      }

      const result = await createFlow(companyId, createDto);
      if (result.success) {
        toast.success(`Flow '${uploadFlowName.trim()}' created successfully`);
        onOpenChange(false);
        resetUploadState();
        onSuccess();
      } else {
        throw new Error(result.error || "Failed to create flow");
      }
    } catch (err) {
      const errorMsg = getErrorMessage(err, "Failed to create flow from JSON");
      setUploadError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const resetUploadState = () => {
    setUploadedFile(null);
    setUploadFlowName("");
    setUploadError(null);
    setIsDragActive(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    onOpenChange(false);
    resetUploadState();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) resetUploadState();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>Upload Files</DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="flow-name">Flow Name</Label>
            <Input
              id="flow-name"
              value={uploadFlowName}
              onChange={(e) => setUploadFlowName(e.target.value)}
              placeholder="Enter flow name"
            />
          </div>
          <div className="space-y-2">
            <Label>Attach JSON</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_JSON}
              onChange={handleFileChange}
              className="sr-only"
              tabIndex={-1}
              aria-hidden
            />
            {!uploadedFile ? (
              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-4
                  text-center transition-colors
                  ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 bg-muted/30 hover:bg-muted/50"}
                `}
              >
                <p className="text-sm font-medium">
                  Choose a file or drag & drop it here
                </p>
                <p className="text-xs text-muted-foreground">
                  JSON format, up to {MAX_JSON_FILE_MB}MB
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Browse File
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-3 py-2">
                <FileJson className="h-8 w-8 shrink-0 text-danger-soft" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={handleRemoveFile}
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          {uploadError && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
              {uploadError}
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownloadTemplate}
            className="text-muted-foreground"
          >
            <Download className="h-4 w-4" />
            Download Example Template
          </Button>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUploadFlow}
            disabled={isUploading || !uploadedFile || !uploadFlowName.trim()}
            showWave waveColor={theme?.primaryColor} 
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Create Flow
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
