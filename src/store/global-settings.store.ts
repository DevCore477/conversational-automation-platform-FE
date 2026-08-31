import { create } from "zustand";
import { persist } from "zustand/middleware";

import { toDisplayName } from "@/common/utils/string.utils";
import {
  type GlobalSettings,
  type Variable,
  VariableCategory,
} from "@/types/flow.types";

// ============================================
// Variable Detection Utility
// ============================================

/**
 * Extracts variable names from text using {{variable_name}} syntax
 * @param text - Text to parse for variables
 * @returns Array of variable names found
 */
export function extractVariablesFromText(text: string): string[] {
  const regex = /\{\{([a-zA-Z_][a-zA-Z0-9_]*?)(?:\|\|[^}]*)?\}\}/g;
  const variables: string[] = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    const varName = match[1];
    if (!variables.includes(varName)) {
      variables.push(varName);
    }
  }

  return variables;
}

// ============================================
// Default System Variables
// ============================================

const DEFAULT_SYSTEM_VARIABLES: Variable[] = [
  {
    id: "sys_session_id",
    name: "session_id",
    displayName: "Session ID",
    category: VariableCategory.System,
    isReadOnly: true,
    description: "Unique identifier for the current call session",
  },
  {
    id: "sys_caller_number",
    name: "caller_number",
    displayName: "Caller Number",
    category: VariableCategory.System,
    isReadOnly: true,
    description: "Phone number of the caller",
  },
  {
    id: "sys_called_number",
    name: "called_number",
    displayName: "Called Number",
    category: VariableCategory.System,
    isReadOnly: true,
    description: "Phone number that was called",
  },
  {
    id: "sys_call_start_time",
    name: "call_start_time",
    displayName: "Call Start Time",
    category: VariableCategory.System,
    isReadOnly: true,
    description: "Timestamp when the call started",
  },
  {
    id: "sys_bot_name",
    name: "bot_name",
    displayName: "Bot Name",
    category: VariableCategory.System,
    defaultValue: "AI Assistant",
    description: "Name of the calling bot",
  },
  {
    id: "sys_language",
    name: "language",
    displayName: "Language",
    category: VariableCategory.System,
    defaultValue: "en-US",
    description: "Language code for the call",
  },
];

// ============================================
// Default Global Settings
// ============================================

const DEFAULT_GLOBAL_SETTINGS: GlobalSettings = {
  globalPrompt: `You are {{bot_name}}, an AI call assistant.

Current session: {{session_id}}
Language: {{language}}

Instructions:
- Be helpful, professional, and concise
- Always confirm important information
- If you don't understand, politely ask for clarification`,
  systemVariables: DEFAULT_SYSTEM_VARIABLES,
  promptVariables: [], // Will be auto-populated
  customVariables: [],
};

// ============================================
// Store Interface
// ============================================

interface GlobalSettingsStore {
  globalSettings: GlobalSettings;

  // Global Prompt
  setGlobalPrompt: (prompt: string) => void;

  // System Variables
  updateSystemVariable: (id: string, updates: Partial<Variable>) => void;

  // Prompt Variables (auto-detected)
  syncPromptVariables: () => void;

  // Custom Variables
  addCustomVariable: (variable: Omit<Variable, "id" | "category">) => void;
  updateCustomVariable: (id: string, updates: Partial<Variable>) => void;
  removeCustomVariable: (id: string) => void;

  // Utilities
  getAllVariables: () => Variable[];
  getVariablesByCategory: (category: VariableCategory) => Variable[];
  getVariableByName: (name: string) => Variable | undefined;
  resetToDefaults: () => void;
}

// ============================================
// Store Implementation
// ============================================

