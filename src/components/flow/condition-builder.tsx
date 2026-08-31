"use client";

import { Plus, Settings2, Trash2 } from "lucide-react";
import { type FC, memo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGlobalSettingsStore } from "@/store/global-settings.store";
import {
  type TransitionCondition,
  type TransitionConditionGroup,
  ConditionOperator,
  CONDITION_OPERATOR_LABELS,
} from "@/types/flow.types";

// ============================================
// Condition Builder Props
// ============================================

interface ConditionBuilderProps {
  conditions?: TransitionConditionGroup;
  onChange: (conditions: TransitionConditionGroup | undefined) => void;
  trigger?: React.ReactNode;
}

// ============================================
// Condition Builder Component
// ============================================

export const ConditionBuilder: FC<ConditionBuilderProps> = memo(
  ({ conditions, onChange, trigger }) => {
    const [open, setOpen] = useState(false);
    const { globalSettings } = useGlobalSettingsStore();

    const allVariables = [
      ...globalSettings.systemVariables,
      ...globalSettings.promptVariables,
      ...globalSettings.customVariables,
    ];

    const [localConditions, setLocalConditions] =
      useState<TransitionConditionGroup>(
        conditions || {
          matchType: "any",
          conditions: [],
        },
      );

    const handleMatchTypeChange = (matchType: "any" | "all") => {
      setLocalConditions((prev) => ({ ...prev, matchType }));
    };

    const handleAddCondition = () => {
      const newCondition: TransitionCondition = {
        id: `cond_${Date.now()}`,
        variableName: "",
        operator: ConditionOperator.Equals,
        value: "",
      };
      setLocalConditions((prev) => ({
        ...prev,
        conditions: [...prev.conditions, newCondition],
      }));
    };

    const handleUpdateCondition = (
      id: string,
      updates: Partial<TransitionCondition>,
    ) => {
      setLocalConditions((prev) => ({
        ...prev,
        conditions: prev.conditions.map((c) =>
          c.id === id ? { ...c, ...updates } : c,
        ),
      }));
    };

    const handleRemoveCondition = (id: string) => {
      setLocalConditions((prev) => ({
        ...prev,
        conditions: prev.conditions.filter((c) => c.id !== id),
      }));
    };

    const handleSave = () => {
      // If no conditions, set to undefined
      if (localConditions.conditions.length === 0) {
        onChange(undefined);
      } else {
        onChange(localConditions);
      }
      setOpen(false);
    };

    const handleClear = () => {
      setLocalConditions({ matchType: "any", conditions: [] });
      onChange(undefined);
      setOpen(false);
    };

    const handleOpenChange = (newOpen: boolean) => {
      if (newOpen) {
        // Reset local state when opening
        setLocalConditions(conditions || { matchType: "any", conditions: [] });
      }
      setOpen(newOpen);
    };

    // Check if value field is needed for this operator
    const needsValue = (operator: ConditionOperator) => {
      return ![ConditionOperator.Exists, ConditionOperator.NotExists].includes(
        operator,
      );
    };

    const hasConditions = conditions && conditions.conditions.length > 0;

    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          {trigger || (
            <Button
              variant={hasConditions ? "secondary" : "outline"}
              size="sm"
              className="gap-1 h-7"
            >
              <Settings2 className="h-3 w-3" />
              {hasConditions ? (
                <span className="flex items-center gap-1">
                  {conditions.conditions.length} condition
                  {conditions.conditions.length > 1 ? "s" : ""}
                </span>
              ) : (
                "Add Conditions"
              )}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              Configure Conditions
            </DialogTitle>
            <DialogDescription>
              Set conditions to control when this transition is taken.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Match Type Selector */}
            <div className="flex items-center gap-2">
              <Select
                value={localConditions.matchType}
                onValueChange={(v) => handleMatchTypeChange(v as "any" | "all")}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">
                of the following conditions match
              </span>
            </div>

            {/* Conditions List */}
            <div className="space-y-3">
              {localConditions.conditions.map((condition) => (
                <div
                  key={condition.id}
                  className="flex items-center gap-2 p-3 rounded-lg border border-border bg-muted/30"
                >
                  {/* Variable Selector */}
                  <Select
                    value={condition.variableName}
                    onValueChange={(v) =>
                      handleUpdateCondition(condition.id, { variableName: v })
                    }
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="{{Variable}}" />
                    </SelectTrigger>
                    <SelectContent>
                      {allVariables.map((v) => (
                        <SelectItem key={v.id} value={v.name}>
                          <code className="text-xs">{`{{${v.name}}}`}</code>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Operator Selector */}
                  <Select
                    value={condition.operator}
                    onValueChange={(v) =>
                      handleUpdateCondition(condition.id, {
                        operator: v as ConditionOperator,
                      })
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CONDITION_OPERATOR_LABELS).map(
                        ([op, label]) => (
                          <SelectItem key={op} value={op}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>

                  {/* Value Input */}
                  {needsValue(condition.operator) && (
                    <Input
                      value={condition.value}
                      onChange={(e) =>
                        handleUpdateCondition(condition.id, {
                          value: e.target.value,
                        })
                      }
                      placeholder="Value"
                      className="flex-1"
                    />
                  )}

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive shrink-0"
                    onClick={() => handleRemoveCondition(condition.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {/* Empty State */}
              {localConditions.conditions.length === 0 && (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  No conditions set. This transition will always be available.
                </div>
              )}
            </div>

            {/* Add Condition Button */}
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1"
              onClick={handleAddCondition}
            >
              <Plus className="h-4 w-4" />
              Add Condition
            </Button>
          </div>

          <DialogFooter className="gap-2">
            {hasConditions && (
              <Button variant="ghost" onClick={handleClear}>
                Clear All
              </Button>
            )}
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Conditions</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);

ConditionBuilder.displayName = "ConditionBuilder";

// ============================================
// Condition Summary Badge
// ============================================

interface ConditionSummaryProps {
  conditions?: TransitionConditionGroup;
}

export const ConditionSummary: FC<ConditionSummaryProps> = memo(
  ({ conditions }) => {
    if (!conditions || conditions.conditions.length === 0) {
      return null;
    }

    const count = conditions.conditions.length;
    const matchType = conditions.matchType === "any" ? "OR" : "AND";

    return (
      <Badge variant="outline" className="text-[10px] gap-1">
        {count} condition{count > 1 ? "s" : ""} ({matchType})
      </Badge>
    );
  },
);

ConditionSummary.displayName = "ConditionSummary";
