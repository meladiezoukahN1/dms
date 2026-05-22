# layout-shell

## Feature Name

Dashboard Shell — shadcn Sidebar RTL Adaptation

## Purpose

Provide a unified dashboard shell using the new shadcn sidebar system with:

- Arabic RTL-first behavior
- mobile drawer behavior via `SidebarProvider`/`SidebarTrigger`
- grouped navigation for current routes
- route-aware title and breadcrumb in header

## Current Scope

- `DashboardShell` composes `SidebarProvider` + `AppSidebar` + `SidebarInset`
- `AppSidebar` renders grouped Arabic navigation and active state from `navigation-items.ts`
- `AppSidebar` reads real session user via `useSession()` from `next-auth/react` and passes `{ name, email, avatar: null }` to `NavUser`
- `NavUser` shows real authenticated user name/email/initials in the sidebar footer and dropdown
- `NavUser` logout uses `signOut({ callbackUrl: '/login', redirect: true })` from `next-auth/react`
- `NavUser` dropdown menu items for unavailable routes (الملف الشخصي / إعدادات الحساب / الإشعارات) are disabled and non-clickable
- `DashboardHeader` renders `SidebarTrigger`, title, breadcrumb, theme toggle, and user placeholder
- `navigation-items.ts` is the single source for nav groups + route metadata used by sidebar/header
- `SessionProvider` from `next-auth/react` is now wrapped in `src/app/providers.tsx`

## Out of Scope

- Any backend business logic
- Prisma schema and database operations
- Auth/session data model changes
- PDF/scanner/archive workflows
- New dependencies

## Architecture Compliance

- Dashboard layout remains thin in `src/app/(dashboard)/layout.tsx` ✓
- Shared shell components stay under `src/components/layout` ✓
- shadcn sidebar primitives remain in use (`SidebarProvider`, `Sidebar`, `SidebarTrigger`, `SidebarInset`) ✓
- No Prisma/server imports in layout components ✓
- Semantic tokens only (no hardcoded hex colors in shell changes) ✓

## Files Created

- `src/lib/api-client.ts` — central `appFetch` wrapper with 401/403 auto-logout

## Files Modified

- `src/app/(dashboard)/layout.tsx`
- `src/app/providers.tsx` — added `SessionProvider`
- `src/components/layout/navigation-items.ts`
- `src/components/layout/app-sidebar.tsx` — removed hardcoded user, added `useSession()`, `NavUser` now receives real data
- `src/components/layout/nav-user.tsx` — removed fake `/logout` link, removed unused `Link`/`BadgeCheck`/`ShieldCheck` imports, added `signOut`, disabled unavailable route items
- `src/components/layout/dashboard-shell.tsx`
- `src/components/layout/dashboard-header.tsx`
- `src/components/ui/sidebar.tsx`
- `src/components/ui/dropdown-menu.tsx`
- `src/components/layout/layout-shell.md`
- `src/features/dashboard/home/api/dashboard.api.ts` — `appFetch`
- `src/features/archive/final-archive/api/final-archive.api.ts` — `appFetch`
- `src/features/archive/archived-correspondence/api/archived-correspondence.api.ts` — `appFetch`
- `src/features/correspondence/archive-handover/api/archive-handover.api.ts` — `appFetch`
- `src/features/correspondence/digital-generated/create/api/digital-generated.api.ts` — `appFetch`
- `src/features/correspondence/scanned-physical/create/api/scanned-physical.api.ts` — `appFetch`

## Frontend Status

Completed for scope. shadcn sidebar wiring and RTL adaptation are live with route-aware header/breadcrumb and grouped navigation.

## Validation Performed

- `pnpm prisma validate` ✓
- `pnpm prisma generate` ✓
- `pnpm lint --max-warnings=0` ✓
- `pnpm build` ✓
- Boundary checks (no Prisma/layout leaks, no hardcoded colors in shell scope, no random/time keys, no script tags) ✓
- Runtime checks on dashboard + correspondence + archive routes (header, breadcrumb, nav groups, disabled placeholders, theme toggle, sidebar expand/collapse) ✓

## Latest Changes

- Replaced placeholder/sample shadcn sidebar content with real Arabic route groups.
- Added required icons for all real routes and disabled “لاحقًا” settings entries.
- Ensured exact active matching per route to avoid over-activating archive items.
- Moved route title/breadcrumb mapping to `navigation-items.ts` to avoid duplicated nav metadata.
- Refactored `DashboardShell` to use shadcn `SidebarProvider`/`SidebarInset` flow.
- Updated `DashboardHeader` to use `SidebarTrigger` and Arabic breadcrumb.
- Fixed undefined `cn-rtl-flip` usage in shared UI primitives with explicit RTL-safe transforms.
- Fixed missing CSS variables (`--sidebar-width`, `--sidebar-width-icon`) in `SidebarProvider`; this was causing desktop reserved gap width to collapse and main content to render under the fixed sidebar.
- Fixed shell wrapper direction interaction with shadcn gap mechanics; removed forced `flex-row-reverse` so right-side gap reservation aligns with `side="right"` and content ends at sidebar boundary.
- Restored sidebar footer using shadcn footer pattern with user profile block and settings shortcut.

**NavUser + Auth (2026-05-20):**

- Added `SessionProvider` to `src/app/providers.tsx` so `useSession()` is available app-wide.
- `AppSidebar` now uses `useSession()` to read real authenticated user (name, email). Removed hardcoded fake `data.user`.
- `NavUser` dropdown logout replaced with `signOut({ callbackUrl: '/login', redirect: true })`.
- `NavUser` removed broken imports (`BadgeCheck`, `ShieldCheck`, `Link`).
- Unavailable nav items (الملف الشخصي, إعدادات الحساب, الإشعارات) are disabled — no broken links.
- Created `src/lib/api-client.ts` with `appFetch()`: drop-in for `fetch` across protected API clients; auto-triggers `signOut` on 401/403 (excludes `/api/auth/` and `/api/v1/auth/`).
- All 6 protected feature API clients updated to use `appFetch`.

## Remaining Issues

- `/profile`, `/account-settings`, `/notifications` routes don't exist yet — items are disabled in the dropdown.
- Playwright tool viewport remains desktop-sized in this environment, so true handheld drawer UX (390x844 with right-side sheet animation) could not be fully asserted via automated snapshot.

## Next Safe Step

Implement `/profile` and `/account-settings` routes when user management scope is added, then re-enable those dropdown items.
