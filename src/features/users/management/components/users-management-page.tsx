"use client";

import { useState } from "react";
import { useUsersList } from "../hooks/use-users-list";
import { UsersManagementTable } from "./users-management-table";
import { CreateUserDialog } from "./create-user-dialog";

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function UsersManagementPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data, isLoading, error } = useUsersList({ page, pageSize: 10, search });

  const totalPages = data ? Math.ceil(data.total / 10) : 1;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 p-5">
        <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
        <p className="text-sm text-muted-foreground">إنشاء وإدارة حسابات المستخدمين وصلاحياتهم</p>
      </div>

      <div className="flex items-center justify-between gap-4 px-5">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <SearchIcon />
            </span>
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="ابحث بالاسم أو البريد الإلكتروني..."
              className="w-64 rounded-md border border-input bg-background py-2 pr-9 pl-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              dir="rtl"
            />
          </div>
          <button
            type="submit"
            className="rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
          >
            بحث
          </button>
        </form>

        <button
          type="button"
          onClick={() => setCreateDialogOpen(true)}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <PlusIcon />
          مستخدم جديد
        </button>
      </div>

      {error && (
        <div className="mx-5 rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
          حدث خطأ في تحميل البيانات: {error.message}
        </div>
      )}

      <div className="px-5">
        <UsersManagementTable
          items={data?.items ?? []}
          isLoading={isLoading}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <CreateUserDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </div>
  );
}
