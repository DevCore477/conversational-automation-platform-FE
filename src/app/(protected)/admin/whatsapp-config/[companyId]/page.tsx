"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Building2, Save, Loader2, Power, PowerOff } from "lucide-react";

import { RBACGuard } from "@/components/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useCompanyStore } from "@/store/company.store";
import { useThemeStore } from "@/store/theme.store";
import { whatsappService } from "@/service/whatsapp.service";
import { getErrorMessage } from "@/lib/get-error-message";
import type { CompanyWhatsAppConfig } from "@/types/whatsapp.types";

export default function AdminCompanyWhatsAppConfigPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.companyId as string;
  const { allCompanies, fetchAllCompanies } = useCompanyStore();
  const { theme } = useThemeStore();

  const company = allCompanies.find((c) => c.id === companyId);

  const [config, setConfig] = useState<CompanyWhatsAppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);

  const [isActive, setIsActive] = useState(false);
  const [wabaId, setWabaId] = useState("");
  const [phoneNumberId, setPhoneNumberId] = useState("");
  const [businessPhoneNumber, setBusinessPhoneNumber] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [appSecret, setAppSecret] = useState("");
  const [webhookVerifyToken, setWebhookVerifyToken] = useState("");
  const [apiVersion, setApiVersion] = useState("v25.0");

  const fetchConfig = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const data = await whatsappService.getConfig(companyId);
      setConfig(data);
      setIsActive(data.isActive);
      setWabaId(data.wabaId || "");
      setPhoneNumberId(data.phoneNumberId || "");
      setBusinessPhoneNumber(data.businessPhoneNumber || "");
      setAccessToken("");
      setAppSecret("");
      setWebhookVerifyToken("");
      setApiVersion(data.apiVersion || "v25.0");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load configuration"));
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    if (allCompanies.length === 0) {
      void fetchAllCompanies();
    }
  }, [fetchAllCompanies, allCompanies.length]);

  useEffect(() => {
    void fetchConfig();
  }, [fetchConfig]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        phoneNumberId,
        apiVersion,
      };
      if (wabaId) payload.wabaId = wabaId;
      if (businessPhoneNumber) payload.businessPhoneNumber = businessPhoneNumber;
      if (accessToken) payload.accessToken = accessToken;
      if (appSecret) payload.appSecret = appSecret;
      if (webhookVerifyToken) payload.webhookVerifyToken = webhookVerifyToken;

      const updated = await whatsappService.updateConfig(companyId, payload as any);
      setConfig(updated);
      setIsActive(updated.isActive);
      setAccessToken("");
      setAppSecret("");
      setWebhookVerifyToken("");
      toast.success("Configuration saved successfully");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save configuration"));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async () => {
    setToggling(true);
    try {
      const updated = await whatsappService.toggleWhatsApp(companyId, !isActive);
      setIsActive(updated.isActive);
      setConfig(updated);
      toast.success(`WhatsApp ${updated.isActive ? "enabled" : "disabled"} for this company`);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to toggle WhatsApp status"));
    } finally {
      setToggling(false);
    }
  };

  const handleCompanyChange = (newCompanyId: string) => {
    router.push(`/admin/whatsapp-config/${newCompanyId}`);
  };

  if (loading) {
    return (
      <main className="flex min-h-0 flex-1 items-center justify-center p-6">
        <Spinner />
      </main>
    );
  }

  return (
    <RBACGuard requireAdmin redirectTo="/dashboard">
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <div className="bg-surface-soft-light p-[5px] border rounded-2xl">
          <Card className="grid grid-cols-1 md:grid-cols-7 justify-between items-center border-none">
            <CardHeader className="pb- bg-sidebar md:col-span-4">
              <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                <Building2 className="h-4 w-4" />
                Select Company to Manage
              </CardTitle>
              <CardDescription className="text-sm">
                Choose a company to view and edit its settings
              </CardDescription>
            </CardHeader>
            <CardContent className="md:col-span-3 flex items-center gap-3">
              <Select value={companyId || ""} onValueChange={handleCompanyChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {allCompanies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        <div className="bg-surface-soft-light p-[5px] border rounded-2xl">
          <Card className="border-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-text-dark dark:text-accent-foreground">
                  Meta Account Configuration
                </CardTitle>
                {config && (
                  <Badge
                    className={isActive
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }
                  >
                    {isActive ? "Active" : "Inactive"}
                  </Badge>
                )}
              </div>
              <CardDescription className="text-sm">
                Configure the Meta/WhatsApp Business API credentials for this company
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="wabaId" className="text-sm font-medium">WhatsApp Business Account ID</Label>
                  <Input
                    id="wabaId"
                    value={wabaId}
                    onChange={(e) => setWabaId(e.target.value)}
                    placeholder="Enter WABA ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumberId" className="text-sm font-medium">Phone Number ID</Label>
                  <Input
                    id="phoneNumberId"
                    value={phoneNumberId}
                    onChange={(e) => setPhoneNumberId(e.target.value)}
                    placeholder="Enter Phone Number ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessPhoneNumber" className="text-sm font-medium">Business Phone Number</Label>
                  <Input
                    id="businessPhoneNumber"
                    value={businessPhoneNumber}
                    onChange={(e) => setBusinessPhoneNumber(e.target.value)}
                    placeholder="e.g. 15551234567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiVersion" className="text-sm font-medium">API Version</Label>
                  <Input
                    id="apiVersion"
                    value={apiVersion}
                    onChange={(e) => setApiVersion(e.target.value)}
                    placeholder="v25.0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accessToken" className="text-sm font-medium">Access Token</Label>
                  <Input
                    id="accessToken"
                    type="password"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    placeholder={config?.accessTokenMasked ? "Leave blank to keep current" : "Enter access token"}
                  />
                  {config?.accessTokenMasked && (
                    <p className="text-xs text-muted-foreground pt-1">Current: {config.accessTokenMasked}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appSecret" className="text-sm font-medium">App Secret</Label>
                  <Input
                    id="appSecret"
                    type="password"
                    value={appSecret}
                    onChange={(e) => setAppSecret(e.target.value)}
                    placeholder="Enter app secret"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookVerifyToken" className="text-sm font-medium">Webhook Verify Token</Label>
                  <Input
                    id="webhookVerifyToken"
                    value={webhookVerifyToken}
                    onChange={(e) => setWebhookVerifyToken(e.target.value)}
                    placeholder="Enter webhook verify token"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 mt-8 pt-6 border-t">
                <Button onClick={handleSave} disabled={saving} showWave waveColor={theme?.primaryColor} className="rounded-full">
                  Save Configuration
                </Button>
                <Button
                  variant={isActive ? "destructive" : "default"}
                  size="sm"
                  onClick={handleToggleActive}
                  disabled={toggling}
                  className="rounded-full"
                >
                  {isActive ? "Disable" : "Enable"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </RBACGuard>
  );
}
