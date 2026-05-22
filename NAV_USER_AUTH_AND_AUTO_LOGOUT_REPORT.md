# NAV_USER_AUTH_AND_AUTO_LOGOUT_REPORT

## 1. Docs and AGENTS.md Confirmation

- `AGENTS.md` — read ✓
- `docs/ARCHITECTURE.md` — read ✓
- `docs/AI_EXECUTION_RULES.md` — read ✓
- `docs/AUTHORIZATION.md` — read ✓
- `docs/FEATURE_CONTRACT.md` — read ✓
- `docs/UI_SYSTEM.md` — read ✓
- `docs/PERFORMANCE.md` — read ✓
- `docs/DATA_TABLE_CONTRACT.md` — read ✓
- `docs/TEMPLATE_USAGE.md` — read ✓

## 2. Files Inspected

- `AGENTS.md`
- `docs/**/*.md` (all 8 files)
- `src/app/layout.tsx`
- `src/app/providers.tsx`
- `src/app/(dashboard)/layout.tsx`
- `src/components/layout/app-sidebar.tsx`
- `src/components/layout/nav-user.tsx`
- `src/components/layout/dashboard-shell.tsx`
- `src/components/layout/dashboard-header.tsx`
- `src/components/layout/layout-shell.md`
- `src/components/ui/sidebar.tsx`
- `src/components/ui/dropdown-menu.tsx`
- `src/components/ui/avatar.tsx` (via grep)
- `src/lib/auth/auth.ts`
- `src/server/core/auth/get-current-user.ts`
- `src/server/modules/auth/session/service.ts`
- `src/server/modules/auth/session/repository.ts`
- `src/server/modules/auth/session/types.ts`
- `src/app/api/v1/auth/me/route.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/features/dashboard/home/api/dashboard.api.ts`
- `src/features/archive/final-archive/api/final-archive.api.ts`
- `src/features/archive/archived-correspondence/api/archived-correspondence.api.ts`
- `src/features/correspondence/archive-handover/api/archive-handover.api.ts`
- `src/features/correspondence/digital-generated/create/api/digital-generated.api.ts`
- `src/features/correspondence/scanned-physical/create/api/scanned-physical.api.ts`
- `prisma/schema.prisma` (User model — confirmed no avatar field)
- `package.json` (confirmed `next-auth@^4.24.14`)

## 3. Implementation Plan (pre-edit)

**Confirmed findings:**

- NextAuth v4 with JWT strategy; session exposes `{ id, email, name, status }`
- `next-auth/react` already installed and used (`signIn` in login hook)
- `AppSidebar` is `"use client"` → can use `useSession()` directly
- No avatar field in Prisma `User` model → always `null`
- No `/logout`, `/profile`, `/account-settings`, `/notifications` routes exist
- No central `src/lib/api-client.ts` existed — all feature APIs used raw `fetch`
- `SessionProvider` was not in `providers.tsx`

**Plan:**

- A: Add `SessionProvider` to `providers.tsx`; use `useSession()` in `AppSidebar`; pass real `{name, email, avatar: null}` to `NavUser`
- B: Replace `Link href="/logout"` with `signOut()` button in `NavUser`
- C: Create `src/lib/api-client.ts` with `appFetch()` wrapper; update all 6 protected feature API clients
- E: Disable (not link) unavailable route items; remove unused imports; document-level `dir="rtl"` handles dropdown direction

## 4. Files Created

- `src/lib/api-client.ts` — `appFetch()` wrapper with 401/403 auto-logout guard

## 5. Files Modified

- `src/app/providers.tsx` — added `SessionProvider` from `next-auth/react`
- `src/components/layout/app-sidebar.tsx` — removed hardcoded `data.user`; added `useSession()`; replaced `SidebarMenu` footer placeholder with `<NavUser user={navUser} />`
- `src/components/layout/nav-user.tsx` — removed `Link`, `BadgeCheck`, `ShieldCheck` imports; added `signOut`; replaced `/logout` Link with `signOut()` button; disabled unavailable items; removed `dir="rtl"` prop (inherited from html element)
- `src/features/dashboard/home/api/dashboard.api.ts` — `appFetch`
- `src/features/archive/final-archive/api/final-archive.api.ts` — `appFetch`
- `src/features/archive/archived-correspondence/api/archived-correspondence.api.ts` — `appFetch`
- `src/features/correspondence/archive-handover/api/archive-handover.api.ts` — `appFetch`
- `src/features/correspondence/digital-generated/create/api/digital-generated.api.ts` — `appFetch` (both POST endpoints)
- `src/features/correspondence/scanned-physical/create/api/scanned-physical.api.ts` — `appFetch`
- `src/components/layout/layout-shell.md` — tracking file updated

