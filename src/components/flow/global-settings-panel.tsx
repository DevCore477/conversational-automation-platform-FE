"use client";

import {
  Settings,
  Plus,
  Trash2,
  ChevronDown,
  Cpu,
  FileText,
  Sparkles,
  Lock,
  X,
} from "lucide-react";
import { type FC, memo, useState, useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useGlobalSettingsStore } from "@/store/global-settings.store";
import { type Variable } from "@/types/flow.types";

interface GlobalSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSettingsPanel: FC<GlobalSettingsPanelProps> = memo(
  ({ isOpen, onClose }) => {
    const {
      globalSettings,
      setGlobalPrompt,
      addCustomVariable,
      removeCustomVariable,
      syncPromptVariables,
    } = useGlobalSettingsStore();

    const [systemVarsOpen, setSystemVarsOpen] = useState(true);
    const [promptVarsOpen, setPromptVarsOpen] = useState(true);
    const [customVarsOpen, setCustomVarsOpen] = useState(true);
    const [isAddVarDialogOpen, setIsAddVarDialogOpen] = useState(false);

    // New variable form state
    const [newVarName, setNewVarName] = useState("");
    const [newVarDisplayName, setNewVarDisplayName] = useState("");
    const [newVarDefault, setNewVarDefault] = useState("");
    const [newVarDescription, setNewVarDescription] = useState("");

    // Sync prompt variables when globalPrompt changes
    useEffect(() => {
      syncPromptVariables();
    }, [globalSettings.globalPrompt, syncPromptVariables]);

    const resetNewVarForm = () => {
      setNewVarName("");
      setNewVarDisplayName("");
      setNewVarDefault("");
      setNewVarDescription("");
    };

    const handleAddCustomVariable = () => {
      if (!newVarName.trim()) {
        return;
      }

      const name = newVarName
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "");

      addCustomVariable({
        name,
        displayName: newVarDisplayName || newVarName,
        defaultValue: newVarDefault,
        description: newVarDescription,
      });

      resetNewVarForm();
      setIsAddVarDialogOpen(false);
    };

    if (!isOpen) {
      return null;
    }

    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="fixed right-0 top-0 h-full w-full max-w-lg border-l border-border bg-card shadow-lg">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <h2 className="font-semibold">Global Settings</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="h-[calc(100%-65px)]">
            <div className="p-4 space-y-6">
              {/* Global Prompt Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm font-medium">Global Prompt</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  This prompt is prepended to every node. Variables you use here
                  (like {"{{my_variable}}"}) are auto-detected.
                </p>
                <Textarea
                  value={globalSettings.globalPrompt}
                  onChange={(e) => setGlobalPrompt(e.target.value)}
                  placeholder="Enter global system prompt..."
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>

              {/* System Variables */}
              <Collapsible
                open={systemVarsOpen}
                onOpenChange={setSystemVarsOpen}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-sm">
                      System Variables
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {globalSettings.systemVariables.length}
                    </Badge>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      systemVarsOpen ? "rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2 space-y-2">
                  <p className="text-xs text-muted-foreground px-2">
                    Auto-provided by the system. These are read-only.
                  </p>
                  {globalSettings.systemVariables.map((variable) => (
                    <VariableItem
                      key={variable.id}
                      variable={variable}
                      categoryColor="text-blue-500"
                      icon={<Lock className="h-3 w-3" />}
                    />
                  ))}
                </CollapsibleContent>
              </Collapsible>

              {/* Prompt Variables (Auto-detected) */}
              <Collapsible
                open={promptVarsOpen}
                onOpenChange={setPromptVarsOpen}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-amber-500" />
                    <span className="font-medium text-sm">
                      Prompt Variables
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {globalSettings.promptVariables.length}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      auto-detected
                    </Badge>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      promptVarsOpen ? "rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2 space-y-2">
                  <p className="text-xs text-muted-foreground px-2">
                    Variables detected from your global prompt (excluding system
                    variables).
                  </p>
                  {globalSettings.promptVariables.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic px-2 py-4 text-center">
                      No custom variables detected in the prompt. Use{" "}
                      {"{{variable_name}}"} syntax to add variables.
                    </p>
                  ) : (
                    globalSettings.promptVariables.map((variable) => (
                      <VariableItem
                        key={variable.id}
                        variable={variable}
                        categoryColor="text-amber-500"
                      />
                    ))
                  )}
                </CollapsibleContent>
              </Collapsible>

              {/* Custom Variables */}
              <Collapsible
                open={customVarsOpen}
                onOpenChange={setCustomVarsOpen}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    <span className="font-medium text-sm">
                      Custom Variables
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {globalSettings.customVariables.length}
                    </Badge>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      customVarsOpen ? "rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2 space-y-2">
                  <p className="text-xs text-muted-foreground px-2">
                    Variables you define for use throughout the flow.
                  </p>
                  {globalSettings.customVariables.map((variable) => (
                    <VariableItem
                      key={variable.id}
                      variable={variable}
                      categoryColor="text-purple-500"
                      onDelete={() => removeCustomVariable(variable.id)}
                    />
                  ))}

                  <Dialog
                    open={isAddVarDialogOpen}
                    onOpenChange={setIsAddVarDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-1 mt-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Custom Variable
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Custom Variable</DialogTitle>
                        <DialogDescription>
                          Create a new variable to use in your flow.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Variable Name</Label>
                          <Input
                            value={newVarName}
                            onChange={(e) => setNewVarName(e.target.value)}
                            placeholder="e.g., customer_name"
                            className="font-mono"
                          />
                          <p className="text-xs text-muted-foreground">
                            Use snake_case. Will be used as{" "}
                            {"{{customer_name}}"}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label>Display Name</Label>
                          <Input
                            value={newVarDisplayName}
                            onChange={(e) =>
                              setNewVarDisplayName(e.target.value)
                            }
                            placeholder="e.g., Customer Name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Default Value (Optional)</Label>
                          <Input
                            value={newVarDefault}
                            onChange={(e) => setNewVarDefault(e.target.value)}
                            placeholder="Default value if not set"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description (Optional)</Label>
                          <Textarea
                            value={newVarDescription}
                            onChange={(e) =>
                              setNewVarDescription(e.target.value)
                            }
                            placeholder="What is this variable used for?"
                            className="min-h-[80px]"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            resetNewVarForm();
                            setIsAddVarDialogOpen(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleAddCustomVariable}>
                          Add Variable
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CollapsibleContent>
              </Collapsible>

              {/* Tips Section */}
              <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-2">
                <h4 className="text-sm font-medium">Variable Tips</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>
                    • Use{" "}
                    <code className="bg-muted px-1 rounded">
                      {"{{variable}}"}
                    </code>{" "}
                    syntax
                  </li>
                  <li>
                    • Default values:{" "}
                    <code className="bg-muted px-1 rounded">
                      {"{{name||Guest}}"}
                    </code>
                  </li>
                  <li>• Variables in the prompt are auto-detected</li>
                  <li>• System variables are always available</li>
                </ul>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  },
);

GlobalSettingsPanel.displayName = "GlobalSettingsPanel";

// ============================================
// Variable Item Component
// ============================================

interface VariableItemProps {
  variable: Variable;
  categoryColor?: string;
  icon?: React.ReactNode;
  onDelete?: () => void;
}

const VariableItem: FC<VariableItemProps> = memo(
  ({ variable, categoryColor = "text-muted-foreground", icon, onDelete }) => {
    return (
      <div className="flex items-center gap-2 p-2 rounded border border-border bg-card mx-2">
        <div className={`shrink-0 ${categoryColor}`}>{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <code className="text-xs font-mono text-primary">
              {`{{${variable.name}}}`}
            </code>
            {variable.isReadOnly && (
              <Badge variant="outline" className="text-[10px]">
                read-only
              </Badge>
            )}
          </div>
          {variable.description && (
            <p className="text-xs text-muted-foreground truncate">
              {variable.description}
            </p>
          )}
          {variable.defaultValue && (
            <p className="text-xs text-muted-foreground">
              Default:{" "}
              <span className="font-mono">{variable.defaultValue}</span>
            </p>
          )}
        </div>
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive shrink-0"
            onClick={onDelete}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  },
);

VariableItem.displayName = "VariableItem";
