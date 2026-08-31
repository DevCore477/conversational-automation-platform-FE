"use client";

import {
  CheckCircle2,
  ChevronLeft,
  Copy,
  Loader2,
  Menu,
  Radio,
  Save,
  Settings,
  Terminal,
  X,
} from "lucide-react";
import { type FC, memo, useCallback, useEffect, useRef, useState } from "react";
import { ReactFlowProvider } from "reactflow";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { copyToClipboard } from "@/lib/clipboard";
import { getErrorMessage } from "@/lib/get-error-message";
import { useConversationFlowStore } from "@/store/conversation-flow.store";
import { useFlowStore } from "@/store/flow.store";

import { FlowCanvas } from "./flow-canvas";
import { GlobalSettingsPanel } from "./global-settings-panel";
import { NodeConfigPanel } from "./node-config-panel";
import { NodePalette } from "./node-palette";
import { NodeType } from "@/types/flow.types";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/store/theme.store";

interface FlowBuilderProps {
  onClose: () => void;
  initialFlowName?: string;
  flowId?: string | null;
  companyId?: string;
  onFlowCreated?: (flowId: string) => void;
}

export const FlowBuilder: FC<FlowBuilderProps> = memo(
  ({
    onClose,
    initialFlowName = "Untitled Flow",
    flowId = null,
    companyId,
    onFlowCreated,
  }) => {
    const { flow, setFlowMetadata, selectedNodeId, getBackendPayload } =
      useFlowStore();
    const {
      createFlow,
      updateFlow,
      validateFlow,
      publishFlow,
      error: apiError,
      validateResult,
      isSaving,
      isPublishing,
      clearError,
      clearValidateResult,
      getFlowById,
    } = useConversationFlowStore();

    const [flowName, setFlowName] = useState(initialFlowName);

    // Keep header title in sync when opening a different flow/template (e.g. via key change or prop change)
    useEffect(() => {
      setFlowName(initialFlowName);
    }, [initialFlowName]);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [showLeftSidebar, setShowLeftSidebar] = useState(false);
    const [showRightSidebar, setShowRightSidebar] = useState(false);
    const [showGlobalSettings, setShowGlobalSettings] = useState(false);
    const [showPositionConsole, setShowPositionConsole] = useState(false);
    const [previewPayload, setPreviewPayload] = useState<string>("");
    const [copied, setCopied] = useState(false);

    // Track flow state after last save to detect unsaved changes
    const savedFlowSnapshotRef = useRef<string>("");
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const [needsRepublish, setNeedsRepublish] = useState(false);
    const { theme } = useThemeStore();

    // Initialize saved snapshot when component mounts or flowId changes
    useEffect(() => {
      savedFlowSnapshotRef.current = JSON.stringify(flow);
      setHasUnsavedChanges(false);
    }, [flowId]);

    // Detect unsaved changes by comparing current flow with saved snapshot
    useEffect(() => {
      const currentSnapshot = JSON.stringify(flow);
      setHasUnsavedChanges(savedFlowSnapshotRef.current !== currentSnapshot);
    }, [flow]);

    // Auto-open right sidebar when node is selected on small screens only
    useEffect(() => {
      if (selectedNodeId) {
        const isSmallScreen = window.matchMedia("(max-width: 1024px)").matches;
        if (isSmallScreen) {
          setShowRightSidebar(true);
        }
      }
    }, [selectedNodeId]);

    // Generate payload preview when save dialog opens
    useEffect(() => {
      if (showSaveDialog) {
        // Only generate the preview payload here, do not update store metadata to avoid infinite loop
        const payload = getBackendPayload();
        const fullPayload = flowId
          ? { flow: payload }
          : { name: flowName, flow: payload };
        setPreviewPayload(JSON.stringify(fullPayload, null, 2));
        setCopied(false);
      }
    }, [showSaveDialog, flowName, getBackendPayload, flowId]);

    const handleSaveFlow = useCallback(async () => {
      setFlowMetadata({
        name: flowName,
        description: flow.metadata?.description,
        createdAt: flow.metadata?.createdAt || new Date().toISOString(),
      });
      const payload = getBackendPayload();

      if (companyId) {
        try {
          clearError();
          if (flowId) {
            const updated = await updateFlow(flowId, companyId, {
              flow: payload,
            });
            toast.success("Flow saved.");
            setFlowName(updated.name);
            setShowSaveDialog(false);
            // Update saved snapshot after successful save
            savedFlowSnapshotRef.current = JSON.stringify(flow);
            setHasUnsavedChanges(false);
            // Clear validation result since flow state is now "saved"
            clearValidateResult();
            setNeedsRepublish(true);
          } else {
            const created = await createFlow(companyId, {
              name: flowName,
              flow: payload,
            });
            toast.success("Flow created.");
            setShowSaveDialog(false);
            onFlowCreated?.(created.id);
            // Update saved snapshot after successful save
            savedFlowSnapshotRef.current = JSON.stringify(flow);
            setHasUnsavedChanges(false);
            // Clear validation result since flow state is now "saved"
            clearValidateResult();

            setNeedsRepublish(true);
          }
        } catch (err: unknown) {
          const msg = getErrorMessage(err, "Failed to save flow.");
          if (
            msg.toLowerCase().includes("draft") ||
            msg.toLowerCase().includes("updated")
          ) {
            toast.error(
              "Only draft flows can be updated. Duplicate this flow to edit.",
            );
          } else {
            toast.error(msg);
          }
        }
      } else {
        setShowSaveDialog(false);
      }
    }, [
      flowName,
      flow,
      flow.metadata,
      setFlowMetadata,
      getBackendPayload,
      companyId,
      flowId,
      createFlow,
      updateFlow,
      clearError,
      clearValidateResult,
      onFlowCreated,
    ]);

    const handleValidate = useCallback(async () => {
      if (!flowId || !companyId) {
        return;
      }
      try {
        clearError();
        clearValidateResult();
        const result = await validateFlow(flowId, companyId);
        if (result.valid) {
          toast.success("Flow is valid ✓");
        } else {
          toast.error("Flow validation failed.");
        }
      } catch {
        toast.error("Validation failed.");
      }
    }, [flowId, companyId, validateFlow, clearError, clearValidateResult]);

    const handlePublish = useCallback(async () => {
      if (!flowId || !companyId) {
        return;
      }
      if (!validateResult?.valid) {
        toast.error("Validate the flow first before publishing.");
        return;
      }
      try {
        clearError();
        await publishFlow(flowId, companyId);
        toast.success("Flow is now live.");
        setNeedsRepublish(false);
      } catch {
        toast.error(apiError || "Failed to publish flow.");
      }
    }, [
      flowId,
      companyId,
      publishFlow,
      validateResult?.valid,
      clearError,
      apiError,
    ]);

    useEffect(() => {
  if (isFlowPublished) {
    setNeedsRepublish(true);
  }
}, [flow]);

    const handleCopyPayload = useCallback(async () => {
      const ok = await copyToClipboard(previewPayload);
      if (ok) {
        setCopied(true);
        toast.success("Payload copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      } else {
        toast.error("Failed to copy payload");
      }
    }, [previewPayload]);

    // Layout positions for template: nodeId -> { x, y }. Use this in SUPPORT_SALES_LAYOUT so all users see the same layout.
    const positionLayoutJson = Object.fromEntries(
      flow.nodes.map((n) => [
        n.id,
        { x: Math.round(n.position.x), y: Math.round(n.position.y) },
      ]),
    );
    const positionLayoutStr = JSON.stringify(positionLayoutJson, null, 2);

    const handleCopyPositionLayout = useCallback(async () => {
      const ok = await copyToClipboard(positionLayoutStr);
      if (ok) {
        toast.success("Node positions copied to clipboard");
      } else {
        toast.error("Unable to copy node positions to clipboard");
      }
    }, [positionLayoutStr]);

    // Check if flow is published/live
    const currentFlow = flowId ? getFlowById(flowId) : null;
    const isFlowPublished = currentFlow?.status === "published";

    const getMaxDepth = (properties?: Record<string, any>): number => {
      if (!properties) return 0;

      let max = 0;

      for (const param of Object.values(properties)) {
        if (param.type === "object" && param.properties) {
          const depth = 1 + getMaxDepth(param.properties);
          max = Math.max(max, depth);
        }
      }

      return max;
    };

    const getWidth = (depth: number) => 20 + depth * 4;

    const selectedNode = flow.nodes.find((n) => n.id === selectedNodeId);

    const depth = getMaxDepth(
      (selectedNode?.data.toolParameters as any)?.properties,
    );

    return (
      <ReactFlowProvider>
        <TooltipProvider>
          <div className="flex flex-col h-full w-full bg-background">
            {/* Header */}
            <div className="flex items-center justify-between p-2 md:p-4 border-b border-border bg-card md:gap-2">
              <div className="flex items-center gap-1 md:gap-3 flex-1 min-w-0">
                {/* Node Palette – sheet only on small screens; sidebar shows on md+ */}
                <Sheet open={showLeftSidebar} onOpenChange={setShowLeftSidebar}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-shrink-0 md:hidden"
                      aria-label="Open node palette"
                    >
                      <Menu className="size-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-64 p-0 flex flex-col">
                    <SheetHeader className="p-4 border-b border-border">
                      <SheetTitle>Node Palette</SheetTitle>
                    </SheetHeader>
                    <NodePalette />
                  </SheetContent>
                </Sheet>

                <h2 className="hidden sm:block text-sm md:text-xl min-w-52 font-medium truncate">
                  Conversation Name:
                </h2>
                <Input
                  showLeftBorder ={false}
                  value={flowName}
                  onChange={(e) => setFlowName(e.target.value)}
                  placeholder="Flow name"
                  className=" max-w-xs text-sm flex-shrink-0"
                />
              </div>

              <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                {false && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPositionConsole(true)}
                        className="gap-1"
                        aria-label="Position console"
                      >
                        <Terminal className="h-4 w-4" />
                        <span className="hidden md:inline">Positions</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Node positions for template layout
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* Global Settings Button */}
                {false && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowGlobalSettings(true)}
                        className="gap-1"
                      >
                        <Settings className="h-4 w-4" />
                        <span className="hidden md:inline">Settings</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Global Settings & Variables</TooltipContent>
                  </Tooltip>
                )}

                {/* Mobile Config Button */}
                <Sheet
                  open={showRightSidebar}
                  onOpenChange={setShowRightSidebar}
                >
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="lg:hidden">
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80 p-0 flex flex-col gap-0">
                    <SheetHeader className="p-4 border-b border-border">
                      <SheetTitle>Node Configuration</SheetTitle>
                    </SheetHeader>
                    <NodeConfigPanel selectedNodeId={selectedNodeId} />
                  </SheetContent>
                </Sheet>

                {flowId && companyId && !hasUnsavedChanges && (
                  <div className="flex items-center gap-1 md:gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant={
                            validateResult?.valid ? "default" : "outline"
                          }
                          onClick={handleValidate}
                          className={`gap-1 ${validateResult?.valid ? "bg-success hover:bg-success/80" : ""}`}
                          aria-label="Validate flow"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="hidden md:inline">
                            {validateResult?.valid ? "Validated" : "Validate"}
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {validateResult?.valid
                          ? "Flow is valid and ready to publish"
                          : "Validate flow before publishing"}
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant={
                            validateResult?.valid ? "default" : "outline"
                          }
                          onClick={handlePublish}
                          disabled={!validateResult?.valid || isPublishing || (isFlowPublished && !needsRepublish)}
                          className={`gap-1 ${validateResult?.valid ? "" : ""}`}
                          aria-label="Publish flow"
                          showWave waveColor={theme?.primaryColor}
                        >
                          {isPublishing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Radio className="h-4 w-4" />
                          )}
                          <span className="hidden md:inline">  
                            {isFlowPublished && !needsRepublish ? "Published" : "Publish"}
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {validateResult?.valid
                          ? "Make this flow live for calls"
                          : "Validate the flow first"}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                )}
                {hasUnsavedChanges && (
                  <Button
                    size="sm"
                    onClick={() => setShowSaveDialog(true)}
                    disabled={isSaving}
                    className="gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3"
                    showWave waveColor={theme?.primaryColor}
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">Save</span>
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onClose}
                  className="gap-1 md:gap-2 flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Main Content Area – Node Palette visible on desktop/laptop; canvas + config */}
            <div className="flex flex-1 overflow-hidden gap-0">
              {/* Node Palette – visible on md+ (desktop/laptop); Menu sheet for small screens only */}
              <aside
                className="hidden md:flex md:w-52 lg:w-52 xl:w-56 border-r border-border overflow-hidden flex-col shrink-0 h-full"
                aria-label="Node palette"
              >
                <NodePalette />
              </aside>

              <div className="flex-1 overflow-hidden min-w-0">
                <FlowCanvas />
              </div>

              {/* Right Sidebar - Desktop Only */}
              <div 
                  className="hidden lg:flex border-l border-border flex-col transition-all duration-200 overflow-x-auto min-w-0"
                  style={{ width: `${getWidth(depth)}rem` }}
                >
                  <NodeConfigPanel selectedNodeId={selectedNodeId} />
              </div>
            </div>

            {/* Global Settings Panel */}
            <GlobalSettingsPanel
              isOpen={showGlobalSettings}
              onClose={() => setShowGlobalSettings(false)}
            />

            {/* Position console – node positions for template layout */}
            <Sheet
              open={showPositionConsole}
              onOpenChange={setShowPositionConsole}
            >
              <SheetContent
                side="bottom"
                className="h-[50vh] flex flex-col p-0"
              >
                <SheetHeader className="p-4 border-b border-border shrink-0">
                  <SheetTitle>Position console</SheetTitle>
                  <p className="text-sm text-muted-foreground">
                    Node positions in the builder. Copy the JSON below and share
                    it so it can be added to the template layout
                    (SUPPORT_SALES_LAYOUT); all users will then see nodes where
                    you placed them.
                  </p>
                </SheetHeader>
                <div className="flex-1 overflow-auto p-4 space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">
                      Table (id, type, x, y)
                    </p>
                    <div className="border border-border rounded-md overflow-hidden">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-muted/50 border-b border-border">
                            <th className="text-left p-2 font-medium">
                              Node ID
                            </th>
                            <th className="text-left p-2 font-medium">Type</th>
                            <th className="text-right p-2 font-medium">X</th>
                            <th className="text-right p-2 font-medium">Y</th>
                          </tr>
                        </thead>
                        <tbody>
                          {flow.nodes.map((n) => (
                            <tr
                              key={n.id}
                              className="border-b border-border/50 last:border-0"
                            >
                              <td className="p-2 font-mono">{n.id}</td>
                              <td className="p-2">{n.type}</td>
                              <td className="p-2 text-right">
                                {Math.round(n.position.x)}
                              </td>
                              <td className="p-2 text-right">
                                {Math.round(n.position.y)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">
                      Layout JSON (for SUPPORT_SALES_LAYOUT)
                    </p>
                    <pre className="text-xs bg-muted/50 rounded-md p-3 overflow-x-auto overflow-y-auto max-h-40 border border-border font-mono whitespace-pre">
                      {positionLayoutStr}
                    </pre>
                    <div className="flex gap-2 mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCopyPositionLayout}
                        className="gap-1"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        Copy layout JSON
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {apiError && (
              <div className="mx-4 rounded-md bg-destructive/10 text-destructive px-3 py-2 text-sm">
                {apiError}
              </div>
            )}

            {/* Save Dialog */}
            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
              <DialogContent className="w-[95vw] md:w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle>Save Flow</DialogTitle>
                  <DialogDescription>
                    {flowId
                      ? "Save changes to the draft flow."
                      : "Create a new draft flow. You can publish it later."}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 overflow-y-auto flex-1">
                  <div>
                    <p className="text-sm font-medium mb-2">Flow Name</p>
                    <Input
                      value={flowName}
                      onChange={(e) => setFlowName(e.target.value)}
                      placeholder="Flow name"
                      className="text-sm"
                    />
                  </div>

                  {process.env.NODE_ENV === "development" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Payload Preview</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleCopyPayload}
                          className="gap-1.5"
                        >
                          {copied ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              Copy JSON
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        This is the exact JSON that will be sent to the backend
                      </p>
                      <div className="border border-border rounded-md overflow-hidden bg-muted/30">
                        <pre className="text-xs p-4 overflow-x-auto overflow-y-auto max-h-96 font-mono whitespace-pre">
                          {previewPayload}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setShowSaveDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveFlow}
                    className="flex-1"
                    disabled={isSaving}
                    showWave waveColor={theme?.primaryColor}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving…
                      </>
                    ) : (
                      "Confirm Save"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </TooltipProvider>
      </ReactFlowProvider>
    );
  },
);

FlowBuilder.displayName = "FlowBuilder";
