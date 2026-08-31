"use client";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  ChevronDown ,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/get-error-message";
import { useThemeStore } from "@/store/theme.store";

import { UserNavSkeleton } from "./user-nav-skeleton";
import { useTheme } from "next-themes";

interface UserNavProps {
  isCollapsed?: boolean;
}

export function UserNav({ isCollapsed = false }: UserNavProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { clearTheme } = useThemeStore();
  const {setTheme} = useTheme();
  const [hasMounted, setHasMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const getFullName = (firstName: string, lastName: string) => {
    return `${firstName} ${lastName}`;
  };

  const handleLogOut = () => {
    try {
      // Call logout synchronously
      logout();
      clearTheme();
      setTheme("system");

      // Show success message
      toast.success("Logged out successfully");

      // Use window.location for a clean redirect that bypasses React Router state
      window.location.href = "/login";
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to logout"));

      // Still try to redirect even if there's an error
      window.location.href = "/login";
    }
  };

  const DROPDOWN_OPTIONS = [
    // {
    //   label: "Upgrade to Pro",
    //   icon: <Sparkles />,
    //   action: () => {},
    //   group: "top",
    // },
    {
      label: "Profile",
      icon: <BadgeCheck />,
      action: () => router.push("/profile"),
      group: "main",
    },
    // {
    //   label: "Billing",
    //   icon: <CreditCard />,
    //   action: () => {},
    //   group: "main",
    // },
    // {
    //   label: "Notifications",
    //   icon: <Bell />,
    //   action: () => {},
    //   group: "main",
    // },
    {
      label: "Log out",
      icon: <LogOut />,
      action: handleLogOut,
      group: "bottom",
    },
  ];

  const getGroupedItems = (groupName: string) =>
    DROPDOWN_OPTIONS.filter((item) => item.group === groupName);

  if (!hasMounted || isLoggingOut) {
    return <UserNavSkeleton isCollapsed={isCollapsed} />;
  }
  if (!user) {
    return null;
  }

  return (
    <SidebarMenu className="max-w-60">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 py-2"
              // className="data-[state=open]:bg-sidebar-accen data-[state=open]:text-sidebar-accent-foregroun dark:text-sidebar-accent-foreground border-none hover:!bg-transparent hover:!text-current "
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage alt={getFullName(user.firstName, user.lastName)} />
                <AvatarFallback className="rounded-lg">
                  {getUserInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
              {!isMobile && (
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {getFullName(user.firstName, user.lastName)}
                  </span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              )}
              <span className="size-6 rounded-full flex items-center justify-center bg-accent dark:bg-[#666666]">
              <ChevronDown className=" size-4" />
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "top" : "bottom"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    alt={getFullName(user.firstName, user.lastName)}
                  />
                  <AvatarFallback className="rounded-lg">
                    {getUserInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {getFullName(user.firstName, user.lastName)}
                  </span>
                  <span className="truncate text-xs break-words w-full max-w-60">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            {getGroupedItems("top").length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {getGroupedItems("top").map(({ label, icon, action }) => (
                    <DropdownMenuItem key={label} onSelect={action}>
                      {icon}
                      <span className="ml-2">{label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </>
            )}

            {getGroupedItems("main").length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {getGroupedItems("main").map(({ label, icon, action }) => (
                    <DropdownMenuItem key={label} onSelect={action}>
                      {icon}
                      <span className="ml-2">{label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </>
            )}

            {getGroupedItems("bottom").length > 0 && (
              <>
                <DropdownMenuSeparator />
                {getGroupedItems("bottom").map(({ label, icon, action }) => (
                  <DropdownMenuItem key={label} onSelect={action}>
                    {icon}
                    <span className="ml-2">{label}</span>
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
