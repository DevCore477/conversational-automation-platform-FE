"use client";

import { FileText } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { withCompanyScope } from "@/lib/company-scope";
import { FLOW_TEMPLATES } from "@/lib/flows/templates";
import { useThemeStore } from "@/store/theme.store";

type TemplatesSectionProps = {
  companyId?: string;
};

export function TemplatesSection({ companyId }: TemplatesSectionProps) {
  const { theme } = useThemeStore();  
  return (
    <div className="border rounded-2xl  bg-surface-soft/2 p-4 lg:p-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Start from a template
      </h3>
      <div className="grid gap-4 lg:grid-cols-2">
        {FLOW_TEMPLATES.map((t) => (
          <Card key={t.id} className="border-primary/20 bg-sidebar">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                {t.name}
              </CardTitle>
              {t.description && (
                <CardDescription>{t.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <Button 
               showWave
               waveColor={theme?.primaryColor}
               size="sm">
                <Link
                  href={withCompanyScope(
                    `/conversation-flow/${t.id}`,
                    companyId,
                  )}
                >
                  Open in builder
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
