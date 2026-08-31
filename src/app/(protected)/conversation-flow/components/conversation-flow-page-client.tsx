"use client";

import { Upload } from "lucide-react";
import { useCallback, useState, useEffect } from "react";
import { toast } from "sonner";

import { RBACGuard } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { withCompanyScope } from "@/lib/company-scope";
import { type ConversationFlow } from "@/types/flow.types";
import { type Company } from "@/types/company.types";

import {
  FlowList, TemplatesSection, CurrentLiveFlow, DeleteFlowDialog, UploadDialog,
} from ".";
import { deleteFlow, activateFlow, archiveFlow } from "../actions";
import { SuperAdminCompanyScopePicker } from "../../components/super-admin-company-scope";
import GifButton from "@/components/GifButton";

interface ConversationFlowPageClientProps {
  companyId: string;
  initialFlows: ConversationFlow[];
  initialPublishedFlow: ConversationFlow | null;
  company: Company | null;
}

export function ConversationFlowPageClient({
  companyId,
  initialFlows,
  initialPublishedFlow,
  company,
}: ConversationFlowPageClientProps) {
  const [flows, setFlows] = useState<ConversationFlow[]>(initialFlows);
  const [currentPublishedFlow, setCurrentPublishedFlow] =
    useState<ConversationFlow | null>(initialPublishedFlow);
  const [isLoading, setIsLoading] = useState(false);

  const [deletingFlowId, setDeletingFlowId] = useState<string | null>(null);
  const [activatingFlowId, setActivatingFlowId] = useState<string | null>(null);
  const [archivingFlowId, setArchivingFlowId] = useState<string | null>(null);
  const [selectedFlow, setSelectedFlow] = useState<ConversationFlow | null>(
    null,
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  useEffect(() => {
    setFlows(initialFlows);
    setCurrentPublishedFlow(initialPublishedFlow);
  }, [initialFlows, initialPublishedFlow]);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const { useConversationFlowStore } =
        await import("@/store/conversation-flow.store");
      await useConversationFlowStore.getState().fetchFlows(companyId);
      await useConversationFlowStore.getState().fetchPublished(companyId);
      const state = useConversationFlowStore.getState();
      setFlows(state.flows);
      setCurrentPublishedFlow(state.publishedFlows[0] || null);
    } catch (error) {
      console.error("Failed to refresh flows:", error);
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  const handleDelete = async () => {
    if (!selectedFlow) {
      return;
    }
    try {
      setDeletingFlowId(selectedFlow.id);
      const result = await deleteFlow(selectedFlow.id, companyId);
      if (result.success) {
        toast.success("Flow deleted successfully");
        // Update local state
        setFlows((prev) => prev.filter((f) => f.id !== selectedFlow.id));
        if (currentPublishedFlow?.id === selectedFlow.id) {
          setCurrentPublishedFlow(null);
        }
      } else {
        toast.error(result.error || "Failed to delete flow");
      }
      setShowDeleteDialog(false);
      setSelectedFlow(null);
    } catch (error) {
      toast.error("Failed to delete flow");
    } finally {
      setDeletingFlowId(null);
    }
  };

  const handleDeleteClick = (flow: ConversationFlow) => {
    setSelectedFlow(flow);
    setShowDeleteDialog(true);
  };

  const handleActivate = async (flowId: string) => {
    try {
      setActivatingFlowId(flowId);
      const result = await activateFlow(flowId, companyId);
      if (result.success) {
        toast.success("Flow activated successfully");
        loadData();
      } else {
        toast.error(result.error || "Failed to activate flow");
      }
    } catch (error) {
      toast.error("Failed to activate flow");
    } finally {
      setActivatingFlowId(null);
    }
  };

  const handleArchive = async (flowId: string) => {
    try {
      setArchivingFlowId(flowId);
      const result = await archiveFlow(flowId, companyId);
      if (result.success) {
        toast.success("Flow archived successfully");
        loadData();
      } else {
        toast.error(result.error || "Failed to archive flow");
      }
    } catch (error) {
      toast.error("Failed to archive flow");
    } finally {
      setArchivingFlowId(null);
    }
  };

  return (
    <RBACGuard route="/conversation-flow" redirectTo="/dashboard">
      <main className="flex-1 space-y-6 p-4 lg:p-6 ">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <PageHeader
            title="Conversation Flow"
            description="Design and manage conversation flows for intelligent interactions"
          />
          <div className="flex flex-col xs:flex-row items-end xs:items-center xs:justify-end gap-2">
            {/* <Button variant="outline" size="lg" className="rounded-full py-5 px-16" onClick={() => setShowUploadDialog(true)}>
              <Upload className="h-4 w-4" />
              Upload JSON
            </Button> */}
            <GifButton
              label="Upload JSON"
              icon={<Upload className="size-4 lg:size-5" />}
              className="w-full max-w-36 md:max-w-40 lg:min-w-44 lg:max-w-44"
              onClick={() => setShowUploadDialog(true)} 
            />
            <GifButton
              label="Create Flow"
              className="w-full max-w-36 md:max-w-40 lg:max-w-44"
              href={withCompanyScope("/conversation-flow/new", companyId)}
            />
          </div>
        </div>

        {/* Super Admin Company Scope Picker */}
        <SuperAdminCompanyScopePicker
          scopePath="/conversation-flow"
          title="Select a Company"
          description="Choose which company's scripts to view or edit."
        />

        {/* Templates section */}
        <TemplatesSection companyId={companyId} />

        {/* Flows list */}
        <FlowList
          flows={flows}
          isLoading={isLoading}
          isCompanyLoading={false}
          companyId={companyId}
          onRefresh={loadData}
          onDeleteClick={handleDeleteClick}
          onActivate={handleActivate}
          onArchive={handleArchive}
          deletingFlowId={deletingFlowId}
          activatingFlowId={activatingFlowId}
          archivingFlowId={archivingFlowId}
        />

        {/* Delete dialog */}
        <DeleteFlowDialog
          flow={selectedFlow}
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={handleDelete}
        />

        {/* Upload dialog */}
        <UploadDialog
          open={showUploadDialog}
          onOpenChange={setShowUploadDialog}
          companyId={companyId}
          onSuccess={loadData}
        />
      </main>
    </RBACGuard>
  );
}
