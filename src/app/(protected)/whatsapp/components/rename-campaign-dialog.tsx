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
import { Spinner } from "@/components/ui/spinner";
import { whatsappService } from "@/service/whatsapp.service";
import type { WhatsAppCampaign } from "@/types/whatsapp.types";

interface RenameCampaignDialogProps {
  campaign: WhatsAppCampaign | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function RenameCampaignDialog({
  campaign,
  onOpenChange,
  onSuccess,
}: RenameCampaignDialogProps) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (campaign) setName(campaign.name);
  }, [campaign]);

  const handleSave = async () => {
    if (!campaign || !name.trim()) return;
    setSaving(true);
    try {
      await whatsappService.updateCampaign(campaign.id, { name: name.trim() });
      toast.success("Campaign renamed");
      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to rename campaign");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) onOpenChange(false);
  };

  return (
    <Dialog open={!!campaign} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card" preventAutoFocus>
        <DialogHeader>
          <DialogTitle>Rename Campaign</DialogTitle>
          <DialogDescription>Update the campaign name.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="rename-name">Campaign Name</Label>
            <Input
              id="rename-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter campaign name"
            />
          </div>
        </div>
        <DialogFooter className="grid grid-cols-2 gap-3 sm:space-x-0">
          <Button type="button" variant="outline" onClick={handleClose} className="w-full">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => void handleSave()}
            className="w-full"
            disabled={!name.trim() || saving}
          >
            {saving ? <Spinner className="mr-1 h-4 w-4" /> : null}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