## 6. User Data Source

Source: **NextAuth JWT session** via `useSession()` hook from `next-auth/react`.

- `name` → `session.user.name` (populated from `user.fullName` in `authorize` callback via `authOptions`)
- `email` → `session.user.email`
- `avatar` → always `null` (no avatar field in Prisma `User` model; initials are derived from name automatically by `NavUser` component's `getUserInitials()`)
- Fallback: if name is missing, email prefix is used; if both missing, "المستخدم"

No new backend endpoint needed. No `passwordHash` or sensitive fields exposed.

## 7. NavUser RTL / Logout Behavior

- `DropdownMenuContent` direction inherited from `<html dir="rtl">` set in `src/app/layout.tsx`
- All items use `flex-row-reverse` for RTL icon+label order
- Logout item uses `onSelect` with `signOut({ callbackUrl: '/login', redirect: true })` — not a Link
- Arabic labels present: الملف الشخصي, إعدادات الحساب, الإشعارات, تسجيل الخروج
- Unavailable items (profile, account-settings, notifications) rendered as `disabled` `DropdownMenuItem` with `opacity-50` and `cursor-not-allowed`
- No broken links to non-existent routes remain

## 8. Auto Logout Implementation

**File:** `src/lib/api-client.ts`

```ts
export async function appFetch(input, init?): Promise<Response> {
  const response = await fetch(input, init);
  if (
    (response.status === 401 || response.status === 403) &&
    !isAuthEndpoint(input)
  ) {
    void triggerAutoLogout(); // dynamic import + signOut
  }
  return response;
}
```

- Auth endpoints excluded: `/api/auth/` and `/api/v1/auth/`
- `triggerAutoLogout` dynamically imports `signOut` from `next-auth/react` (safe — only runs client-side; guarded by `typeof window === "undefined"`)
- Callers still receive the response, so existing error UI (e.g., form validation errors on login) is unaffected
- All 6 protected feature API clients now use `appFetch`

## 9. 401/403 Server Behavior

**Unchanged.** Backend APIs continue to return 401/403 when unauthenticated or unauthorized. No change was made to any server module, API route handler, policy, or middleware. The guard is strictly client-side.

## 10. Runtime Test Result

Not performed in this automated session (no local browser session with test credentials available at time of report generation).

**Expected runtime behavior (manual verification steps):**

1. Login as `test-runtime@local.test` / `Test@123456`
2. Open dashboard → sidebar footer shows real name + email + initials
3. Open NavUser dropdown → Arabic RTL alignment, logout visible, no English labels
4. Click "تسجيل الخروج" → session cleared, redirected to /login
5. Attempt dashboard access → redirected to /login (middleware)
6. Expire session cookie / call protected API unauthenticated → auto-logout fires, redirected to /login, no loop

## 11. Build / Lint / Prisma Results

```
npx prisma validate     → ✅ schema valid
npx tsc --noEmit        → ✅ 0 errors
npm run lint --max-warnings=0 → ✅ 0 warnings
npm run build           → ✅ compiled successfully
```

## 12. Boundary Check Results

```
grep passwordHash/hash in frontend dirs → 0 matches ✅
grep href="/logout" in layout/features  → 0 matches ✅
grep Prisma/prisma. in layout/features  → 0 matches ✅
401/403 handling centralized in src/lib/api-client.ts ✅
```

## 13. Remaining Issues

- Routes `/profile`, `/account-settings`, `/notifications` do not exist → items remain disabled in NavUser dropdown until those features are implemented.
- Avatar field absent from Prisma `User` model → initials always used. If avatar is needed in future, a schema migration and session mapping update will be required.
- Runtime verification against `test-runtime@local.test` was not performed in this session; manual check recommended.
