"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Archive,
  FileText,
  Files,
  FolderArchive,
  FolderInput,
  Home,
  LayoutDashboard,
  ScanLine,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";

import { NavUser } from "@/components/layout/nav-user"

import { navGroups } from "@/components/layout/navigation-items";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const iconMap = {
  home: LayoutDashboard,
  digital: FileText,
  scanned: ScanLine,
  handover: FolderInput,
  finalArchive: Archive,
  archivedRegistry: FolderArchive,
  users: Users,
  permissions: ShieldCheck,
} as const;

function isActive(pathname: string, href?: string): boolean {
  if (!href) return false;
  return pathname === href;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const sessionUser = session?.user;
  const navUser = {
    name: sessionUser?.name ?? sessionUser?.email?.split("@")[0] ?? "المستخدم",
    email: sessionUser?.email ?? "",
    avatar: null as string | null,
  };

  return (
    <Sidebar side="right" variant="inset" {...props}>
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href="/dashboard" className="text-right">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Home className="size-4" />
                </div>
                <div className="grid flex-1 text-right text-sm leading-tight">
                  <span className="truncate font-semibold">نظام إدارة المراسلات</span>
                  <span className="truncate text-xs text-sidebar-foreground/70">لوحة التحكم</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => {
          const groupIsActive = group.items.some((item) => isActive(pathname, item.href));

          return (
            <SidebarGroup key={group.groupKey}>
              <SidebarGroupLabel
                className={cn(
                  "justify-end px-2 text-right text-xs tracking-normal",
                  groupIsActive && "text-sidebar-foreground"
                )}
              >
                {group.label}
              </SidebarGroupLabel>

              <SidebarMenu>
                {group.items.map((item) => {
                  const itemIsActive = isActive(pathname, item.href);
                  const Icon = item.iconKey ? iconMap[item.iconKey] : Files;

                  if (item.disabled || !item.href) {
                    return (
                      <SidebarMenuItem key={`${group.groupKey}-${item.label}`}>
                        <SidebarMenuButton
                          aria-disabled="true"
                          className="justify-end text-right opacity-55"
                          tooltip={item.label}
                        >
                          <span className="ms-2 rounded-sm bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                            لاحقًا
                          </span>
                          <span className="truncate">{item.label}</span>
                          <Icon className="size-4 text-sidebar-foreground/70" />
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  }

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={itemIsActive}
                        tooltip={item.label}
                        className="justify-end text-right"
                      >
                        <Link href={item.href}>
                          <span className="truncate">{item.label}</span>
                          <Icon className="size-4" />
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <NavUser user={navUser} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
