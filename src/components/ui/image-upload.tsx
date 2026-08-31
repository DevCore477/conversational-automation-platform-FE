"use client";

import { ImagePlus, Loader2, Repeat, Trash2, Upload } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getErrorMessage } from "@/lib/get-error-message";
import { cn } from "@/lib/utils";
import { uploadService } from "@/service/upload.service";
import { UploadIcn } from "@/assets/icons/Icons";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/gif,image/webp,.jpg,.jpeg,.png,.gif,.webp";

function validateImageFile(file: File): string | null {
  const byMime = /^image\/(jpeg|png|gif|webp)$/i.test(file.type);
  const byExt = /\.(jpe?g|png|gif|webp)$/i.test(file.name);
  if (!byMime && !byExt) {
    return "Use JPG, PNG, GIF, or WebP";
  }
  if (file.size > MAX_BYTES) {
    return "Image must be 5MB or smaller";
  }
  return null;
}

export interface ImageUploadProps {
  /** Remote URL to show (e.g. after upload or existing value). Use `""` when empty. */
  value?: string | null;
  /** Called with uploaded URL, or `""` when the image is removed. */
  onChange?: (fileUrl: string, meta?: { key?: string }) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  description?: string;
}

export function ImageUpload({
  value,
  onChange,
  disabled = false,
  className,
  label = "Image",
  description,
}: ImageUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingBlobRef = useRef<string | null>(null);
  /** Remote URL when parent does not pass `value`; blob URL only while uploading. */
  const [stagedUrl, setStagedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const isControlled = value !== undefined;
  const displayUrl = value ?? stagedUrl ?? null;

  useEffect(() => {
    if (isControlled && (value === null || value === "")) {
      setStagedUrl(null);
    }
  }, [isControlled, value]);

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file || disabled) return;
      const err = validateImageFile(file);
      if (err) {
        toast.error(err);
        return;
      }

      if (pendingBlobRef.current) {
        URL.revokeObjectURL(pendingBlobRef.current);
        pendingBlobRef.current = null;
      }
      const blobUrl = URL.createObjectURL(file);
      pendingBlobRef.current = blobUrl;
      setStagedUrl(blobUrl);

      setIsUploading(true);
      try {
        const result = await uploadService.uploadImage(file);
        if (pendingBlobRef.current === blobUrl) {
          URL.revokeObjectURL(blobUrl);
          pendingBlobRef.current = null;
        }
        if (isControlled) {
          setStagedUrl(null);
        } else {
          setStagedUrl(result.fileUrl);
        }
        onChange?.(result.fileUrl, { key: result.key });
        toast.success(result.message ?? "Image uploaded");
      } catch (e) {
        if (pendingBlobRef.current === blobUrl) {
          URL.revokeObjectURL(blobUrl);
          pendingBlobRef.current = null;
        }
        setStagedUrl(null);
        toast.error(getErrorMessage(e, "Upload failed"));
      } finally {
        setIsUploading(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [disabled, isControlled, onChange],
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    void handleFile(e.target.files?.[0]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    void handleFile(e.dataTransfer.files?.[0]);
  };

  const remove = () => {
    if (pendingBlobRef.current) {
      URL.revokeObjectURL(pendingBlobRef.current);
      pendingBlobRef.current = null;
    }
    if (stagedUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(stagedUrl);
    }
    setStagedUrl(null);
    onChange?.("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <div className="space-y-1">
          <Label htmlFor={inputId}>{label}</Label>
          {description ? (
            <p className="text-muted-foreground text-sm">{description}</p>
          ) : null}
        </div>
      ) : null}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        disabled={disabled || isUploading}
        onChange={onInputChange}
      />

      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragActive(true);
        }}
        onDragLeave={() => setIsDragActive(false)}
        onDrop={onDrop}
        className={cn(
          "relative flex min-h-[140px] h-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-4 text-center transition-colors",
          isDragActive && "border-primary bg-muted/50",
          disabled && "pointer-events-none opacity-60",
        )}
      >
        {displayUrl ? (
          <div className="relative mx-auto max-h-48 w-full max-w-sm overflow-hidden rounded-md border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element -- S3 URLs; avoid remotePatterns */}
            <img
              src={displayUrl}
              alt=""
              className="mx-auto max-h-48 w-auto object-contain"
            />
            {isUploading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <button type="button" onClick={() => inputRef.current?.click()}>
              {isUploading ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <UploadIcn className="size-10" aria-hidden />
            )}
            {displayUrl && !isUploading ? "Replace" : ""}
            
            </button>
            <span className="text-sm">Drop an image here or choose a file</span>
            <span className="text-xs">JPG, PNG, GIF, WebP · max 5MB</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2">
          {displayUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled || isUploading}
              onClick={() => inputRef.current?.click()}
            >
              <Repeat className="mr-2 size-4" />
              {displayUrl ? "Replace" : "Upload"}
            </Button>
          )}
   
          {displayUrl && !isUploading ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled}
              onClick={remove}
            >
              <Trash2 className="mr-2 size-4" />
              Remove
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
