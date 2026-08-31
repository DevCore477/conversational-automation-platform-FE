"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MainLogo } from "@/components/ui/main-logo";
import { useRBAC } from "@/hooks/use-rbac";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Sidebar, SidebarContent, SidebarHeader, SidebarRail, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarGroup, SidebarGroupContent, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { 
  HomeIcn, CallIcn, ScriptIcn, ConversationIcn, RobotIcn, SettingIcn, 
  ApiKeyIcn, TeamMemberIcn, AllCompaniesIcn, RequestsIcn, WhatsAppIcn
} from "@/assets/icons/Icons";

type AppSidebarProps = React.ComponentProps<typeof Sidebar>;

const NAV_ITEMS = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: HomeIcn,
  },
  {
    title: "Make a Call",
    url: "/calls",
    icon: CallIcn,
  },
  {
    title: "Scripts",
    url: "/scripts",
    icon: ScriptIcn,
  },
  {
    title: "Conversation Flow",
    url: "/conversation-flow",
    icon: ConversationIcn,
  },
  {
    title: "Agents",
    url: "/agents",
    icon: RobotIcn,
  },
  {
    title: "Team Members",
    url: "/admin/team",
    icon: TeamMemberIcn,
    adminOnly: true,
  },
  {
    title: "WhatsApp",
    url: "/whatsapp/messages",
    icon: WhatsAppIcn,
    companyAdminOnly: true,
    adminOnly: true,
    expandable: true,
    subItems: [
      {
        title: "Messages",
        url: "/whatsapp/messages",
      },
      {
        title: "Campaigns",
        url: "/whatsapp/campaigns",
      },
      {
        title: "Templates",
        url: "/whatsapp/templates",
      },
      {
        title: "Configuration",
        url: "/admin/whatsapp-config",
        adminOnly: true,
      },
    ],
  },
  {
    title: "Company Settings",
    url: "/company-settings",
    icon: SettingIcn,
    companyUser: true,
  },
  {
    title: "API Keys",
    url: "/api-keys",
    icon: ApiKeyIcn,
    companyAdminOnly: true, // Only visible to company admins
  },
  // TODO: Add rewards
  {
    title: "All Companies",
    url: "/admin/companies",
    icon: AllCompaniesIcn,
    adminOnly: true,
  },
  {
    title: "Requests",
    url: "/admin/inbound-insights",
    icon: RequestsIcn,
    adminOnly: true,
    expandable: true,
    subItems: [
      {
        title: "Inbound Insights",
        url: "/admin/inbound-insights",
      },
      {
        title: "Outbound Insights",
        url: "/admin/outbound-insights",
      },
      {
        title: "Request Activity",
        url: "/admin/requests",
      },
      {
        title: "News Letters",
        url: "/admin/newsletter",
      },
    ],
  },
];

