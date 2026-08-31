export enum CampaignStatus {
  Active = "ACTIVE",
  Completed = "COMPLETED",
  Draft = "DRAFT",
  Failed = "FAILED",
  Queued = "QUEUED",
}

export enum CampaignSortBy {
  CreatedAt = "CREATED_AT",
  Name = "NAME",
  Status = "STATUS",
  UpdatedAt = "UPDATED_AT",
}

export enum CommunicationChannel {
  Email = "EMAIL",
  Sms = "SMS",
}

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  channel: CommunicationChannel;
  messageTemplate: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
  totalContacts?: number;
  sentCount?: number;
  failedCount?: number;
}

export interface CreateCampaignInput {
  name: string;
  channel: CommunicationChannel;
  status: CampaignStatus;
  messageTemplate: string;
  scheduledAt?: string;
  contactIds: string[];
}

export interface UpdateCampaignInput {
  id: string;
  name?: string;
  channel?: CommunicationChannel;
  status?: CampaignStatus;
  messageTemplate?: string;
  scheduledAt?: string;
}
