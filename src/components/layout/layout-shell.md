# layout-shell

## Feature Name

Dashboard Shell — Sidebar, Header, and Dark Mode

## Purpose

Provides the shared layout shell for all dashboard routes. Includes:

- Collapsible sidebar with navigation groups
- Sticky header with page title, theme toggle, and user placeholder
- Class-based dark mode (html.dark) with localStorage persistence and system preference detection

## Current Scope

- `DashboardShell` — client wrapper that owns mobile sidebar state
- `DashboardSidebar` — desktop always-visible + mobile overlay sidebar
- `DashboardHeader` — sticky header with theme toggle, page title area, mobile trigger
- `ThemeToggle` — client theme button that persists preference to localStorage
- `navigation-items.ts` — navigation data (server-safe, no client marker)
- CSS dark mode variables under `html.dark` in globals.css
- Inline theme init script in root layout `<head>` to prevent FOUC

## Out of Scope

- Scanner, archive, and PDF generation features
- Correspondence business logic
- Auth logic
- Prisma schema
- API routes
- New npm dependencies
- User profile page or real user data in the header

## Architecture Compliance

- Sidebar and layout components live in `src/components/layout/` ✓
- Dashboard layout (`src/app/(dashboard)/layout.tsx`) is thin — imports DashboardShell only ✓
- No Prisma/server imports in layout components ✓
- No hardcoded hex colors — all semantic tokens from globals.css ✓
- Client components used only where required (state, hooks, localStorage) ✓
- Server layout (`layout.tsx`) and navigation data (`navigation-items.ts`) have no client code ✓

## Files Created

- `src/components/layout/navigation-items.ts`
- `src/components/layout/theme-toggle.tsx`
- `src/components/layout/dashboard-sidebar.tsx`
- `src/components/layout/dashboard-header.tsx`
- `src/components/layout/dashboard-shell.tsx`
- `src/components/layout/layout-shell.md` (this file)

## Files Modified

- `src/app/globals.css` — replaced `@media (prefers-color-scheme: dark) { :root {} }` with `html.dark {}` for class-based dark mode
- `src/app/layout.tsx` — added `<head>` with inline theme init script
- `src/app/(dashboard)/layout.tsx` — now wraps children in `<DashboardShell>`
- `src/components/layout/index.ts` — exports all layout components

## Frontend Status

Complete. All components implemented and wired.

## Validation Performed

- `npx prisma validate` — ✅ PASS (schema valid)
- `npx prisma generate` — ✅ PASS
- `npm run lint -- --max-warnings=0` — ✅ PASS (0 errors, 0 warnings)
- `npm run build` — ✅ PASS (all 16 routes compiled, 0 TS errors)
- Boundary: no server/Prisma imports in layout — ✅ CLEAN
- Boundary: no hardcoded hex colors — ✅ CLEAN
- Runtime smoke test: /dashboard → 200, /correspondence/digital-generated/create → 200
- HTML checks: shell, sidebar, theme script, RTL, primary color, nav link — all ✅

## Latest Changes

- Initial implementation of full dashboard shell
- RTL-aware sidebar (right-side on desktop, right-side overlay on mobile)
- Class-based dark mode: `html.dark` in globals.css, init script in layout head
- Active route highlighting via `usePathname()`
- Disabled/coming-soon nav items rendered with opacity and "لاحقًا" badge
- Mobile sidebar overlay using fixed positioning (no Sheet dependency needed)
- ThemeToggle shows correct icon after mount (avoids SSR mismatch)
- A4 preview protected: lives in iframe srcDoc, unaffected by html.dark class

## Remaining Issues

- User area in header is a placeholder ("م" initial). Real user data integration pending auth session.
- Page title map is static; future pages must be added to `pageTitles` in `dashboard-header.tsx`.

## Next Safe Step

Integrate real session user data into the header user area (via `useSession` from next-auth/react).
