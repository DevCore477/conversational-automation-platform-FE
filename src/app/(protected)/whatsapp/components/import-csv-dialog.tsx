"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Upload, FileDown, X } from "lucide-react";
import Papa from "papaparse";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { getErrorMessage } from "@/lib/get-error-message";
import { whatsappService } from "@/service/whatsapp.service";
import type { CsvParsedRow } from "@/types/whatsapp.types";

interface ImportCsvDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ImportCsvDialog({
  open,
  onOpenChange,
  onSuccess,
}: ImportCsvDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<CsvParsedRow[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dryRun, setDryRun] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (!f) {
      return;
    }
    setFile(f);
    Papa.parse<CsvParsedRow>(f, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setParsedRows(results.data.slice(0, 20));
      },
      error: () => {
        toast.error("Failed to parse CSV file");
      },
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"], "application/vnd.ms-excel": [".csv"] },
    maxFiles: 1,
  });

  const handleDownloadSample = async () => {
    try {
      const blob = await whatsappService.downloadSampleCsv();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "whatsapp-sample.csv";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Sample CSV downloaded");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to download sample"));
    }
  };

  const handleUpload = async () => {
    if (!file) {
      return;
    }
    setUploading(true);
    try {
      await whatsappService.uploadCsv(file, { dryRun, delayMs: 800 });
      toast.success(dryRun ? "Dry run completed" : "Numbers imported successfully");
      onSuccess?.();
      onOpenChange(false);
      setFile(null);
      setParsedRows([]);
    } catch (err) {
      toast.error(getErrorMessage(err, "Import failed"));
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setFile(null);
      setParsedRows([]);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import WhatsApp Numbers</DialogTitle>
          <DialogDescription>
            Upload a CSV file with phone numbers to import. Required column:{" "}
            <code className="text-xs bg-muted px-1 rounded">phone</code>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            {file ? (
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-medium">{file.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setParsedRows([]);
                  }}
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Drop a CSV file here, or click to browse
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void handleDownloadSample()}
            >
              <FileDown className="h-4 w-4 mr-1" />
              Sample CSV
            </Button>
          </div>

          {parsedRows.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">
                Preview ({parsedRows.length} rows)
              </p>
              <div className="border rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      {Object.keys(parsedRows[0]).map((key) => (
                        <th key={key} className="px-3 py-2 text-left font-medium text-xs">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedRows.map((row, i) => (
                      <tr key={i} className="border-t">
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="px-3 py-2 text-xs truncate max-w-[150px]">
                            {val || "\u2014"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-end gap-2">
          {/* <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={dryRun}
              onChange={(e) => setDryRun(e.target.checked)}
              className="rounded"
            />
            Dry run (validate only)
          </label> */}
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => void handleUpload()}
              disabled={!file || uploading}
            >
              {uploading ? <Spinner className="h-4 w-4 mr-1" /> : null}
              Import
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
