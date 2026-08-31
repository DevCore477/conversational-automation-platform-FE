"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Key, Copy, Check, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { copyToClipboard } from "@/lib/clipboard";
import { getErrorMessage } from "@/lib/get-error-message";
import {
  type CreateApiKeyDto,
  type ApiKeyPermission,
} from "@/types/api-key.types";
import { createApiKey } from "../actions";

/** Split comma-separated lists on submit; keep raw string in the UI so commas while typing are not stripped. */
function parseCommaSeparatedList(raw: string): string[] {
  return raw
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
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

interface CreateApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
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
    title: "Analytics",
    permissions: [
      { value: "analytics.read", label: "Read", description: "View analytics" },
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

export function CreateApiKeyDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateApiKeyDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastCreatedKey, setLastCreatedKey] = useState<string | null>(null);
  /** Controlled as plain text so users can type commas between entries without losing the delimiter. */
  const [ipWhitelistInput, setIpWhitelistInput] = useState("");
  const [allowedOriginsInput, setAllowedOriginsInput] = useState("");

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

  useEffect(() => {
    if (!open) {
      setIpWhitelistInput("");
      setAllowedOriginsInput("");
    }
  }, [open]);

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
        onSuccess?.();
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

  const handleClose = () => {
    setShowKey(false);
    setLastCreatedKey(null);
    setCopied(false);
    setIpWhitelistInput("");
    setAllowedOriginsInput("");
    form.reset();
    onOpenChange(false);
  };

  if (showKey && lastCreatedKey) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Your API Key
            </DialogTitle>
            <DialogDescription>
              Save this key securely. You won&apos;t be able to see it again!
            </DialogDescription>
          </DialogHeader>

          <Alert
            variant="default"
            className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800"
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

          <div className="flex justify-end pt-4">
            <Button onClick={handleClose}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create API Key</DialogTitle>
          <DialogDescription>
            Generate a new API key for your company. Select the permissions this
            key should have.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Production API Key" {...field} />
                  </FormControl>
                  <FormDescription>
                    A descriptive name for this API key
                  </FormDescription>
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
              name="permissions"
              render={({ field }) => {
                const allSelected = ALL_PERMISSIONS.every((p) =>
                  field.value?.includes(p),
                );
                const someSelected = ALL_PERMISSIONS.some((p) =>
                  field.value?.includes(p),
                );

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
                    const newValues = [
                      ...new Set([...currentValue, ...groupValues]),
                    ];
                    field.onChange(newValues);
                  } else {
                    const newValues = currentValue.filter(
                      (v) => !groupValues.includes(v as ApiKeyPermission),
                    );
                    field.onChange(newValues);
                  }
                };

                return (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Permissions*</FormLabel>
                      <FormDescription>
                        Select the permissions this API key should have
                      </FormDescription>
                    </div>
                    <div className="space-y-4">
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 bg-muted/50">
                        <FormControl>
                          <Checkbox
                            checked={allSelected}
                            indeterminate={someSelected && !allSelected}
                            onCheckedChange={handleSelectAll}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-medium">
                            Select All Permissions
                          </FormLabel>
                          <FormDescription className="text-xs">
                            Grant access to all available resources
                          </FormDescription>
                        </div>
                      </FormItem>

                      {PERMISSION_GROUPS.map((group) => (
                        <div key={group.title} className="rounded-md border">
                          <div className="flex flex-row items-center space-x-3 space-y-0 p-3 bg-muted/30 border-b">
                            <FormControl>
                              <Checkbox
                                checked={getGroupSelected(group.permissions)}
                                onCheckedChange={(checked) =>
                                  handleGroupChange(
                                    group.permissions,
                                    !!checked,
                                  )
                                }
                              />
                            </FormControl>
                            <FormLabel className="font-medium">
                              {group.title}
                            </FormLabel>
                          </div>
                          <div className="p-2 space-y-1">
                            {group.permissions.map((permission) => (
                              <FormField
                                key={permission.value}
                                control={form.control}
                                name="permissions"
                                render={() => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 pl-8 py-1">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(
                                          permission.value,
                                        )}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                permission.value,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) =>
                                                    value !== permission.value,
                                                ),
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="text-sm font-normal">
                                        {permission.label}
                                      </FormLabel>
                                      <FormDescription className="text-xs">
                                        {permission.description}
                                      </FormDescription>
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

            <FormField
              control={form.control}
              name="restrictions"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Restrictions (Optional)</FormLabel>
                    <FormDescription>
                      Add security restrictions for this API key
                    </FormDescription>
                  </div>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="api-key-ip-whitelist" className="text-sm">
                        IP Whitelist
                      </Label>
                      <Input
                        id="api-key-ip-whitelist"
                        placeholder="Enter IPs separated by commas (e.g., 192.168.1.1, 10.0.0.1)"
                        value={ipWhitelistInput}
                        onChange={(e) => setIpWhitelistInput(e.target.value)}
                        autoComplete="off"
                      />
                      <p className="text-sm text-muted-foreground">
                        Comma-separated IP addresses
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label
                        htmlFor="api-key-allowed-origins"
                        className="text-sm"
                      >
                        Allowed Origins (CORS)
                      </Label>
                      <Input
                        id="api-key-allowed-origins"
                        placeholder="Enter origins separated by commas (e.g., https://example.com)"
                        value={allowedOriginsInput}
                        onChange={(e) =>
                          setAllowedOriginsInput(e.target.value)
                        }
                        autoComplete="off"
                      />
                      <p className="text-sm text-muted-foreground">
                        Comma-separated origins for CORS
                      </p>
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
                  <FormLabel>Expiration Date (Optional)</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormDescription>
                    Leave empty for no expiration
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create API Key"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
