export interface NavItem {
  label: string;
  href?: string;
  disabled?: boolean;
  comingSoon?: boolean;
}

export interface NavGroup {
  label: string;
  groupKey: string;
  items: NavItem[];
}

export const topNavItems: NavItem[] = [
  { label: "الرئيسية", href: "/dashboard" },
];

export const navGroups: NavGroup[] = [
  {
    label: "المراسلات",
    groupKey: "correspondence",
    items: [
      {
        label: "إنشاء مراسلة رقمية",
        href: "/correspondence/digital-generated/create",
      },
      {
        label: "مراسلات واردة ممسوحة",
        disabled: true,
        comingSoon: true,
      },
      {
        label: "سجل المراسلات",
        disabled: true,
        comingSoon: true,
      },
    ],
  },
  {
    label: "الأرشفة",
    groupKey: "archive",
    items: [
      {
        label: "الأرشيف",
        disabled: true,
        comingSoon: true,
      },
    ],
  },
  {
    label: "الإعدادات",
    groupKey: "settings",
    items: [
      {
        label: "المستخدمون",
        disabled: true,
        comingSoon: true,
      },
      {
        label: "الصلاحيات",
        disabled: true,
        comingSoon: true,
      },
    ],
  },
];
