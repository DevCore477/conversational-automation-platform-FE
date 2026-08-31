"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useDebounce } from "use-debounce";
import { BookOpen, RefreshCw, Search, X, ExternalLink, Eye, Edit, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { RBACGuard } from "@/components/auth";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import GifButton from "@/components/GifButton";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, type TableColumn, type TableAction } from "@/components/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import RefreshButton from "@/app/(protected)/dashboard/components/RefreshButton";
import { useRBAC } from "@/hooks/use-rbac";
import { useCompanyStore } from "@/store/company.store";
import { whatsappService } from "@/service/whatsapp.service";
import { getErrorMessage } from "@/lib/get-error-message";
import { SuperAdminCompanyScopePicker } from "@/app/(protected)/components/super-admin-company-scope";
import type { WhatsAppMessageTemplate, LibraryTemplate } from "@/types/whatsapp.types";
import { toast } from "sonner";

import { ViewTemplateModal } from "./components/view-template-modal";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const STATUS_OPTIONS = ["all", "approved", "pending", "rejected", "paused", "disabled"] as const;

function toLocale(lang: string): string {
  if (lang.includes("_")) return lang;
  if (lang === "en") return "en_GB";
  return lang;
}

const LIBRARY_LANGUAGE_OPTIONS = [
  { value: "_", label: "All Languages" },
  { value: "en_GB", label: "English (UK)" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "pt", label: "Portuguese" },
  { value: "it", label: "Italian" },
  { value: "nl", label: "Dutch" },
  { value: "pl", label: "Polish" },
  { value: "ru", label: "Russian" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh", label: "Chinese" },
  { value: "ar", label: "Arabic" },
  { value: "hi", label: "Hindi" },
  { value: "bn", label: "Bengali" },
  { value: "tr", label: "Turkish" },
  { value: "vi", label: "Vietnamese" },
  { value: "th", label: "Thai" },
  { value: "sv", label: "Swedish" },
  { value: "nb", label: "Norwegian" },
  { value: "da", label: "Danish" },
  { value: "fi", label: "Finnish" },
  { value: "cs", label: "Czech" },
  { value: "el", label: "Greek" },
  { value: "he", label: "Hebrew" },
  { value: "hu", label: "Hungarian" },
  { value: "ro", label: "Romanian" },
  { value: "sk", label: "Slovak" },
] as const;

const LIBRARY_TOPIC_OPTIONS = [
  { value: "_", label: "All Topics" },
  { value: "ACCOUNT_OR_PRODUCT_PROTECTION", label: "Account or Product Protection" },
  { value: "ACCOUNT_UPDATES", label: "Account Updates" },
  { value: "CALL_PERMISSIONS", label: "Call Permissions" },
  { value: "CONTACT_REQUEST", label: "Contact Request" },
  { value: "CUSTOMER_FEEDBACK", label: "Customer Feedback" },
  { value: "CUSTOMER_RE_ENGAGEMENT", label: "Customer Re-engagement" },
  { value: "EVENT_REMINDER", label: "Event Reminder" },
  { value: "FIXED_TEMPLATE_PRICE_TEST", label: "Fixed Template Price Test" },
  { value: "GROUP_INVITE_LINK", label: "Group Invite Link" },
  { value: "IDENTITY_VERIFICATION", label: "Identity Verification" },
  { value: "LEGAL_REGULATORY_COMPLIANCE", label: "Legal & Regulatory Compliance" },
  { value: "ORDER_MANAGEMENT", label: "Order Management" },
  { value: "PAYMENTS", label: "Payments" },
  { value: "PUBLIC_ANNOUNCEMENTS", label: "Public Announcements" },
  { value: "PUBLIC_DISRUPTION", label: "Public Disruption" },
  { value: "PUBLIC_SAFETY", label: "Public Safety" },
  { value: "PUBLIC_SERVICE", label: "Public Service" },
  { value: "REGULATORY_COMPLIANCE", label: "Regulatory Compliance" },
] as const;

const statusColors: Record<string, string> = {
  approved: "text-success",
  pending: "text-warning",
  rejected: "text-danger-soft",
  paused: "text-orange-600",
  disabled: "text-muted-foreground",
};

const qualityColors: Record<string, string> = {
  green: "text-green-600",
  yellow: "text-yellow-600",
  red: "text-red-600",
};

function TemplatesPageInner() {
  const router = useRouter();
  const { isAdmin, isCompanyUser } = useRBAC();
  const isPlatformAdmin = isAdmin && !isCompanyUser;
  const { company, fetchMyCompany } = useCompanyStore();
  const searchParams = useSearchParams();

  const effectiveCompanyId = isPlatformAdmin
    ? searchParams.get("companyId")
    : (company?.id ?? null);

  const [templates, setTemplates] = useState<WhatsAppMessageTemplate[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [syncing, setSyncing] = useState(false);

  const [viewTemplate, setViewTemplate] = useState<WhatsAppMessageTemplate | null>(null);

  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryTemplates, setLibraryTemplates] = useState<LibraryTemplate[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [librarySearch, setLibrarySearch] = useState("");
  const [libraryCategory, setLibraryCategory] = useState("_");
  const [libraryLanguage, setLibraryLanguage] = useState("_");
  const [libraryTopic, setLibraryTopic] = useState("_");
  const [copyTemplate, setCopyTemplate] = useState<LibraryTemplate | null>(null);
  const [copyName, setCopyName] = useState("");
  const [copyLanguage, setCopyLanguage] = useState("en_GB");
  const [copying, setCopying] = useState(false);

  const fetchTemplates = useCallback(async () => {
    if (!effectiveCompanyId) return;
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit: rowsPerPage, approvedOnly: false, includeInactive: false };
      if (debouncedSearch) params.search = debouncedSearch;
      if (statusFilter !== "all") params.status = statusFilter;
      const { data, meta } = await whatsappService.getTemplates(params, effectiveCompanyId);
      setTemplates(data);
      setTotalCount(meta.totalItems);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load templates"));
    } finally {
      setLoading(false);
    }
  }, [effectiveCompanyId, page, rowsPerPage, debouncedSearch, statusFilter]);

  useEffect(() => {
    if (!effectiveCompanyId && !isPlatformAdmin) void fetchMyCompany();
  }, [effectiveCompanyId, isPlatformAdmin, fetchMyCompany]);

  useEffect(() => {
    if (effectiveCompanyId) void fetchTemplates();
  }, [effectiveCompanyId, fetchTemplates]);

  useEffect(() => {
    if (!libraryOpen) return;
    const timer = setTimeout(() => void handleSearchLibrary(), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [libraryOpen, librarySearch, libraryCategory, libraryLanguage, libraryTopic]);

  const handleRefresh = async () => {
    await fetchTemplates();
    toast.success("Templates refreshed");
  };

  const handleSync = async () => {
    if (!effectiveCompanyId || syncing) return;
    setSyncing(true);
    try {
      const result = await whatsappService.syncTemplates(effectiveCompanyId);
      toast.success(`Sync complete: ${result.created} created, ${result.updated} updated, ${result.archived} archived`);
      await fetchTemplates();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to sync templates from Meta"));
    } finally {
      setSyncing(false);
    }
  };

  const handleDelete = async (template: WhatsAppMessageTemplate) => {
    try {
      await whatsappService.deleteTemplate(template.id, effectiveCompanyId ?? undefined);
      toast.success(`Template "${template.name}" deleted`);
      await fetchTemplates();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete template"));
    }
  };

  const openLibrary = () => {
    setLibrarySearch("");
    setLibraryCategory("_");
    setLibraryLanguage("_");
    setLibraryTopic("_");
    setLibraryTemplates([]);
    setLibraryOpen(true);
  };

  const handleSearchLibrary = async () => {
    setLibraryLoading(true);
    try {
      const params: Record<string, unknown> = {};
      if (librarySearch.trim()) params.search = librarySearch.trim();
      if (libraryCategory && libraryCategory !== "_") params.category = libraryCategory;
      if (libraryLanguage && libraryLanguage !== "_") params.language = libraryLanguage;
      if (libraryTopic && libraryTopic !== "_") params.topic = libraryTopic;
      const data = await whatsappService.getLibraryTemplates(params, effectiveCompanyId ?? undefined);
      setLibraryTemplates(data);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load template library"));
    } finally {
      setLibraryLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!copyTemplate || !copyName.trim() || !effectiveCompanyId) return;
    setCopying(true);
    try {
      await whatsappService.copyFromLibrary(
        {
          libraryTemplateName: copyTemplate.name,
          name: copyName.trim(),
          language: copyLanguage,
          category: copyTemplate.category as "MARKETING" | "UTILITY" | "AUTHENTICATION",
        },
        effectiveCompanyId,
      );
      await whatsappService.syncTemplates(effectiveCompanyId);
      toast.success(`"${copyName}" copied. Meta will review it for approval.`);
      setCopyTemplate(null);
      setCopyName("");
      setCopyLanguage("en_GB");
      setLibraryOpen(false);
      await fetchTemplates();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to copy template"));
    } finally {
      setCopying(false);
    }
  };

  const columns: TableColumn<WhatsAppMessageTemplate>[] = [
    {
      key: "name",
      header: "Name",
      render: (item) => <span className="font-medium">{item.name}</span>,
    },
    {
      key: "metaTemplateName",
      header: "Meta Name",
      hideOnMobile: true,
      render: (item) => <span className="text-muted-foreground text-xs font-mono">{item.metaTemplateName}</span>,
    },
    {
      key: "category",
      header: "Category",
      render: (item) => <span className="capitalize">{item.category || "—"}</span>,
    },
    {
      key: "language",
      header: "Lang",
      render: (item) => <span className="uppercase">{item.language || "en"}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (item) => {
        const color = statusColors[item.status] || "text-muted-foreground";
        const label = item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "Unknown";
        if (item.status === "pending") {
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={`font-medium cursor-pointer ${color}`}>{label}</span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[260px] text-center">
                You won't be able to use this template to send messages while it's in review. Reviews can take up to 24 hours.
              </TooltipContent>
            </Tooltip>
          );
        }
        return <span className={`font-medium cursor-pointer ${color}`}>{label}</span>;
      },
    },
    {
      key: "qualityStatus",
      header: "Quality",
      hideOnMobile: true,
      render: (item) => (
        <span className={`text-xs font-medium capitalize ${qualityColors[item.qualityStatus || ""] || "text-muted-foreground"}`}>
          {item.qualityStatus || "—"}
        </span>
      ),
    },
    {
      key: "usableForCampaigns",
      header: "Usable",
      hideOnMobile: true,
      render: (item) => (
        <span className={item.usableForCampaigns ? "text-green-600" : "text-muted-foreground"}>
          {item.usableForCampaigns ? "Yes" : "No"}
        </span>
      ),
    },
  ];

  const getActions = (item: WhatsAppMessageTemplate): TableAction<WhatsAppMessageTemplate>[] => [
    {
      label: "View",
      icon: <Eye className="h-4 w-4" />,
      onClick: () => setViewTemplate(item),
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: () => {
        const companyParam = effectiveCompanyId ? `?companyId=${effectiveCompanyId}` : "";
        router.push(`/whatsapp/templates/${item.id}/edit${companyParam}`);
      },
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: () => {
        if (window.confirm(`Are you sure you want to delete template "${item.name}"?`)) {
          void handleDelete(item);
        }
      },
      variant: "destructive",
    },
  ];

  return (
    <RBACGuard route="/whatsapp/messages" redirectTo="/dashboard">
      <main className="flex min-h-0 flex-1 flex-col gap-6 p-4 lg:p-6">
        {isPlatformAdmin && (
          <SuperAdminCompanyScopePicker
            scopePath="/whatsapp/templates"
            title="Message Templates"
            description="Select a company to manage their WhatsApp message templates."
          />
        )}

        {!isPlatformAdmin && (
          <PageHeader
            title="Message Templates"
            description="Browse and sync WhatsApp message templates from Meta's library."
            action={
              <div className="flex flex-col xs:flex-row items-center gap-2">
                {/* <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full py-5 px-16"
                  onClick={handleSync}
                  disabled={syncing}
                >
                  <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
                  {syncing ? "Syncing..." : "Sync from Meta"}
                </Button> */}
                <GifButton
                  label={syncing ? "Syncing..." : "Sync from Meta"}
                  icon={<RefreshCw className={`size-4 lg:size-5 ${syncing ? "animate-spin" : ""}`} />}
                  onClick={handleSync}
                />
                <GifButton
                  label="Browse Library"
                  icon={<BookOpen className="size-4 lg:size-5" />}
                  onClick={openLibrary}
                />
              </div>
            }
          />
        )}

        {isPlatformAdmin && !effectiveCompanyId && (
          <div className="flex items-center justify-center py-24">
            <p className="text-muted-foreground">Select a company above to manage message templates.</p>
          </div>
        )}

        {effectiveCompanyId && (
          <>
            {isPlatformAdmin && (
              <PageHeader
                title="Message Templates"
                description="Browse and sync WhatsApp message templates from Meta's library for the selected company."
                action={
                  <div className="flex flex-col xs:flex-row items-center gap-2">
                    {/* <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full py-5 px-16"
                      onClick={handleSync}
                      disabled={syncing}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
                      {syncing ? "Syncing..." : "Sync from Meta"}
                    </Button> */}
                    <GifButton
                      label={syncing ? "Syncing..." : "Sync from Meta"}
                      icon={<RefreshCw className={`size-4 lg:size-5 ${syncing ? "animate-spin" : ""}`} />}
                      onClick={handleSync}
                    />
                    <GifButton
                      label="Browse Library"
                      icon={<BookOpen className="size-4 lg:size-5" />}
                      onClick={openLibrary}
                    />
                  </div>
                }
              />
            )}

            <Card>
              <CardHeader>
                <div className="flex flex-col gap-2 sm:flex-row md:items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg text-sidebar-accent dark:text-sidebar-accent-foreground font-medium leading-none tracking-tight">
                      Synced Templates
                    </CardTitle>
                    <span className="text-[14px] text-[#666666]">
                      ({totalCount} total)
                    </span>
                  </div>
                  <div className="flex justify-end">
                  <RefreshButton onRefresh={handleRefresh} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
                  <div className="relative flex-1 w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search templates..."
                      showLeftBorder={false}
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                      className="pl-9 pr-8"
                    />
                    {search && (
                      <button
                        onClick={() => { setSearch(""); setPage(1); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                    <SelectTrigger className="w-[140px]" showLeftBorder={false}>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Table<WhatsAppMessageTemplate>
                  data={templates}
                  columns={columns}
                  isLoading={loading}
                  emptyMessage="No synced templates. Browse the Meta library to copy templates to your WABA, then sync."
                  getRowKey={(item) => item.id}
                  onRowClick={(item) => setViewTemplate(item)}
                  getActions={getActions}
                  desktopGridClassName="md:grid-cols-[1.5fr_1fr_0.8fr_0.5fr_0.8fr_0.5fr_0.5fr_0.5fr]"
                  page={page}
                  rowsPerPage={rowsPerPage}
                  totalCount={totalCount}
                  onPageChange={setPage}
                  onRowsPerPageChange={(r) => { setRowsPerPage(r); setPage(1); }}
                />
              </CardContent>
            </Card>
          </>
        )}

        <ViewTemplateModal
          template={viewTemplate}
          onOpenChange={(open) => { if (!open) setViewTemplate(null); }}
        />

        <Dialog open={libraryOpen} onOpenChange={(o) => { if (!o) setLibraryOpen(false); }}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-card">
            <DialogHeader>
              <DialogTitle>Meta Template Library</DialogTitle>
              <DialogDescription>
                Browse pre-built templates from Meta&apos;s public library. Copy one to your company to start using it.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search library..."
                  showLeftBorder={false}
                  value={librarySearch}
                  onChange={(e) => setLibrarySearch(e.target.value)}
                  className="pl-9 pr-8 rounded-full h-10"
                />
                {librarySearch && (
                  <button
                    onClick={() => setLibrarySearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Select value={libraryCategory} onValueChange={setLibraryCategory}>
                <SelectTrigger className="rounded-full h-9 w-36" showLeftBorder={false}>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_">All</SelectItem>
                  <SelectItem value="MARKETING">Marketing</SelectItem>
                  <SelectItem value="UTILITY">Utility</SelectItem>
                  <SelectItem value="AUTHENTICATION">Authentication</SelectItem>
                </SelectContent>
              </Select>
              <Select value={libraryLanguage} onValueChange={setLibraryLanguage}>
                <SelectTrigger className="rounded-full h-9 w-40" showLeftBorder={false}>
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  {LIBRARY_LANGUAGE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={libraryTopic} onValueChange={setLibraryTopic}>
                <SelectTrigger className="rounded-full h-9 w-40" showLeftBorder={false}>
                  <SelectValue placeholder="Topic" />
                </SelectTrigger>
                <SelectContent>
                  {LIBRARY_TOPIC_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {libraryLoading ? (
              <div className="flex items-center justify-center py-16">
                <Spinner className="h-8 w-8" />
              </div>
            ) : libraryTemplates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <BookOpen className="size-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No templates found</h3>
                <p className="text-sm text-muted-foreground">Search the Meta template library to find pre-built templates.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
                {libraryTemplates.map((tmpl) => (
                  <div key={`${tmpl.name}-${tmpl.language}`} className="border rounded-xl p-4 hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{tmpl.name}</h4>
                        <p className="text-xs text-muted-foreground">{tmpl.language}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs whitespace-nowrap ml-2">{tmpl.category}</Badge>
                    </div>
                    <div className="flex-1 space-y-1 mb-3">
                      <p className="text-xs text-muted-foreground line-clamp-2">{tmpl.body || "No body content"}</p>
                      {tmpl.header && <p className="text-xs text-muted-foreground/70 line-clamp-1">Header: {tmpl.header}</p>}
                      {tmpl.topic && <p className="text-xs text-muted-foreground/70">{tmpl.topic.replace(/_/g, " ")}</p>}
                      {tmpl.buttons && tmpl.buttons.length > 0 && <p className="text-xs text-muted-foreground/70">{tmpl.buttons.length} button(s)</p>}
                      {tmpl.body_params && tmpl.body_params.length > 0 && (
                        <p className="text-xs text-muted-foreground/70">{tmpl.body_params.length} placeholder(s)</p>
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="w-full rounded-full mt-auto" onClick={() => {
                      setCopyTemplate(tmpl);
                      setCopyName(`${tmpl.name.toLowerCase().replace(/\s+/g, "_").replace(/[()]/g, "").replace(/__+/g, "_")}`);
                      setCopyLanguage(toLocale(tmpl.language));
                    }}>
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Copy to Company
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={!!copyTemplate} onOpenChange={(o) => { if (!o) { setCopyTemplate(null); setCopyName(""); setCopyLanguage("en_US"); } }}>
          <DialogContent className="sm:max-w-lg bg-card">
            <DialogHeader>
              <DialogTitle>Copy Template to Company</DialogTitle>
              <DialogDescription>
                Copy <strong>{copyTemplate?.name}</strong> to your company. Meta will review it for approval.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="copy-name">Template Name *</Label>
                <Input id="copy-name" value={copyName} onChange={(e) => setCopyName(e.target.value)} placeholder="my_template_name" maxLength={128} />
                <p className="text-xs text-muted-foreground">Use lowercase snake_case. This will be your template name in Meta.</p>
              </div>
              {copyTemplate && (
                <div className="border rounded-lg p-3 bg-muted/30 space-y-3">
                  <p className="text-xs"><span className="font-medium">Library Name:</span> {copyTemplate.name}</p>
                  <p className="text-xs"><span className="font-medium">Category:</span> {copyTemplate.category}</p>
                  <div className="space-y-1">
                    <Label htmlFor="copy-language">Language *</Label>
                    <Input id="copy-language" value={copyLanguage} disabled className="rounded-full h-9" />
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setCopyTemplate(null); setCopyName(""); setCopyLanguage("en_GB"); }}>Cancel</Button>
              <Button type="button" onClick={() => void handleCopy()} disabled={copying || !copyName.trim()}>
                {copying ? <Spinner className="h-4 w-4 mr-1" /> : null}
                Copy to Company
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </RBACGuard>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-24"><Spinner className="h-8 w-8" /></div>}>
      <TemplatesPageInner />
    </Suspense>
  );
}