export const useGlobalSettingsStore = create<GlobalSettingsStore>()(
  persist(
    (set, get) => ({
      globalSettings: DEFAULT_GLOBAL_SETTINGS,

      setGlobalPrompt: (prompt) => {
        set((state) => ({
          globalSettings: {
            ...state.globalSettings,
            globalPrompt: prompt,
          },
        }));
        // Auto-sync prompt variables after updating prompt
        get().syncPromptVariables();
      },

      updateSystemVariable: (id, updates) => {
        set((state) => ({
          globalSettings: {
            ...state.globalSettings,
            systemVariables: state.globalSettings.systemVariables.map((v) =>
              v.id === id ? { ...v, ...updates } : v,
            ),
          },
        }));
      },

      syncPromptVariables: () => {
        const { globalSettings } = get();
        const {
          globalPrompt,
          systemVariables,
          customVariables,
          promptVariables,
        } = globalSettings;

        // Extract all variable names from the global prompt
        const extractedNames = extractVariablesFromText(globalPrompt);

        // Get existing system and custom variable names
        const systemNames = systemVariables.map((v) => v.name);
        const customNames = customVariables.map((v) => v.name);

        // Find new prompt variables (not in system or custom)
        const newPromptVars: Variable[] = [];

        for (const name of extractedNames) {
          // Skip if it's a system or custom variable
          if (systemNames.includes(name) || customNames.includes(name)) {
            continue;
          }

          // Check if it already exists as a prompt variable
          const existing = promptVariables.find((v) => v.name === name);
          if (existing) {
            newPromptVars.push(existing);
          } else {
            // Create new prompt variable
            newPromptVars.push({
              id: `prompt_${name}_${Date.now()}`,
              name,
              displayName: toDisplayName(name),
              category: VariableCategory.Prompt,
              description: `Auto-detected from global prompt`,
            });
          }
        }

        // Remove prompt variables no longer in the prompt
        set((state) => ({
          globalSettings: {
            ...state.globalSettings,
            promptVariables: newPromptVars,
          },
        }));
      },

      addCustomVariable: (variable) => {
        const newVar: Variable = {
          ...variable,
          id: `custom_${variable.name}_${Date.now()}`,
          category: VariableCategory.Custom,
        };

        set((state) => ({
          globalSettings: {
            ...state.globalSettings,
            customVariables: [...state.globalSettings.customVariables, newVar],
          },
        }));
      },

      updateCustomVariable: (id, updates) => {
        set((state) => ({
          globalSettings: {
            ...state.globalSettings,
            customVariables: state.globalSettings.customVariables.map((v) =>
              v.id === id ? { ...v, ...updates } : v,
            ),
          },
        }));
      },

      removeCustomVariable: (id) => {
        set((state) => ({
          globalSettings: {
            ...state.globalSettings,
            customVariables: state.globalSettings.customVariables.filter(
              (v) => v.id !== id,
            ),
          },
        }));
      },

      getAllVariables: () => {
        const { globalSettings } = get();
        return [
          ...globalSettings.systemVariables,
          ...globalSettings.promptVariables,
          ...globalSettings.customVariables,
        ];
      },

      getVariablesByCategory: (category) => {
        const { globalSettings } = get();
        switch (category) {
          case VariableCategory.System:
            return globalSettings.systemVariables;
          case VariableCategory.Prompt:
            return globalSettings.promptVariables;
          case VariableCategory.Custom:
            return globalSettings.customVariables;
          default:
            return [];
        }
      },

      getVariableByName: (name) => {
        const allVariables = get().getAllVariables();
        return allVariables.find((v) => v.name === name);
      },

      resetToDefaults: () => {
        set({ globalSettings: DEFAULT_GLOBAL_SETTINGS });
      },
    }),
    {
      name: "flow-global-settings",
      partialize: (state) => ({ globalSettings: state.globalSettings }),
      onRehydrateStorage: () => (state) => {
        // Sync prompt variables after rehydration
        if (state) {
          state.syncPromptVariables();
        }
      },
    },
  ),
);

// ============================================
// Helper Hooks
// ============================================

export const useGlobalPrompt = () => {
  const globalPrompt = useGlobalSettingsStore(
    (s) => s.globalSettings.globalPrompt,
  );
  const setGlobalPrompt = useGlobalSettingsStore((s) => s.setGlobalPrompt);
  return { globalPrompt, setGlobalPrompt };
};

export const useVariables = () => {
  const getAllVariables = useGlobalSettingsStore((s) => s.getAllVariables);
  const getVariablesByCategory = useGlobalSettingsStore(
    (s) => s.getVariablesByCategory,
  );
  const getVariableByName = useGlobalSettingsStore((s) => s.getVariableByName);

  return {
    getAllVariables,
    getVariablesByCategory,
    getVariableByName,
  };
};

export const useCustomVariables = () => {
  const customVariables = useGlobalSettingsStore(
    (s) => s.globalSettings.customVariables,
  );
  const addCustomVariable = useGlobalSettingsStore((s) => s.addCustomVariable);
  const updateCustomVariable = useGlobalSettingsStore(
    (s) => s.updateCustomVariable,
  );
  const removeCustomVariable = useGlobalSettingsStore(
    (s) => s.removeCustomVariable,
  );

  return {
    customVariables,
    addCustomVariable,
    updateCustomVariable,
    removeCustomVariable,
  };
};
