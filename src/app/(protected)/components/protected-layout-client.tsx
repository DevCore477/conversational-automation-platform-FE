"use client";

import { usePathname } from "next/navigation";

import { ModeToggle } from "@/components/ui/mode-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { AppSidebar } from "./app-sidebar";
import { UserNav } from "./user-nav";

interface ProtectedLayoutClientProps {
  children: React.ReactNode;
}
/**
 * When on /conversation-flow/[id] (flow builder), hide the main sidebar (Dashboard, Make a Call, etc.)
 * so the builder uses the full viewport. On all other routes, show the normal layout.
 */
export function ProtectedLayoutClient({ children }: ProtectedLayoutClientProps) {

  const pathname = usePathname();
  const isFlowBuilder = pathname?.match(/^\/conversation-flow\/[^/]+$/);

  if (isFlowBuilder) {
    return (
      <div className="h-screen w-screen overflow-hidden flex flex-col">
        {children}
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar/>
      <SidebarInset className="overflow-x-hidden">
        <header className="flex sticky top-0 z-30 h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-sidebar">
          <div className="flex w-full items-center justify-between gap-0 pl-4 lg:pr-2">
            <div className="flex w-full justify-between items-center">
              <SidebarTrigger className="-ml-1" />
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <ModeToggle />
                </div>
                <UserNav />
              </div>
            </div>
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        <main className="flex-1 bg-surface-soft/8 dark:bg-[#333333]/50">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
