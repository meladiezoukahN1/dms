# User Management Feature

## Status

In progress

## Objective

Provide an admin-only interface to create and manage system users with specific roles (admin / staff). Also seeds initial test users.

## Credentials (seeded)

| Email           | Password     | Role  |
| --------------- | ------------ | ----- |
| admin@dms.local | Admin@123456 | admin |
| staff@dms.local | Staff@123456 | staff |

## Backend

- `src/server/modules/users/types.ts` — DTOs and query types
- `src/server/modules/users/repository.ts` — Prisma queries
- `src/server/modules/users/policy.ts` — access enforcement (admin only)
- `src/server/modules/users/validator.ts` — Zod validation
- `src/server/modules/users/service.ts` — orchestration

## API Routes

- `GET /api/v1/users` — paginated list with optional search
- `POST /api/v1/users` — create new user
- `PATCH /api/v1/users/[id]/status` — update user status

## Frontend

- `src/features/users/management/` — feature folder
- `src/app/(dashboard)/settings/users/page.tsx` — page

## Role Strategy

Uses existing `accountType: String?` field as role indicator.

- `"admin"` — full system access
- `"staff"` — regular user

## Authorization

Only users with `accountType === "admin"` and `status === "ACTIVE"` can access user management endpoints.
