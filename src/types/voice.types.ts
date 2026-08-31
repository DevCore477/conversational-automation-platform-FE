export interface Voice {
  voice_id: string;
  name: string;
  category: string;
  labels: {
    accent?: string;
    descriptive?: string;
    age?: string;
    gender?: string;
    language?: string;
    use_case?: string;
  };
  description: string;
  preview_url: string;
  available_for_tiers: string[];
  settings?: {
    stability?: number;
    similarity_boost?: number;
  } | null;
  isDefault?: boolean;
  fine_tuning?: unknown;
  samples?: unknown;
  sharing?: unknown;
  high_quality_base_model_ids?: string[];
  verified_languages?: verifiedLanguagesElevenLabs[];
  collection_ids?: string[];
  safety_control?: unknown;
  voice_verification?: unknown;
  permission_on_resource?: unknown;
  is_owner?: boolean;
  is_legacy?: boolean;
  is_mixed?: boolean;
  favorited_at_unix?: number | null;
  created_at_unix?: number | null;
}

export interface VoicesResponse {
  voices: Voice[];
  defaultVoiceId?: string;
  defaultVoiceSource?: string;
}


export interface verifiedLanguagesElevenLabs {
  language: string;
  model_id: string;
  accent: string;
  locale: string;
  /** ElevenLabs sample for this locale; play when present. */
  preview_url?: string;
}