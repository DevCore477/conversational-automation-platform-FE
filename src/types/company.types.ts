export type CompanyRole = "owner" | "admin" | "member";

export interface CompanyFeatureFlags {
  apiAccess: boolean;
  voiceAgent: boolean;
  inboundCalls: boolean;
  callAnalytics: boolean;
  callRecording: boolean;
  outboundCalls: boolean;
}

export interface CompanyNotifications {
  sms: boolean;
  email: boolean;
  webhook: boolean;
}

export interface CompanySettings {
  timezone?: string;
  language?: string;
  currency?: string;
  dateFormat?: string;
  timeFormat?: string;
  allowUserInvites?: boolean;
  requireEmailVerification?: boolean;
  maxUsers?: number;
  maxCallsPerMonth?: number;
  features?: CompanyFeatureFlags;
  notifications?: CompanyNotifications;
  [key: string]: unknown;
}

export interface CompanyTheme {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  logo?: string;
  logoUrl?: string;
  icon?: string;
  favicon?: string;
  customCss?: string;
  [key: string]: unknown;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
  logo?: string;
  logoUrl?: string;
  icon?: string;
  primaryColor?: string;
  accentColor?: string;
  secondaryColor?: string;
  email?: string;
  phone?: string;
  ownerId?: string | null;
  settings?: CompanySettings;
  theme?: CompanyTheme;
  plan?: string;
  isActive?: boolean;
  totalUsers?: number;
  totalCalls?: number;
  totalAdmins?: number;
  adminName?: string;
  whatsapp?: {
    configured: boolean;
    enabled: boolean;
    phoneNumberId?: string;
    businessPhoneNumber?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  companyRole: CompanyRole;
  companyId: string;
  isActive?: boolean;
  joinedAt?: string;
  lastActiveAt?: string;
  createdAt?: string;
}

export interface CompanyStats {
  totalUsers: number;
  totalCalls: number;
  totalScripts?: number;
  totalAgents?: number;
  totalFlows?: number;
  totalAPIKeys?: number;
  activeAPIKeys?: number;
  callsThisMonth?: number;
  callsLastMonth?: number;
  growth?: number;
}

export interface CreateCompanyDto {
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
}

export interface UpdateCompanyDto {
  name?: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
  logo?: string;
  logoUrl?: string;
  email?: string;
  phone?: string;
}

export interface UpdateCompanyThemeDto {
  primaryColor?: string;
  accentColor?: string;
  secondaryColor?: string;
  logo?: string;
  logoUrl?: string;
  favicon?: string;
  customCss?: string;
  [key: string]: unknown;
}

export interface AddUserToCompanyDto {
  email: string;
  companyRole: CompanyRole;
  sendInviteEmail?: boolean;
}

export interface UpdateUserRoleDto {
  companyRole: CompanyRole;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  companyRole?: CompanyRole;
}

export interface PendingInvitation {
  id: string;
  email: string;
  role?: string;
  companyRole: CompanyRole;
  expiresAt: string;
  invitedBy?: string;
  createdAt?: string;
}

export interface CompanyUsersResponse {
  users: CompanyUser[];
  pendingInvitations: PendingInvitation[];
}

export interface AddUserResponse {
  success: boolean;
  message: string;
  invitationSent?: boolean;
  user?: CompanyUser;
}

export interface ActionResponse {
  success: boolean;
  error?: string;
}
