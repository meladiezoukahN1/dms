export interface NavItem {
  label: string;
  href?: string;
  iconKey?:
    | "home"
    | "digital"
    | "scanned"
    | "handover"
    | "finalArchive"
    | "archivedRegistry"
    | "users"
    | "permissions";
  disabled?: boolean;
  comingSoon?: boolean;
}

export interface NavGroup {
  label: string;
  groupKey: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    label: "الرئيسية",
    groupKey: "home",
    items: [{ label: "الرئيسية", href: "/dashboard", iconKey: "home" }],
  },
  {
    label: "المراسلات",
    groupKey: "correspondence",
    items: [
      {
        label: "إنشاء مراسلة رقمية",
        href: "/correspondence/digital-generated/create",
        iconKey: "digital",
      },
      {
        label: "إنشاء مراسلة ممسوحة",
        href: "/correspondence/scanned-physical/create",
        iconKey: "scanned",
      },
      {
        label: "إحالة المراسلات للأرشفة",
        href: "/correspondence/archive-handover",
        iconKey: "handover",
      },
      {
        label: "سجل المراسلات",
        disabled: true,
        comingSoon: true,
      }
    ],
  },
  {
    label: "الأرشفة",
    groupKey: "archive",
    items: [
      {
        label: "الأرشفة النهائية",
        href: "/archive/final-archive",
        iconKey: "finalArchive",
      },
      {
        label: "سجل المراسلات المؤرشفة",
        href: "/archive/archived-correspondence",
        iconKey: "archivedRegistry",
      },
    ],
  },
  {
    label: "الإعدادات",
    groupKey: "settings",
    items: [
      {
        label: "إدارة المستخدمين",
        href: "/settings/users",
        iconKey: "users",
      },
      {
        label: "الصلاحيات لاحقًا",
        iconKey: "permissions",
        disabled: true,
        comingSoon: true,
      },
    ],
  },
];

export const topNavItems: NavItem[] = navGroups.find((group) => group.groupKey === "home")?.items ?? [];

export interface DashboardRouteMeta {
  title: string;
  breadcrumb: string[];
}

export const dashboardRouteMeta: Record<string, DashboardRouteMeta> = {
  "/dashboard": {
    title: "الرئيسية",
    breadcrumb: ["الرئيسية"],
  },
  "/correspondence/digital-generated/create": {
    title: "إنشاء مراسلة رقمية",
    breadcrumb: ["الرئيسية", "المراسلات", "إنشاء مراسلة رقمية"],
  },
  "/correspondence/scanned-physical/create": {
    title: "إنشاء مراسلة ممسوحة",
    breadcrumb: ["الرئيسية", "المراسلات", "إنشاء مراسلة ممسوحة"],
  },
  "/correspondence/archive-handover": {
    title: "إحالة المراسلات للأرشفة",
    breadcrumb: ["الرئيسية", "المراسلات", "إحالة المراسلات للأرشفة"],
  },
  "/archive/final-archive": {
    title: "الأرشفة النهائية",
    breadcrumb: ["الرئيسية", "الأرشفة", "الأرشفة النهائية"],
  },
  "/archive/archived-correspondence": {
    title: "سجل المراسلات المؤرشفة",
    breadcrumb: ["الرئيسية", "الأرشفة", "سجل المراسلات المؤرشفة"],
  },
  "/settings/users": {
    title: "إدارة المستخدمين",
    breadcrumb: ["الرئيسية", "الإعدادات", "إدارة المستخدمين"],
  },
};
