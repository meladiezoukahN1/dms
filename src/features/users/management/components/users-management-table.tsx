"use client";

import { useState } from "react";
import type { UserDto, UserStatus } from "../types";
import { AccountTypeBadge, UserStatusBadge } from "./user-badges";
import { useUpdateUserStatus } from "../hooks/use-update-user-status";

interface UsersManagementTableProps {
  items: UserDto[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const NEXT_STATUS_MAP: Record<UserStatus, { label: string; next: UserStatus } | null> = {
  ACTIVE: { label: "إيقاف", next: "SUSPENDED" },
  SUSPENDED: { label: "تفعيل", next: "ACTIVE" },
  DEACTIVATED: null,
};

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export function UsersManagementTable({
  items,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}: UsersManagementTableProps) {
  const { mutate: updateStatus, isPending } = useUpdateUserStatus();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleStatusToggle = (user: UserDto) => {
    const action = NEXT_STATUS_MAP[user.status as UserStatus];
    if (!action) return;
    setPendingId(user.id);
    updateStatus(
      { id: user.id, payload: { status: action.next } },
      {
        onSettled: () => setPendingId(null),
        onError: (err) => alert(`خطأ: ${err.message}`),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">جاري التحميل...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">لا يوجد مستخدمون</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-right text-sm font-medium">الاسم الكامل</th>
                <th className="px-4 py-3 text-right text-sm font-medium">البريد الإلكتروني</th>
                <th className="px-4 py-3 text-right text-sm font-medium">نوع الحساب</th>
                <th className="px-4 py-3 text-right text-sm font-medium">الحالة</th>
                <th className="px-4 py-3 text-right text-sm font-medium">تاريخ الإنشاء</th>
                <th className="px-4 py-3 text-right text-sm font-medium">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((user) => {
                const action = NEXT_STATUS_MAP[user.status as UserStatus];
                return (
                  <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm font-medium">{user.fullName}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground" dir="ltr">{user.email}</td>
                    <td className="px-4 py-3">
                      <AccountTypeBadge accountType={user.accountType} />
                    </td>
                    <td className="px-4 py-3">
                      <UserStatusBadge status={user.status as UserStatus} />
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString("ar-SA")}
                    </td>
                    <td className="px-4 py-3">
                      {action ? (
                        <button
                          type="button"
                          onClick={() => handleStatusToggle(user)}
                          disabled={isPending && pendingId === user.id}
                          className="rounded-md border border-border px-3 py-1 text-xs font-medium hover:bg-muted disabled:opacity-50"
                        >
                          {isPending && pendingId === user.id ? "..." : action.label}
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-40"
          >
            <ChevronRightIcon />
            السابق
          </button>
          <span className="text-sm text-muted-foreground">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-40"
          >
            التالي
            <ChevronLeftIcon />
          </button>
        </div>
      )}
    </div>
  );
}
