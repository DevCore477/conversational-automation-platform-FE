export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string; // API returns lowercase: "admin" or "member"
  createdAt: string;
  updatedAt?: string;
  companyId?: string,
  isActive?: boolean;
  lastLogin?: string;
  companyRole: string;
  company?: {
    name: string;
  };
}

export interface TeamMembersResponse {
  data: TeamMember[];
  meta: {
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    totalItems: number;
    totalPages: number;
    counts?: {
      matchingSearchTotal: number;
      platformAdmin: number;
      platformMember: number;
      withCompany?: number;
      withoutCompany?: number;
    };
  };
}

export interface GetTeamMembersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string; // API expects lowercase: "admin" or "member"
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  companyId?: string;
}
