import { Mail, MessageSquare } from "lucide-react";

import { CommunicationChannel } from "@/types/campaign.types";

export const COMMUNICATION_CHANNEL_ICONS: Record<
  CommunicationChannel,
  React.ComponentType<{ className?: string }>
> = {
  [CommunicationChannel.Email]: Mail,
  [CommunicationChannel.Sms]: MessageSquare,
};
