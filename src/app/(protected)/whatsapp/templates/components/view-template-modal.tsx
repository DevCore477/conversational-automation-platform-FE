"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { WhatsAppMessageTemplate } from "@/types/whatsapp.types";

interface ViewTemplateModalProps {
  template: WhatsAppMessageTemplate | null;
  onOpenChange: (open: boolean) => void;
}

const statusColors: Record<string, string> = {
  approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  paused: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  disabled: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

const qualityColors: Record<string, string> = {
  green: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export function ViewTemplateModal({
  template,
  onOpenChange,
}: ViewTemplateModalProps) {
  if (!template) return null;

  return (
    <Dialog open={!!template} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" preventAutoFocus>
        <DialogHeader>
          <DialogTitle className="flex flex-col sm:flex-row items-center gap-2">
            {template.name}
            <Badge
              variant="outline"
              className={`text-xs ${statusColors[template.status] || ""}`}
            >
              {template.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Template details and Meta configuration
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Meta Template Name</p>
              <p className="text-sm font-mono truncate">{template.metaTemplateName}</p>
            </div>
            {template.metaTemplateId && (
              <div>
                <p className="text-xs text-muted-foreground font-medium">Meta Template ID</p>
                <p className="text-sm font-mono">{template.metaTemplateId}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground font-medium">Category</p>
              <p className="text-sm capitalize">{template.category || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Language</p>
              <p className="text-sm uppercase">{template.language}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Quality Status</p>
              {template.qualityStatus ? (
                <Badge variant="outline" className={`text-xs ${qualityColors[template.qualityStatus] || ""}`}>
                  {template.qualityStatus}
                </Badge>
              ) : (
                <p className="text-sm text-muted-foreground">—</p>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Source</p>
              <p className="text-sm capitalize">{template.source || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Active</p>
              <p className="text-sm">{template.isActive ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Usable for Campaigns</p>
              <p className="text-sm">{template.usableForCampaigns ? "Yes" : "No"}</p>
            </div>
          </div>

          {template.libraryTemplateName && (
            <div>
              <p className="text-xs text-muted-foreground font-medium">Library Template</p>
              <p className="text-sm">{template.libraryTemplateName}</p>
            </div>
          )}

          {template.rejectionReason && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-3">
              <p className="text-xs font-medium text-red-800 dark:text-red-400">Rejection Reason</p>
              <p className="text-sm text-red-700 dark:text-red-300">{template.rejectionReason}</p>
            </div>
          )}

          <div>
            <p className="text-xs text-muted-foreground font-medium mb-2">Body Preview</p>
            <div className="border rounded-lg p-3 bg-muted/30">
              <p className="text-sm font-mono whitespace-pre-wrap">
                {template.bodyPreview || "—"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div>
              <p className="font-medium">Created</p>
              <p>{new Date(template.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="font-medium">Last Updated</p>
              <p>{new Date(template.updatedAt).toLocaleString()}</p>
            </div>
            {template.lastSyncedAt && (
              <div>
                <p className="font-medium">Last Synced</p>
                <p>{new Date(template.lastSyncedAt).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
