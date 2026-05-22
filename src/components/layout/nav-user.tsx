"use client";

import {
  Bell,
  ChevronsUpDown,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";
import { signOut } from "next-auth/react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
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

type NavUserProps = {
  user: {
    name: string;
    email: string;
    avatar?: string | null;
  };
};

function getUserInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "م";
  if (parts.length === 1) return parts[0]?.slice(0, 2) ?? "م";

  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`;
}

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar();

  const initials = getUserInitials(user.name);

  return (
    <SidebarMenu dir="rtl">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="h-12 flex-row-reverse justify-start gap-3 text-right data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                ) : null}
                <AvatarFallback className="rounded-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-right text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>

              <ChevronsUpDown className="mr-auto size-4 shrink-0 opacity-70" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg text-right mb-1 xl:mb-5"
            side={isMobile ? "bottom" : "left"}
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex flex-row-reverse items-center gap-2 px-2 py-2 text-right text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="rounded-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-right text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                disabled
                className="flex cursor-not-allowed flex-row-reverse items-center justify-start gap-2 text-right opacity-50"
              >
                <UserRound className="size-4" />
                <span>الملف الشخصي</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                disabled
                className="flex cursor-not-allowed flex-row-reverse items-center justify-start gap-2 text-right opacity-50"
              >
                <Settings className="size-4" />
                <span>إعدادات الحساب</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                disabled
                className="flex cursor-not-allowed flex-row-reverse items-center justify-start gap-2 text-right opacity-50"
              >
                <Bell className="size-4" />
                <span>الإشعارات</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="flex cursor-pointer flex-row-reverse items-center justify-start gap-2 text-right text-destructive focus:text-destructive"
              onSelect={() => {
                void signOut({ callbackUrl: "/login", redirect: true });
              }}
            >
              <LogOut className="size-4" />
              <span>تسجيل الخروج</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}