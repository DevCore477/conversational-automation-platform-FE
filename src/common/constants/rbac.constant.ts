import { UserRole } from "@/common/enums/user.types";

/**
 * Define permissions for each feature/action
 */
export enum Permission {
  // Dashboard
  VIEW_DASHBOARD = "view_dashboard",

  // Contacts/Guests
  VIEW_CONTACTS = "view_contacts",
  CREATE_CONTACT = "create_contact",
  EDIT_CONTACT = "edit_contact",
  DELETE_CONTACT = "delete_contact",

  // Calls/Transcripts
  VIEW_CALLS = "view_calls",
  MAKE_CALL = "make_call",
  VIEW_TRANSCRIPTS = "view_transcripts",

  // Campaigns
  VIEW_CAMPAIGNS = "view_campaigns",
  CREATE_CAMPAIGN = "create_campaign",
  EDIT_CAMPAIGN = "edit_campaign",
  DELETE_CAMPAIGN = "delete_campaign",

  // Script Management / Conversation Flow
  VIEW_SCRIPTS = "view_scripts",
  EDIT_SCRIPTS = "edit_scripts",

  // Team Management
  VIEW_TEAM = "view_team",
  INVITE_USER = "invite_user",
  MANAGE_TEAM = "manage_team",

  // Rewards
  VIEW_REWARDS = "view_rewards",

  // API Keys
  VIEW_API_KEYS = "view_api_keys",
  CREATE_API_KEYS = "create_api_keys",
  EDIT_API_KEYS = "edit_api_keys",
  DELETE_API_KEYS = "delete_api_keys",

  // Company Settings
  VIEW_COMPANY_SETTINGS = "view_company_settings",
  EDIT_COMPANY_SETTINGS = "edit_company_settings",

  //   All companies
  VIEW_ALL_COMPANIES = "view_all_companies",
  EDIT_ALL_COMPANIES = "edit_all_companies",


//   conversation flows
  VIEW_CONVERSATION_FLOWS = "view_conversation_flows",
  EDIT_CONVERSATION_FLOWS = "edit_conversation_flows",

//   agents
  VIEW_AGENTS = "view_agents",
  EDIT_AGENTS = "edit_agents",

  // WhatsApp
  VIEW_WHATSAPP = "view_whatsapp",
  SEND_WHATSAPP = "send_whatsapp",
  IMPORT_WHATSAPP = "import_whatsapp",
}

/**
 * Role to permissions mapping
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // Admin has all permissions
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_CONTACTS,
    Permission.CREATE_CONTACT,
    Permission.EDIT_CONTACT,
    Permission.DELETE_CONTACT,
    Permission.VIEW_CALLS,
    Permission.MAKE_CALL,
    Permission.VIEW_TRANSCRIPTS,
    Permission.VIEW_CAMPAIGNS,
    Permission.CREATE_CAMPAIGN,
    Permission.EDIT_CAMPAIGN,
    Permission.DELETE_CAMPAIGN,
    Permission.VIEW_SCRIPTS,
    Permission.EDIT_SCRIPTS,
    Permission.VIEW_TEAM,
    Permission.INVITE_USER,
    Permission.MANAGE_TEAM,
    Permission.VIEW_REWARDS,
    Permission.VIEW_API_KEYS,
    Permission.CREATE_API_KEYS,
    Permission.EDIT_API_KEYS,
    Permission.DELETE_API_KEYS,
    Permission.VIEW_COMPANY_SETTINGS,
    Permission.EDIT_COMPANY_SETTINGS,
    Permission.VIEW_ALL_COMPANIES,
    Permission.EDIT_ALL_COMPANIES,
    Permission.VIEW_CONVERSATION_FLOWS,
    Permission.EDIT_CONVERSATION_FLOWS,
    Permission.VIEW_AGENTS,
    Permission.EDIT_AGENTS,
    Permission.VIEW_WHATSAPP,
    Permission.SEND_WHATSAPP,
    Permission.IMPORT_WHATSAPP,
  ],
  [UserRole.USER]: [
    // Team members have limited permissions
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_CONTACTS,
    Permission.VIEW_CALLS,
    Permission.VIEW_TRANSCRIPTS,
    Permission.VIEW_CAMPAIGNS,
    Permission.VIEW_REWARDS,
    Permission.VIEW_COMPANY_SETTINGS,
    Permission.VIEW_SCRIPTS,
    Permission.EDIT_SCRIPTS,
    Permission.VIEW_CONVERSATION_FLOWS,
    Permission.EDIT_CONVERSATION_FLOWS,
    Permission.VIEW_AGENTS,
    Permission.EDIT_AGENTS,
    // Note: Team members CANNOT invite users or manage team
  ],
};

export const COMPANY_ADMIN_PERMISSIONS: Permission[] = [
  Permission.VIEW_WHATSAPP,
  Permission.SEND_WHATSAPP,
  Permission.IMPORT_WHATSAPP,
  Permission.VIEW_API_KEYS,
  Permission.CREATE_API_KEYS,
  Permission.EDIT_API_KEYS,
  Permission.DELETE_API_KEYS,
  Permission.INVITE_USER,
  Permission.MANAGE_TEAM,
];

/**
 * Route access configuration
 * Maps routes to required permissions
 */
export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  "/dashboard": [Permission.VIEW_DASHBOARD],
  "/contacts": [Permission.VIEW_CONTACTS],
  "/calls": [Permission.VIEW_CALLS],
  "/campaigns": [Permission.VIEW_CAMPAIGNS],
  "/invite-user": [Permission.INVITE_USER],
  "/scripts": [Permission.VIEW_SCRIPTS],
  "/conversation-flow": [Permission.VIEW_CONVERSATION_FLOWS],
  "/agents": [Permission.VIEW_AGENTS],
  "/team": [Permission.VIEW_TEAM, Permission.MANAGE_TEAM],
  "/rewards": [Permission.VIEW_REWARDS],
  "/api-keys": [Permission.VIEW_API_KEYS],
  "/company-settings": [Permission.VIEW_COMPANY_SETTINGS],
  "/admin/companies": [Permission.VIEW_ALL_COMPANIES],
  "/admin/team": [Permission.VIEW_TEAM, Permission.MANAGE_TEAM],
  "/whatsapp": [Permission.VIEW_WHATSAPP],
};

/**
 * Admin-only routes (requires admin role)
 */
export const ADMIN_ONLY_ROUTES = [
  "/invite-user",
  "/admin/team",
  "/admin/companies",
  "/admin/inbound-insights",
  "/admin/outbound-insights",
  "/admin/requests",
  "/admin/whatsapp-config",
];

/**
 * Public routes that don't require authentication
 */
export const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/accept-invite",
];

/**
 * Protected routes that require authentication
 */
export const PROTECTED_ROUTES = [
  "/dashboard",
  "/contacts",
  "/calls",
  "/campaigns",
  "/invite-user",
  "/scripts",
  "/conversation-flow",
  "/agents",
  "/company-settings",
  "/api-keys",
  "/rewards",
  "/profile",
  "/admin/team",
  "/admin/companies",
  "/admin/inbound-insights",
  "/admin/outbound-insights",
  "/admin/requests",
  "/admin/whatsapp-config",
  "/whatsapp",
];
