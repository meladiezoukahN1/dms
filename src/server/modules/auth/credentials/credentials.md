# Credentials

## Purpose

Authenticate users using email and password with status-based login restrictions.

## Current Scope

- Validate login payload.
- Fetch user credential data through repository.
- Authenticate using bcrypt against `passwordHash` only.
- Return safe authenticated user session payload.

## Out of Scope

- Registration flows.
- Password reset UX changes.
- Role/permission expansion.

## Architecture Compliance

- App routes: src/app/api/auth/[...nextauth]/route.ts and versioned auth endpoints
- Frontend feature path: src/features/auth/login
- Backend module path: src/server/modules/auth/credentials
- Shared components used: None
- Prisma models touched: User

## Files Created

- src/server/modules/auth/credentials/credentials.md

## Files Modified

- src/server/modules/auth/credentials/repository.ts
- src/server/modules/auth/credentials/service.ts
- src/server/modules/auth/credentials/types.ts
- prisma/schema.prisma

## Database Impact

- Removed legacy `User.password` field usage from credentials flow.
- Authentication now depends on `User.passwordHash` only.

## Backend Status

- Complete

## Frontend Status

- Not started

## Validation Performed

- npx prisma validate: PASS
- npx prisma generate: PASS
- npx tsc --noEmit: PASS
- npm run lint -- --max-warnings=0: PASS

## Latest Changes

### 2026-05-15

- Removed legacy credential fallback mapping and type.
- Updated authentication to compare only with `passwordHash`.

## Remaining Issues

- Apply and run Prisma migration strategy in deployment pipeline before production rollout.

## Next Safe Step

- Execute validation and grep checks, then prepare migration rollout plan for dropping `User.password` in deployed databases.
