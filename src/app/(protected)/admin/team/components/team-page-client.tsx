"use client";

import { Search, X, UserRoundPlus, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { InviteUserForm } from "@/app/(protected)/invite-user/components/invite-user.form";
import { RBACGuard } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHeader } from "@/components/ui/page-header";
import { type TeamMember } from "@/types/team.types";
import { getTeamMembers, getCompanies } from "../actions";
import { MembersTable } from "./members-table";
import GifButton from "@/components/GifButton";
import { StatCard } from "@/components/stat-card";
import { TeamMemberIcn } from "@/assets/icons/Icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface TeamPageClientProps {
  initialMembers: TeamMember[];
  initialMeta: {
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    totalItems: number;
    totalPages: number;
  };
  initialStats: {
    total: number;
    admin: number;
    member: number;
  };
  initialSearch: string;
  initialRole: string;
  initialPage: number;
  initialCompanyId: string;
}

interface Company {
  id: string;
  name: string;
}

export function TeamPageClient({
  initialMembers,
  initialMeta,
  initialStats,
  initialSearch,
  initialRole,
  initialPage,
  initialCompanyId
}: TeamPageClientProps) {

  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [meta, setMeta] = useState(initialMeta);
  const [stats, setStats] = useState(initialStats);
  const [isLoading, setIsLoading] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [roleFilter, setRoleFilter] = useState(initialRole);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialMeta.itemsPerPage || 10); // Track items per page
  const [companyFilter, setCompanyFilter] = useState(initialCompanyId);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);

  const [filterOpen, setFilterOpen] = useState(false);
  const [pendingCompany, setPendingCompany] = useState(companyFilter || "all");
  const [pendingRole, setPendingRole] = useState(roleFilter);

  const applyFilters = useCallback(() => {
    const newCompany = pendingCompany === "all" ? "" : pendingCompany;
    setCompanyFilter(newCompany);
    setRoleFilter(pendingRole);
    setCurrentPage(1);
    setFilterOpen(false);
  }, [pendingCompany, pendingRole]);

  const handleFilterOpenChange = (open: boolean) => {
    if (open) {
      setPendingCompany(companyFilter || "all");
      setPendingRole(roleFilter);
    }
    setFilterOpen(open);
  };

  // Fetch all companies on component mount
  useEffect(() => {
    const fetchAllCompanies = async () => {
      setIsLoadingCompanies(true);
      try {
        const result = await getCompanies();
        if (result.success && result.data) {
          setCompanies(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      } finally {
        setIsLoadingCompanies(false);
      }
    };

    fetchAllCompanies();
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only update debounced search if searchQuery has a valid value
      if (searchQuery && searchQuery.trim() !== "") {
        setDebouncedSearch(searchQuery);
      } else {
        setDebouncedSearch(""); // Clear if empty
      }
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch members when filters, page, or itemsPerPage changes
  const loadMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      const payload: {
        page: number;
        limit: number;
        search?: string;
        role?: string;
        companyId?: string;
      } = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (debouncedSearch && debouncedSearch.trim() !== "") {
        payload.search = debouncedSearch.trim();
      }

      if (roleFilter && roleFilter !== "all") {
        payload.role = roleFilter;
      }

      if (companyFilter && companyFilter.trim() !== "") {
        payload.companyId = companyFilter;
      }

      const result = await getTeamMembers(payload);

      if (result.success && result.data && result.meta) {
        setMembers(result.data);
        setMeta(result.meta);

        setStats({
          total: result.meta.counts?.matchingSearchTotal ?? result.meta.totalItems,
          admin: result.meta.counts?.platformAdmin ?? 0,
          member: result.meta.counts?.platformMember ?? 0,
        });
      } else {
        toast.error(result.error || "Failed to fetch team members");
      }
    } catch (error) {
      toast.error("Failed to fetch team members");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, debouncedSearch, roleFilter, companyFilter]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const handleSearch = () => {
    if (searchQuery && searchQuery.trim() !== "") {
      setDebouncedSearch(searchQuery);
    } else {
      setDebouncedSearch(""); // Clear search if empty
    }
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setDebouncedSearch(""); // Clear both search states
    setCurrentPage(1);
  };

  const handleInviteSuccess = () => {
    setShowInviteDialog(false);
    loadMembers();
    toast.success("Invitation sent successfully");
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage: number, page: number) => {
    setItemsPerPage(newPerPage);
    setCurrentPage(1);
  };

  const getSelectedCompanyName = () => {
    if (!companyFilter) return "All";
    const company = companies.find(c => c.id === companyFilter);
    return company ? company.name : "Filter";
  };

  return (
    <RBACGuard requireAdmin redirectTo="/dashboard">
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <PageHeader
          title="Team Members"
          description="Manage your team members and their roles"
          action={
            <GifButton label="Invite Member" icon={<UserRoundPlus className="size-4 md:size-5" />} onClick={() => setShowInviteDialog(true)} />
          }
        />

        {/* Stats Cards */}
        <div className="grid gap-4 md:gap-6 xs:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Members"
            value={stats.total}
            icon={<TeamMemberIcn className="size-5 text-cyan-blue" />}
            showWave
          />
          <StatCard
            title="Administrators"
            value={stats.admin}
            icon={<ShieldCheck className="size-5 text-success" />}
            showWave
          />
          <StatCard
            title="Team Members"
            value={stats.member}
            icon={<ShieldCheck className="size-5 text-cyan-blue" />}
            showWave
          />
        </div>

        {/* Filters */}
        <Card className="">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-4 lg:px-6">
            <div className="">
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                View and manage all team members in your organization
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                {/* Search */}
                <div className="relative w-full">
                  <button onClick={handleSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search size={18} />
                  </button>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search by name or email..."
                    className="w-full min-w bg-[#C3B1E130] rounded-full pl-11 pr-4 py-3 text-sm outline-none focus:outline-none focus:ring-0"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClearSearch}
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  )}
                </div>
                {/* Filter */}
                <DropdownMenu open={filterOpen} onOpenChange={handleFilterOpenChange}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm"
                      className="relative h-11 pr-2 pl-4 gap-2 rounded-full flex flex-row-reverse items-center justify-between overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-linear-to-br from-cyan-blue to-neon-pink rounded-full" />
                      <div className="absolute inset-0 bg-white/50 rounded-full" />
                      <span className="relative z-10 flex items-center justify-center size-7 rounded-full bg-white">
                        <SlidersHorizontal className="size-4 text-dark-gray" />
                      </span>
                      <span className="relative z-10 text-sm font-medium text-white">
                        {getSelectedCompanyName()} /{" "}
                        {roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1)}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-64"
                    // onCloseAutoFocus={(e) => e.preventDefault()}
                    // onInteractOutside={(e) => e.preventDefault()}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between px-2 py-1.5">
                      <span className="text-sm font-semibold">Filters</span>
                      <button
                        onClick={applyFilters}
                        className="rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                    <DropdownMenuSeparator />

                    {/* COMPANY */}
                    <DropdownMenuLabel>Company</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      value={pendingCompany}
                      onValueChange={setPendingCompany}
                    >
                      <DropdownMenuRadioItem value="all" onSelect={(e) => e.preventDefault()}>
                        All
                      </DropdownMenuRadioItem>
                      {companies.map((company) => (
                        <DropdownMenuRadioItem
                          key={company.id}
                          value={company.id}
                          onSelect={(e) => e.preventDefault()}
                        >
                          {company.name}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>

                    <DropdownMenuSeparator />

                    {/* ROLE */}
                    <DropdownMenuLabel>Platform Role</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      value={pendingRole}
                      onValueChange={setPendingRole}
                    >
                      <DropdownMenuRadioItem value="all" onSelect={(e) => e.preventDefault()}>
                        All
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="admin" onSelect={(e) => e.preventDefault()}>
                        Admin
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="member" onSelect={(e) => e.preventDefault()}>
                        Member
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </div>
          <CardContent>
            {/* Members Table - Pass pagination props */}
            <MembersTable
              members={members}
              isLoading={isLoading}
              onRefresh={loadMembers}
              totalRows={meta.totalItems}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onPerRowsChange={handlePerRowsChange}
            />
          </CardContent>
        </Card>

        {/* Invite Member Dialog */}
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader className="text-start">
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to a new team member. They will receive an
                email with instructions to join your team.
              </DialogDescription>
            </DialogHeader>
            <InviteUserForm onSuccess={handleInviteSuccess} compact />
          </DialogContent>
        </Dialog>
      </main>
    </RBACGuard>
  );
}