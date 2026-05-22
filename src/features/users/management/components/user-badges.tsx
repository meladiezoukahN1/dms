"use client";

import type { UserStatus } from "../types";

const STATUS_MAP: Record<UserStatus, { label: string; className: string }> = {
  ACTIVE: { label: "نشط", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  SUSPENDED: { label: "موقوف", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  DEACTIVATED: { label: "معطل", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
};

const ACCOUNT_TYPE_MAP: Record<string, { label: string; className: string }> = {
  admin: { label: "مدير", className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
  staff: { label: "موظف", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
};

interface UserStatusBadgeProps {
  status: UserStatus;
}

interface AccountTypeBadgeProps {
  accountType: string | null;
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const config = STATUS_MAP[status] ?? { label: status, className: "bg-muted text-muted-foreground" };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}

export function AccountTypeBadge({ accountType }: AccountTypeBadgeProps) {
  if (!accountType) return <span className="text-muted-foreground text-xs">—</span>;
  const config = ACCOUNT_TYPE_MAP[accountType] ?? { label: accountType, className: "bg-muted text-muted-foreground" };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
