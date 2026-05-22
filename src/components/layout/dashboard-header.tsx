"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { ThemeToggle } from "./theme-toggle";
import { dashboardRouteMeta } from "./navigation-items";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

function getPageTitle(pathname: string): string {
  return dashboardRouteMeta[pathname]?.title ?? "لوحة التحكم";
}

function getBreadcrumb(pathname: string): BreadcrumbItem[] {
  const labels = dashboardRouteMeta[pathname]?.breadcrumb ?? ["الرئيسية", "لوحة التحكم"];
  return labels.map((label, index) => {
    if (index === 0) {
      return { label, href: "/dashboard" };
    }

    return { label };
  });
}

export function DashboardHeader() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  const breadcrumb = getBreadcrumb(pathname);

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-3 backdrop-blur supports-backdrop-filter:bg-background/80 md:px-4">
      <SidebarTrigger className="shrink-0" />
      <Separator orientation="vertical" className="h-4" />

      <div className="min-w-0">
        <h1 className="truncate text-sm font-semibold text-foreground">{title}</h1>
        <nav aria-label="Breadcrumb" className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          {breadcrumb.map((item, index) => {
            const isLast = index === breadcrumb.length - 1;

            return (
              <div key={`${item.label}-${index}`} className="flex items-center gap-1">
                {item.href && !isLast ? (
                  <Link href={item.href} className="hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-foreground" : undefined}>{item.label}</span>
                )}
                {!isLast ? <ChevronLeft className="size-3" aria-hidden="true" /> : null}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <ThemeToggle />
        {/* <div
          className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground select-none"
          aria-label="حساب المستخدم"
          title="المستخدم الحالي"
        >
          م
        </div> */}
      </div>
    </header>
  );
}
