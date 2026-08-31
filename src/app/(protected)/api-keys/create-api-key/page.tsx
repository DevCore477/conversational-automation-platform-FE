"use client";
import React from 'react'

import { zodResolver } from "@hookform/resolvers/zod";
import { Key, Copy, Check, AlertCircle, ChevronsLeft } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { copyToClipboard } from "@/lib/clipboard";
import { getErrorMessage } from "@/lib/get-error-message";
import { type CreateApiKeyDto, type ApiKeyPermission,} from "@/types/api-key.types";
import { createApiKey } from "../actions";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/store/theme.store";

/** Split comma-separated lists on submit; keep raw string in the UI so commas while typing are not stripped. */
function parseCommaSeparatedList(raw: string): string[] {
  return raw.split(",").map((v) => v.trim()).filter(Boolean);
}

const createApiKeySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  permissions: z.array(z.string()).min(1, "Select at least one permission"),
  restrictions: z.object({
    ipWhitelist: z.array(z.string()),
    rateLimit: z.number(),
    allowedOrigins: z.array(z.string()),
  }),
  expiresAt: z.string().optional(),
});

interface CreateApiKeyFormValues {
  name: string;
  description?: string;
  permissions: string[];
  restrictions: {
    ipWhitelist: string[];
    rateLimit: number;
    allowedOrigins: string[];
  };
  expiresAt?: string;
}

const PERMISSION_GROUPS: {
  title: string;
  permissions: {
    value: ApiKeyPermission;
    label: string;
    description: string;
  }[];
}[] = [
  {
    title: "Calls",
    permissions: [
      { value: "calls.read", label: "Read", description: "View call data" },
      { value: "calls.create", label: "Create", description: "Make new calls" },
      {
        value: "calls.update",
        label: "Update",
        description: "Modify call details",
      },
      { value: "calls.delete", label: "Delete", description: "Remove calls" },
    ],
  },
  {
    title: "Scripts",
    permissions: [
      { value: "scripts.read", label: "Read", description: "View scripts" },
      {
        value: "scripts.create",
        label: "Create",
        description: "Add new scripts",
      },
      {
        value: "scripts.update",
        label: "Update",
        description: "Modify scripts",
      },
      {
        value: "scripts.delete",
        label: "Delete",
        description: "Remove scripts",
      },
    ],
  },
  {
    title: "Flows",
    permissions: [
      { value: "flows.read", label: "Read", description: "View flows" },
      {
        value: "flows.create",
        label: "Create",
        description: "Create new flows",
      },
      { value: "flows.update", label: "Update", description: "Modify flows" },
      { value: "flows.delete", label: "Delete", description: "Remove flows" },
    ],
  },
  {
    title: "Agents",
    permissions: [
      { value: "agents.read", label: "Read", description: "View agents" },
      {
        value: "agents.create",
        label: "Create",
        description: "Create new agents",
      },
      { value: "agents.update", label: "Update", description: "Modify agents" },
      { value: "agents.delete", label: "Delete", description: "Remove agents" },
    ],
  },
  {
    title: "Webhooks",
    permissions: [
      { value: "webhooks.read", label: "Read", description: "View webhooks" },
      {
        value: "webhooks.create",
        label: "Create",
        description: "Create webhooks",
      },
      {
        value: "webhooks.update",
        label: "Update",
        description: "Modify webhooks",
      },
      {
        value: "webhooks.delete",
        label: "Delete",
        description: "Remove webhooks",
      },
    ],
  },
  {
    title: "API Keys",
    permissions: [
      { value: "apiKeys.read", label: "Read", description: "View API keys" },
      {
        value: "apiKeys.create",
        label: "Create",
        description: "Create API keys",
      },
      {
        value: "apiKeys.update",
        label: "Update",
        description: "Modify API keys",
      },
      {
        value: "apiKeys.delete",
        label: "Delete",
        description: "Remove API keys",
      },
    ],
  },
  {
    title: "Companies",
    permissions: [
      { value: "companies.read", label: "Read", description: "View companies" },
      {
        value: "companies.create",
        label: "Create",
        description: "Create companies",
      },
      {
        value: "companies.update",
        label: "Update",
        description: "Modify companies",
      },
    ],
  },
  {
    title: "Platform",
    permissions: [
      { value: "platform.read", label: "Read", description: "View platform" },
      {
        value: "platform.update",
        label: "Update",
        description: "Modify platform",
      },
    ],
  },
  {
    title: "Analytics",
    permissions: [
      { value: "analytics.read", label: "Read", description: "View analytics" },
    ],
  },
];

const ALL_PERMISSIONS: ApiKeyPermission[] = [
  "calls.read",
  "calls.create",
  "calls.update",
  "calls.delete",
  "scripts.read",
  "scripts.create",
  "scripts.update",
  "scripts.delete",
  "flows.read",
  "flows.create",
  "flows.update",
  "flows.delete",
  "agents.read",
  "agents.create",
  "agents.update",
  "agents.delete",
  "analytics.read",
  "webhooks.read",
  "webhooks.create",
  "webhooks.update",
  "webhooks.delete",
  "companies.read",
  "companies.create",
  "companies.update",
  "platform.read",
  "platform.update",
  "apiKeys.read",
  "apiKeys.create",
  "apiKeys.update",
  "apiKeys.delete",
];

