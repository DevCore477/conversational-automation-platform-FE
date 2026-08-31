import { CampaignStatus } from "@/types/campaign.types";

export const CAMPAIGN_STATUS_BADGE: Record<
  CampaignStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  [CampaignStatus.Active]: "default",
  [CampaignStatus.Completed]: "secondary",
  [CampaignStatus.Draft]: "secondary",
  [CampaignStatus.Failed]: "destructive",
  [CampaignStatus.Queued]: "outline",
};
