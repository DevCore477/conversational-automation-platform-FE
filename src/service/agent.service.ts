import api from "@/lib/axios";

export interface AgentInfo {
  agent_id: string;
  name: string;
  conversation_config: {
    asr: {
      quality: string;
      provider: string;
      user_input_audio_format: string;
      keywords: string[];
    };
    turn: {
      turn_timeout: number;
      initial_wait_time: number | null;
      silence_end_call_timeout: number;
      soft_timeout_config: {
        timeout_seconds: number;
        message: string;
        use_llm_generated_message: boolean;
      };
      mode: string;
      turn_eagerness: string;
      spelling_patience: string;
      speculative_turn: boolean;
      turn_model: string;
    };
    tts: {
      model_id: string;
      voice_id: string;
      supported_voices: string[];
      expressive_mode: boolean;
      suggested_audio_tags: string[];
      agent_output_audio_format: string;
      optimize_streaming_latency: number;
      stability: number;
      speed: number;
      similarity_boost: number;
      text_normalisation_type: string;
      pronunciation_dictionary_locators: string[];
    };
    conversation: {
      text_only: boolean;
      max_duration_seconds: number;
      client_events: string[];
      monitoring_enabled: boolean;
      monitoring_events: string[];
    };
    language_presets: Record<string, unknown>;
    vad: {
      background_voice_detection: boolean;
    };
    agent: {
      first_message: string;
      language: string;
      hinglish_mode: boolean;
      dynamic_variables: {
        dynamic_variable_placeholders: Record<string, unknown>;
      };
      disable_first_message_interruptions: boolean;
      prompt: {
        prompt: string;
        llm: string;
        reasoning_effort: number | null;
        thinking_budget: number | null;
        temperature: number;
        max_tokens: number;
        tool_ids: string[];
        built_in_tools: Record<string, unknown>;
        enable_parallel_tool_calls: boolean;
        mcp_server_ids: string[];
        native_mcp_server_ids: string[];
        knowledge_base: string[];
        custom_llm: unknown;
        ignore_default_personality: boolean;
        rag: {
          enabled: boolean;
          embedding_model: string;
          max_vector_distance: number;
          max_documents_length: number;
          max_retrieved_rag_chunks_count: number;
          query_rewrite_prompt_override: string | null;
        };
        timezone: string | null;
        backup_llm_config: {
          preference: string;
        };
        cascade_timeout_seconds: number;
        tools: string[];
      };
    };
  };
  metadata: {
    created_at_unix_secs: number;
    updated_at_unix_secs: number;
  };
  platform_settings: {
    evaluation: {
      criteria: string[];
    };
    widget: {
      variant: string;
      placement: string;
      expandable: string;
      avatar: {
        type: string;
        color_1: string;
        color_2: string;
      };
      feedback_mode: string;
      end_feedback: {
        type: string;
      };
      bg_color: string;
      text_color: string;
      btn_color: string;
      btn_text_color: string;
      border_color: string;
      focus_color: string;
      border_radius: number | null;
      btn_radius: number | null;
      action_text: string | null;
      start_call_text: string | null;
      end_call_text: string | null;
      expand_text: string | null;
      listening_text: string | null;
      speaking_text: string | null;
      shareable_page_text: string | null;
      shareable_page_show_terms: boolean;
      terms_text: string;
      terms_html: string;
      terms_key: string | null;
      show_avatar_when_collapsed: boolean;
      disable_banner: boolean;
      override_link: string | null;
      markdown_link_allowed_hosts: string[];
      markdown_link_include_www: boolean;
      markdown_link_allow_http: boolean;
      mic_muting_enabled: boolean;
      transcript_enabled: boolean;
      text_input_enabled: boolean;
      conversation_mode_toggle_enabled: boolean;
      default_expanded: boolean;
      always_expanded: boolean;
      text_contents: Record<string, unknown>;
      styles: Record<string, unknown>;
      language_selector: boolean;
      supports_text_only: boolean;
      custom_avatar_path: string | null;
      language_presets: Record<string, unknown>;
    };
    data_collection: Record<string, unknown>;
    overrides: {
      conversation_config_override: {
        turn: {
          soft_timeout_config: {
            message: boolean;
          };
        };
        tts: {
          voice_id: boolean;
          stability: boolean;
          speed: boolean;
          similarity_boost: boolean;
        };
        conversation: {
          text_only: boolean;
        };
        agent: {
          first_message: boolean;
          language: boolean;
          prompt: {
            prompt: boolean;
            llm: boolean;
            native_mcp_server_ids: boolean;
          };
        };
      };
      custom_llm_extra_body: boolean;
      enable_conversation_initiation_client_data_from_webhook: boolean;
    };
    workspace_overrides: {
      conversation_initiation_client_data_webhook: string | null;
      webhooks: {
        post_call_webhook_id: string | null;
        events: string[];
        send_audio: boolean;
      };
    };
    testing: {
      attached_tests: string[];
      referenced_tests_ids: string[];
    };
    archived: boolean;
    guardrails: {
      version: string;
      alignment: {
        is_enabled: boolean;
      };
      content: {
        config: {
          sexual: {
            is_enabled: boolean;
            threshold: number;
          };
          violence: {
            is_enabled: boolean;
            threshold: number;
          };
          harassment: {
            is_enabled: boolean;
            threshold: number;
          };
          self_harm: {
            is_enabled: boolean;
            threshold: number;
          };
          profanity: {
            is_enabled: boolean;
            threshold: number;
          };
          religion_and_politics: {
            is_enabled: boolean;
            threshold: number;
          };
          medical_and_legal_information: {
            is_enabled: boolean;
            threshold: number;
          };
        };
      };
      moderation: {
        config: {
          sexual: {
            is_enabled: boolean;
            threshold: number;
          };
          violence: {
            is_enabled: boolean;
            threshold: number;
          };
          violence_graphic: {
            is_enabled: boolean;
            threshold: number;
          };
          harassment: {
            is_enabled: boolean;
            threshold: number;
          };
          harassment_threatening: {
            is_enabled: boolean;
            threshold: number;
          };
          hate: {
            is_enabled: boolean;
            threshold: number;
          };
          hate_threatening: {
            is_enabled: boolean;
            threshold: number;
          };
          self_harm_instructions: {
            is_enabled: boolean;
            threshold: number;
          };
          self_harm: {
            is_enabled: boolean;
            threshold: number;
          };
          self_harm_intent: {
            is_enabled: boolean;
            threshold: number;
          };
          sexual_minors: {
            is_enabled: boolean;
            threshold: number;
          };
        };
      };
      custom: {
        config: {
          configs: string[];
        };
      };
    };
    auth: {
      enable_auth: boolean;
      allowlist: string[];
      require_origin_header: boolean;
      shareable_token: string | null;
    };
    call_limits: {
      agent_concurrency_limit: number;
      daily_limit: number;
      bursting_enabled: boolean;
    };
    ban: string | null;
    privacy: {
      record_voice: boolean;
      retention_days: number;
      delete_transcript_and_pii: boolean;
      delete_audio: boolean;
      apply_to_existing_conversations: boolean;
      zero_retention_mode: boolean;
      conversation_history_redaction: {
        enabled: boolean;
        entities: string[];
      };
    };
    safety: {
      is_blocked_ivc: boolean;
      is_blocked_non_ivc: boolean;
      ignore_safety_evaluation: boolean;
    };
  };
  phone_numbers: string[];
  whatsapp_accounts: string[];
  workflow: {
    edges: Record<string, unknown>;
    nodes: {
      start_node: {
        type: string;
        position: {
          x: number;
          y: number;
        };
        edge_order: string[];
      };
    };
    prevent_subagent_loops: boolean;
  };
  access_info: {
    is_creator: boolean;
    creator_name: string;
    creator_email: string;
    role: string;
  };
  tags: string[];
  version_id: string;
  branch_id: string;
  main_branch_id: string;
  procedure_versions: string[];
  procedures_enabled: boolean;
}

export const agentService = {
  /**
   * Get agent info including conversation configuration
   */
  getAgentInfo: async (): Promise<AgentInfo> => {
    const response = await api.get<AgentInfo>("/elevenlabs/info");
    return response.data;
  },
};
