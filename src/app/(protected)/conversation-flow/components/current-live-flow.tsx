"use client";

import { format } from "date-fns";
import { Radio, MoreHorizontal, Archive, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { withCompanyScope } from "@/lib/company-scope";
import { type ConversationFlow } from "@/types/flow.types";

interface CurrentLiveFlowProps {
  flow: ConversationFlow | null;
  companyId: string | undefined;
  onArchive: (flowId: string) => void;
  onDeleteClick: (flow: ConversationFlow) => void;
  deletingFlowId: string | null;
  archivingFlowId: string | null;
}

export function CurrentLiveFlow({
  flow,
  companyId,
  onArchive,
  onDeleteClick,
  deletingFlowId,
  archivingFlowId,
}: CurrentLiveFlowProps) {
  if (!companyId) {
    return null;
  }

  if (!flow) {
    return (
      <Card className="border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10">
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground">
            No flow published yet. Create and publish a flow to go live.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Current live flow
      </h3>
      <Card className="border-primary/30 bg-primary/5 dark:bg-primary/10">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Radio className="h-4 w-4 text-primary" />
            {flow.name}
            <Badge
              variant="default"
              className="bg-green-600 hover:bg-green-700"
            >
              Live
            </Badge>
          </CardTitle>
          <CardDescription>
            Version {flow.version}
            {flow.publishedAt &&
              ` · Published ${format(new Date(flow.publishedAt), "MMM d, yyyy HH:mm")}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 justify-between items-center">
            <Button asChild variant="outline" size="sm">
              <Link
                href={withCompanyScope(
                  `/conversation-flow/${flow.id}`,
                  companyId,
                )}
              >
                View flow
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  disabled={
                    deletingFlowId === flow.id || archivingFlowId === flow.id
                  }
                >
                  <span className="sr-only">Open menu</span>
                  {deletingFlowId === flow.id || archivingFlowId === flow.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MoreHorizontal className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onArchive(flow.id)}
                  disabled={archivingFlowId === flow.id}
                >
                  <Archive className="h-4 w-4" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDeleteClick(flow)}
                  disabled={deletingFlowId === flow.id}
                  variant="destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
