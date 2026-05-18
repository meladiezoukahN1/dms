"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navGroups, topNavItems } from "./navigation-items";

interface DashboardSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function HomeIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function ArchiveIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="21 8 21 21 3 21 3 8" />
      <rect x="1" y="3" width="22" height="5" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

const groupIconMap: Record<string, React.ReactNode> = {
  correspondence: <MailIcon />,
  archive: <ArchiveIcon />,
  settings: <SettingsIcon />,
};

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Brand */}
      <div className="flex items-center h-14 px-4 border-b border-border shrink-0">
        <span className="text-sm font-bold text-primary leading-tight">
          نظام إدارة
          <br />
          <span className="text-xs font-semibold text-muted-foreground">المراسلات الرسمية</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {/* Top-level items */}
        {topNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href!}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <HomeIcon />
            {item.label}
          </Link>
        ))}

        {/* Grouped items */}
        {navGroups.map((group) => (
          <div key={group.groupKey} className="pt-4">
            <div className="flex items-center gap-2 px-3 mb-1">
              <span className="text-muted-foreground opacity-70">
                {groupIconMap[group.groupKey]}
              </span>
              <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {group.label}
              </span>
            </div>

            <div className="space-y-0.5">
              {group.items.map((item, idx) =>
                item.disabled ? (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-2 rounded-md opacity-40 cursor-not-allowed select-none"
                  >
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    {item.comingSoon && (
                      <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-sm leading-tight">
                        لاحقًا
                      </span>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href!}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}

export function DashboardSidebar({ mobileOpen, onMobileClose }: DashboardSidebarProps) {
  return (
    <>
      {/* Desktop sidebar — always visible on md+ */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-card border-e border-border">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-foreground/20 md:hidden"
            onClick={onMobileClose}
            aria-hidden="true"
          />
          <aside className="fixed top-0 right-0 h-full w-64 z-50 flex flex-col bg-card border-e border-border shadow-xl md:hidden">
            <SidebarContent onNavigate={onMobileClose} />
          </aside>
        </>
      )}
    </>
  );
}
