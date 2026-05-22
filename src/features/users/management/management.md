# User Management Feature

## Status

Complete

## Objective

Admin-only UI to create and manage system users with specific roles (admin / staff).

## Feature Path

`src/features/users/management/`

## Components

- `types.ts` — frontend DTOs, query state, error class
- `api/users-management.api.ts` — API client functions
- `hooks/use-users-list.ts` — paginated list query
- `hooks/use-create-user.ts` — create mutation
- `hooks/use-update-user-status.ts` — status update mutation
- `schemas/create-user.schema.ts` — Zod form validation
- `components/user-badges.tsx` — status and account type badges
- `components/create-user-dialog.tsx` — create user form dialog
- `components/users-management-table.tsx` — paginated user table with status toggle
- `components/users-management-page.tsx` — main page component

## Page

`src/app/(dashboard)/settings/users/page.tsx`

## Navigation

`/settings/users` — enabled in navigation-items.ts
