"use client";

import { Cpu, FileText, Sparkles, Braces } from "lucide-react";
import { type FC, memo, useState, useMemo, useRef } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGlobalSettingsStore } from "@/store/global-settings.store";
import { type Variable, VariableCategory } from "@/types/flow.types";

// ============================================
// Category Icons and Labels
// ============================================

const CATEGORY_CONFIG: Record<
  VariableCategory,
  { icon: typeof Cpu; label: string; color: string }
> = {
  [VariableCategory.System]: {
    icon: Cpu,
    label: "System Variables",
    color: "text-blue-500",
  },
  [VariableCategory.Prompt]: {
    icon: FileText,
    label: "Prompt Variables",
    color: "text-amber-500",
  },
  [VariableCategory.Custom]: {
    icon: Sparkles,
    label: "Custom Variables",
    color: "text-purple-500",
  },
};

// ============================================
// Variable Picker Props
// ============================================

interface VariablePickerProps {
  onSelect: (variableName: string) => void;
  trigger?: React.ReactNode;
  filterCategory?: VariableCategory[];
}

// ============================================
// Variable Picker Component
// ============================================

export const VariablePicker: FC<VariablePickerProps> = memo(
  ({ onSelect, trigger, filterCategory }) => {
    const [open, setOpen] = useState(false);
    const { globalSettings } = useGlobalSettingsStore();

    const variablesByCategory = useMemo(() => {
      const categories: Record<VariableCategory, Variable[]> = {
        [VariableCategory.System]: globalSettings.systemVariables,
        [VariableCategory.Prompt]: globalSettings.promptVariables,
        [VariableCategory.Custom]: globalSettings.customVariables,
      };

      // Filter by category if specified
      if (filterCategory && filterCategory.length > 0) {
        return Object.fromEntries(
          Object.entries(categories).filter(([key]) =>
            filterCategory.includes(key as VariableCategory),
          ),
        ) as Record<VariableCategory, Variable[]>;
      }

      return categories;
    }, [globalSettings, filterCategory]);

    const handleSelect = (variableName: string) => {
      onSelect(variableName);
      setOpen(false);
    };

    const categoryOrder: VariableCategory[] = [
      VariableCategory.System,
      VariableCategory.Prompt,
      VariableCategory.Custom,
    ];

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {trigger || (
            <Button variant="outline" size="sm" className="gap-2 h-8">
              <Braces className="h-3 w-3" />
              Insert Variable
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Command>
            <CommandInput placeholder="Search variables..." />
            <CommandList>
              <CommandEmpty>No variables found.</CommandEmpty>

              {categoryOrder.map((category, index) => {
                const variables = variablesByCategory[category];
                if (!variables || variables.length === 0) {
                  return null;
                }

                const config = CATEGORY_CONFIG[category];
                const Icon = config.icon;

                return (
                  <div key={category}>
                    {index > 0 && <CommandSeparator />}
                    <CommandGroup heading={config.label}>
                      {variables.map((variable) => (
                        <CommandItem
                          key={variable.id}
                          value={variable.name}
                          onSelect={() => handleSelect(variable.name)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Icon className={`h-3 w-3 ${config.color}`} />
                          <div className="flex-1 min-w-0">
                            <code className="text-xs font-mono">
                              {`{{${variable.name}}}`}
                            </code>
                            {variable.description && (
                              <p className="text-xs text-muted-foreground truncate">
                                {variable.description}
                              </p>
                            )}
                          </div>
                          {variable.isReadOnly && (
                            <Badge
                              variant="outline"
                              className="text-[10px] shrink-0"
                            >
                              read-only
                            </Badge>
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </div>
                );
              })}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

VariablePicker.displayName = "VariablePicker";

// ============================================
// Variable Input with Autocomplete
// ============================================

interface VariableInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
}

export const VariableInput: FC<VariableInputProps> = memo(
  ({ value, onChange, placeholder, className, multiline = false }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [cursorPosition, setCursorPosition] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const { globalSettings } = useGlobalSettingsStore();

    const allVariables = useMemo(
      () => [
        ...globalSettings.systemVariables,
        ...globalSettings.promptVariables,
        ...globalSettings.customVariables,
      ],
      [globalSettings],
    );

    const filteredVariables = useMemo(() => {
      if (!searchTerm) {
        return allVariables;
      }
      return allVariables.filter(
        (v) =>
          v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.displayName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }, [allVariables, searchTerm]);

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      const newValue = e.target.value;
      onChange(newValue);

      const position = e.target.selectionStart || 0;
      setCursorPosition(position);

      const beforeCursor = newValue.substring(0, position);
      const openBraceIndex = beforeCursor.lastIndexOf("{{");
      const closeBraceIndex = beforeCursor.lastIndexOf("}}");

      if (openBraceIndex > closeBraceIndex) {
        const partial = beforeCursor.substring(openBraceIndex + 2);
        setSearchTerm(partial);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
        setSearchTerm("");
      }
    };

    const handleSelectVariable = (variableName: string) => {
      const beforeCursor = value.substring(0, cursorPosition);
      const openBraceIndex = beforeCursor.lastIndexOf("{{");

      if (openBraceIndex !== -1) {
        const newValue =
          value.substring(0, openBraceIndex) +
          `{{${variableName}}}` +
          value.substring(cursorPosition);
        onChange(newValue);
      }

      setShowSuggestions(false);
      setSearchTerm("");
    };

    const handleInsertVariable = (variableName: string) => {
      const input = inputRef.current;
      if (!input) {
        onChange(value + `{{${variableName}}}`);
        return;
      }

      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const newValue =
        value.substring(0, start) +
        `{{${variableName}}}` +
        value.substring(end);
      onChange(newValue);

      setTimeout(() => {
        const newPosition = start + variableName.length + 4;
        input.setSelectionRange(newPosition, newPosition);
        input.focus();
      }, 0);
    };

    const getCategoryIcon = (variable: Variable) => {
      const config = CATEGORY_CONFIG[variable.category];
      const Icon = config.icon;
      return <Icon className={`h-3 w-3 ${config.color}`} />;
    };

    return (
      <div className="relative">
        <div className="flex gap-2">
          {multiline ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={value}
              onChange={handleInputChange}
              placeholder={placeholder}
              className={`flex-1 min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring ${className}`}
            />
          ) : (
            <Input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              value={value}
              onChange={handleInputChange}
              placeholder={placeholder}
              className={className}
            />
          )}
          <VariablePicker
            onSelect={handleInsertVariable}
            trigger={
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 h-9 w-9"
              >
                <Braces className="h-4 w-4" />
              </Button>
            }
          />
        </div>

        {/* Autocomplete Dropdown */}
        {showSuggestions && filteredVariables.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-popover border border-border rounded-md shadow-md overflow-hidden">
            <ScrollArea className="max-h-48">
              {filteredVariables.map((variable) => (
                <button
                  key={variable.id}
                  type="button"
                  className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 transition-colors"
                  onClick={() => handleSelectVariable(variable.name)}
                >
                  {getCategoryIcon(variable)}
                  <span className="font-mono text-xs">{`{{${variable.name}}}`}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {variable.displayName}
                  </span>
                </button>
              ))}
            </ScrollArea>
          </div>
        )}
      </div>
    );
  },
);

VariableInput.displayName = "VariableInput";

// ============================================
// Variable Badge Display
// ============================================

interface VariableBadgeProps {
  name: string;
  onClick?: () => void;
  onRemove?: () => void;
}

export const VariableBadge: FC<VariableBadgeProps> = memo(
  ({ name, onClick, onRemove }) => {
    return (
      <Badge
        variant="secondary"
        className="font-mono text-xs gap-1 cursor-pointer hover:bg-secondary/80"
        onClick={onClick}
      >
        {`{{${name}}}`}
        {onRemove && (
          <button
            type="button"
            className="ml-1 hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            ×
          </button>
        )}
      </Badge>
    );
  },
);

VariableBadge.displayName = "VariableBadge";

// ============================================
// Variables Used Display
// ============================================

interface VariablesUsedProps {
  content: string;
}

export const VariablesUsed: FC<VariablesUsedProps> = memo(({ content }) => {
  const { globalSettings } = useGlobalSettingsStore();

  const usedVariables = useMemo(() => {
    const regex = /\{\{([^}]+)\}\}/g;
    const found: string[] = [];
    let match;

    while ((match = regex.exec(content)) !== null) {
      const varName = match[1].split("||")[0].trim();
      if (!found.includes(varName)) {
        found.push(varName);
      }
    }

    return found;
  }, [content]);

  const allVariables = [
    ...globalSettings.systemVariables,
    ...globalSettings.promptVariables,
    ...globalSettings.customVariables,
  ];

  if (usedVariables.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      <span className="text-xs text-muted-foreground mr-1">
        Variables used:
      </span>
      {usedVariables.map((varName) => {
        const variable = allVariables.find((v) => v.name === varName);
        const isValid = !!variable;

        return (
          <Badge
            key={varName}
            variant={isValid ? "secondary" : "destructive"}
            className="font-mono text-[10px]"
          >
            {`{{${varName}}}`}
          </Badge>
        );
      })}
    </div>
  );
});

VariablesUsed.displayName = "VariablesUsed";