function AppSidebar({ ...props }: AppSidebarProps) {
  const currentPath = usePathname();
  const { isAdmin, isCompanyUser, isCompanyAdmin, isWhatsappEnabled } = useRBAC();
  const router = useRouter();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const activePath = pendingPath ?? currentPath;

  const isPlatformAdmin = isAdmin && !isCompanyUser;

  const filterSubItems = (item: typeof NAV_ITEMS[0]) => {
    if (!item.subItems) return item.subItems;
    return item.subItems.filter((sub) => {
      if ((sub as { adminOnly?: boolean }).adminOnly) {
        return isPlatformAdmin;
      }
      return true;
    });
  };

  useEffect(() => {
    setPendingPath(null);
  }, [currentPath]);


  // Auto-expand/collapse menu based on current route
  useEffect(() => {
    const requestsItem = NAV_ITEMS.find(item => item.title === "Requests");
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      const visibleSubItems = requestsItem ? filterSubItems(requestsItem) : [];
      if (visibleSubItems && isChildActive(visibleSubItems)) {
        newSet.add("Requests");
      } else {
        newSet.delete("Requests");
      }
      return newSet;
    });
  }, [currentPath]);

  useEffect(() => {
    const whatsappItem = NAV_ITEMS.find(item => item.title === "WhatsApp");
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      const visibleSubItems = whatsappItem ? filterSubItems(whatsappItem) : [];
      if (visibleSubItems && isChildActive(visibleSubItems)) {
        newSet.add("WhatsApp");
      } else {
        newSet.delete("WhatsApp");
      }
      return newSet;
    });
  }, [currentPath, isPlatformAdmin]);

  const isActive = (url: string) => {
    if (url === "#") return false;

    if (url === "/dashboard") {
      return activePath === "/dashboard" || activePath.startsWith("/dashboard/");
    }

    if (url === "/scripts") {
      return activePath === "/scripts" || activePath.startsWith("/scripts/");
    }

    if (url === "/agents") {
      return activePath === "/agents" || activePath.startsWith("/agents/");
    }

    if (url === "/admin/companies") {
      return activePath === "/admin/companies" || activePath.startsWith("/admin/companies/") || activePath === "/company-settings";
    }

        if (url === "/api-keys") {
      return activePath === "/api-keys" || activePath.startsWith("/api-keys/");
    }

    if (url === "/admin/whatsapp-config") {
      return activePath === "/admin/whatsapp-config" || activePath.startsWith("/admin/whatsapp-config/");
    }

    if (url === "/whatsapp/messages") {
      return activePath === "/whatsapp/messages" || activePath.startsWith("/whatsapp/messages/");
    }

    if (url === "/whatsapp/campaigns") {
      return activePath === "/whatsapp/campaigns" || activePath.startsWith("/whatsapp/campaigns/");
    }

    if (url === "/whatsapp/templates") {
      return activePath === "/whatsapp/templates" || activePath.startsWith("/whatsapp/templates/");
    }

    return activePath === url;
  };

  const isChildActive = (subItems?: { url: string }[]) => {
    if (!subItems) return false;
    return subItems.some(item => activePath === item.url || activePath.startsWith(item.url + "/"));
  };

  const toggleExpand = (title: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

  const filteredNavItems = NAV_ITEMS.filter((item) => {
    // Platform admin can only access platform admin routes (like /admin/)
    if (item.url.startsWith("/admin/")) {
      return isPlatformAdmin;
    }

    // Company-specific items - only company users can access
    if (item.companyUser && !isCompanyUser) {
      return false;
    }

    // Company admin only items
    if (item.companyAdminOnly) {
      if (item.title === "WhatsApp") {
        if (isPlatformAdmin) return true;
        return isCompanyAdmin && isWhatsappEnabled;
      }
      return isCompanyAdmin;
    }

    // Admin only items
    if (item.adminOnly) {
      return isAdmin;
    }

    // Everyone else can access
    return true;
  });

  const prepareNavigation = (url: string) => {
    setPendingPath(url);

    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const RadioButton = ({ label, href, isChecked, onClick }: { label: string; href: string; isChecked: boolean; onClick: () => void }) => (
    <Link
      href={href}
      className="flex items-center gap-2 py-1 pl-8 cursor-pointer hover:bg-accent/50 rounded-md transition-colors"
      onClick={onClick}
    >
      <div className={cn(
        "w-3.5 h-3.5 rounded-full flex items-center justify-center",
        isChecked 
          ? "border-0 bg-gradient-to-r from-cyan-blue to-neon-pink p-[1px]" 
          : "border border-muted-foreground"
        )}
      >
        {isChecked ? (
          <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-blue to-neon-pink" />
          </div>
        ) : (
          <div className="w-2 h-2 rounded-full" />
        )}
      </div>
      <span className={cn(
        "text-sm cursor-pointer",
        isChecked ? "text-primary font-medium" : "text-muted-foreground"
      )}>
        {label}
      </span>
    </Link>
  );

  const handleNavigation = (url: string) => {
    prepareNavigation(url);
    router.push(url);
  };

  const PopupMenu = ({ item }: { item: typeof NAV_ITEMS[0] }) => (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <SidebarMenuButton
          tooltip={item.title}
          className="cursor-pointer"
          isActive={isActive(item.url) || isChildActive(item.subItems)}
        >
          <item.icon className="size-5" />
          <span className="cursor-pointer">{item.title}</span>
        </SidebarMenuButton>
      </PopoverTrigger>
      <PopoverContent side="right" className="w-48 p-2" align="start" sideOffset={12}>
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-muted-foreground px-2 py-1">
            {item.title}
          </p>
          <div className="h-px bg-border my-1" />
          {item.subItems?.map((subItem) => (
            <Link
              href={subItem.url}
              key={subItem.title}
              onClick={() => {
                prepareNavigation(subItem.url);
                setPopoverOpen(false);
              }}
              className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors w-full text-left ${
                isActive(subItem.url)
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-accent"
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                isActive(subItem.url) ? "bg-primary" : "bg-muted-foreground"
              }`} />
              {subItem.title}
            </Link>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader onClick={() => handleNavigation("/dashboard")}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="flex flex-row items-center justify-center border-none hover:!bg-transparent hover:!text-current"
            >
              <MainLogo
                className="size-8 flex-1 text-left text-sm leading-tight"
                showText={!isCollapsed}
                path="/"
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="hide-scrollbar">
        <SidebarGroup className={!isCollapsed ? "px-6 " : ""}>
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavItems.map((item) => {
                const visibleSubItems = filterSubItems(item);
                const hasSubItems = item.expandable && visibleSubItems && visibleSubItems.length > 1 && !isCollapsed;
                const isExpanded = expandedItems.has(item.title);
                const isAnyChildActive = isChildActive(visibleSubItems);
                const singleUrl = visibleSubItems?.length === 1 ? visibleSubItems[0].url : item.url;
                
                // For collapsed sidebar with expandable items (more than 1 sub), show popup menu
                if (item.expandable && visibleSubItems && visibleSubItems.length > 1 && isCollapsed) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <PopupMenu item={{ ...item, subItems: visibleSubItems }} />
                    </SidebarMenuItem>
                  );
                }

                if (hasSubItems) {
                  return (
                    <div key={item.title}>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          isActive={isActive(item.url) || isAnyChildActive}
                          tooltip={item.title}
                          onClick={() => {
                            if (!isExpanded && visibleSubItems && visibleSubItems.length > 0) {
                              handleNavigation(visibleSubItems[0].url);
                            }
                            toggleExpand(item.title);
                          }}
                          className="cursor-pointer"
                        >
                          <item.icon className="size-5" />
                          <span className="flex-1 cursor-pointer">{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      {isExpanded && (
                        <div className="mt-4 space-y-1">
                          {visibleSubItems?.map((subItem) => (
                            <RadioButton
                              key={subItem.title}
                              label={subItem.title}
                              href={subItem.url}
                              isChecked={isActive(subItem.url)}
                              onClick={() => handleNavigation(subItem.url)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(singleUrl)}
                      tooltip={item.title}
                      className="cursor-pointer"
                    >
                      <Link href={singleUrl} onClick={() => prepareNavigation(singleUrl)}>
                        <item.icon className="size-5" />
                        <span className="cursor-pointer">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className={`mb-12 ${!isCollapsed ? "px-6" : ""}`}>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export { AppSidebar };