export default function CreateApiKeyPage() {

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastCreatedKey, setLastCreatedKey] = useState<string | null>(null);
  /** Controlled as plain text so users can type commas between entries without losing the delimiter. */
  const [ipWhitelistInput, setIpWhitelistInput] = useState("");
  const [allowedOriginsInput, setAllowedOriginsInput] = useState("");
  const { theme, fetchTheme } = useThemeStore();

  const form = useForm<CreateApiKeyFormValues>({
    resolver: zodResolver(createApiKeySchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
      restrictions: {
        ipWhitelist: [],
        rateLimit: 0,
        allowedOrigins: [],
      },
      expiresAt: "",
    },
  });

  const handleSubmit = async (data: CreateApiKeyFormValues) => {
    try {
      setIsSubmitting(true);
      const restrictions = data.restrictions
        ? {
            ipWhitelist: parseCommaSeparatedList(ipWhitelistInput),
            rateLimit: data.restrictions.rateLimit || 0,
            allowedOrigins: parseCommaSeparatedList(allowedOriginsInput),
          }
        : undefined;

      const payload: CreateApiKeyDto = {
        name: data.name,
        description: data.description,
        permissions: data.permissions as ApiKeyPermission[],
        restrictions,
        expiresAt: data.expiresAt || undefined,
      };

      const result = await createApiKey(payload);

      if (result.success && result.data) {
        setLastCreatedKey(result.data.plainKey);
        setShowKey(true);
        toast.success("API key created successfully");
        setIpWhitelistInput("");
        setAllowedOriginsInput("");
        form.reset();
      } else {
        toast.error(result.error || "Failed to create API key");
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to create API key"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyKey = async () => {
    if (!lastCreatedKey) {
      return;
    }

    const ok = await copyToClipboard(lastCreatedKey);
    if (ok) {
      setCopied(true);
      toast.success("API key copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Unable to copy API key to clipboard");
    }
  };

  const handleCancel = () => {
    router.push("/api-keys");
  };

  if (showKey && lastCreatedKey) {
    return (
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <PageHeader
          title="API Key Created"
          description="Your new API key has been generated"
          action={
            <Button onClick={handleCancel} variant="ghost" size="sm" className="gap-2 text-[#666666] bg-[#F3F5F7] py-6 !px-4 rounded-full">
              <ChevronsLeft className="size-5"/>
              Back
            </Button>
          }
        />
        <Card>
          <CardContent className="pt-6">
            <Alert
              variant="default"
              className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800 mb-6"
            >
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
              <AlertDescription className="text-yellow-800 dark:text-yellow-300">
                Make sure to copy your API key now. You won&apos;t be able to see
                it again!
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="flex items-center gap-2 p-4 bg-muted rounded-md font-mono text-sm break-all">
                <code className="flex-1">{lastCreatedKey}</code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopyKey}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <Button onClick={handleCancel}>Done</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
     <main className="flex-1 space-y-6 p-4 lg:p-6">
      <PageHeader
        title="Create API Key"
        description="Generate a new API key for your company. Select the permissions this key should have."
        action={
          <Button onClick={handleCancel} variant="outline" size="sm" className="rounded-full">
            <ChevronsLeft className="size-5"/>
            Back
          </Button>
        }
      />
      <Card className="pt-6 border rounded-2xl bg-surface-soft-light p-[5px]">
        <CardContent className="bg-sidebar pt-6 pb-8 rounded-2xl px-3">
          <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                        <FormLabel>Name</FormLabel>
                        <FormDescription>(A descriptive name for this API key)</FormDescription>
                      </div>
                      <FormControl>
                        <Input placeholder="Production API Key" {...field} />
                      </FormControl>                        
                      <FormMessage />
                    </FormItem>
                  )}
                />          
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Used for production server..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="restrictions"
                  render={() => (
                    <FormItem>
                      <div className="mb-6">
                      <FormLabel>Restrictions (Optional)</FormLabel>
                      <FormDescription>Add security restrictions for this API key</FormDescription>
                      </div>
                      <div className="space-y-8">
                        <div className="grid gap-2">
                          <Label htmlFor="api-key-ip-whitelist" className="text-sm">IP Whitelist</Label>
                          <Input
                            id="api-key-ip-whitelist"
                            placeholder="Enter IPs separated by commas"
                            value={ipWhitelistInput}
                            onChange={(e) => setIpWhitelistInput(e.target.value)}
                            autoComplete="off"
                          />
                          <FormDescription>(e.g., 192.168.1.1, 10.0.0.1)</FormDescription>
                        </div>   
                        <div className="grid gap-2">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <Label
                              htmlFor="api-key-allowed-origins"
                              className="text-sm"
                            >
                              Allowed Origins (CORS)
                            </Label>
                            <p className="text-xs text-muted-foreground">(Comma-separated origins for CORS)</p>
                          </div>                                     
                          <Input
                            id="api-key-allowed-origins"
                            placeholder="Enter origins separated by commas"
                            value={allowedOriginsInput}
                            onChange={(e) =>
                              setAllowedOriginsInput(e.target.value)
                            }
                            autoComplete="off"
                          />       
                          <FormDescription>(e.g., https://example.com)</FormDescription>                             
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expiresAt"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <FormLabel>Expiration Date (Optional)</FormLabel>
                        <FormDescription>(Leave empty for no expiration)</FormDescription>
                      </div>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>                                            
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="bg-surface-soft-light p-[5px] border rounded-xl">
                <FormField
                  control={form.control}
                  name="permissions"
                  render={({ field }) => {
                  const allSelected = ALL_PERMISSIONS.every((p) => field.value?.includes(p),);
                  const someSelected = ALL_PERMISSIONS.some((p) => field.value?.includes(p),);
                        
                  const getGroupSelected = (
                    permissions: { value: ApiKeyPermission }[],
                  ) => permissions.every((p) => field.value?.includes(p.value));
                        
                  const handleSelectAll = (checked: boolean) => {
                    if (checked) {
                      field.onChange([...ALL_PERMISSIONS]);
                    } else {
                      field.onChange([]);
                    }
                  };
                        
                  const handleGroupChange = (
                    groupPermissions: { value: ApiKeyPermission }[],
                    checked: boolean,
                  ) => {
                    const groupValues = groupPermissions.map((p) => p.value);
                    const currentValue = field.value || [];
                    if (checked) {
                      const newValues = [...new Set([...currentValue, ...groupValues]),];
                      field.onChange(newValues);
                    } else {
                      const newValues = currentValue.filter(
                        (v) => !groupValues.includes(v as ApiKeyPermission),
                      );
                      field.onChange(newValues);
                    }
                  };
                        
                  return (
                    <FormItem className='gap-1'>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 md:gap-6 bg-sidebar p-4 rounded-t-2xl">
                        <div className="">
                          <FormLabel className='text-lg'>Permissions</FormLabel>
                          <FormDescription> Select the permissions this API key should have </FormDescription>
                        </div>
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md mt-2">
                          <div className="space-y-1 leading-none">
                            <div className="flex items-center sm:justify-end gap-2">
                              <FormLabel className="font-medium">Select All</FormLabel>
                              <FormControl>
                                <Checkbox
                                  checked={allSelected}
                                  indeterminate={someSelected && !allSelected}
                                  onCheckedChange={handleSelectAll}
                                />
                              </FormControl>
                            </div>
                            <FormDescription> Grant access to all available resources </FormDescription>
                          </div>
                        </FormItem>
                      </div>
                      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-5 bg-sidebar p-2 sm:p-4 sm:pt-6 rounded-b-xl">
                        {PERMISSION_GROUPS.map((group) => (
                          <div key={group.title} className="rounded-md border bg-surface-soft/9">
                            <div className="flex flex-row items-center space-x-3 space-y-0 p-3 sm:p-4 ">
                              <FormControl>
                                <Checkbox
                                  checked={getGroupSelected(group.permissions)}
                                  onCheckedChange={(checked) =>
                                    handleGroupChange(group.permissions, !!checked, )
                                  }
                                />
                              </FormControl>
                              <FormLabel className="font-medium">{group.title}</FormLabel>
                            </div>
                            <div className="p-2 space-y-1">
                              {group.permissions.map((permission) => (
                                <FormField
                                  key={permission.value}
                                  control={form.control}
                                  name="permissions"
                                  render={() => (
                                    <FormItem className="flex flex-row items-start space-x-1 space-y-0 pl-2 xs:pl-4 sm:pl-8 py-1">
                                      <FormControl className='mt-[2px]'>
                                        <Checkbox
                                          checked={field.value?.includes( permission.value,)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([
                                                ...field.value,
                                                permission.value,
                                              ])
                                            : field.onChange(
                                              field.value?.filter((value) => value !== permission.value,),
                                            );
                                          }}
                                        />
                                      </FormControl>
                                      <div className="space-y-1 leading-none flex gap-2">
                                        <FormLabel className="text-sm font-normal">{permission.label}</FormLabel>
                                        <FormDescription className=" mt-[3px]">({permission.description})</FormDescription>
                                      </div>
                                    </FormItem>
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                  }}
                />
              </div>
            </div>
                                                          
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel} className='rounded-full'>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} 
                showWave waveColor={theme?.primaryColor} className='rounded-full'>
                {isSubmitting ? "Creating..." : "Create API Key"}
              </Button>
            </div>
          </form>
          </Form>
        </CardContent>
      </Card>
     </main>
  )
}

