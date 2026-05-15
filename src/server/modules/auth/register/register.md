# Register

## Purpose

Create new user accounts through public registration with secure password hashing.

## Current Scope

- Validate register payload.
- Hash submitted password.
- Persist user with `PENDING` status.
- Record audit event for registration.

## Out of Scope

- Registration UI redesign.
- Account approval workflow changes.
- Additional identity verification flows.

## Architecture Compliance

- App routes: src/app/api/v1/auth/register
- Frontend feature path: src/features/auth/register
- Backend module path: src/server/modules/auth/register
- Shared components used: None
- Prisma models touched: User, AuditLog

## Files Created

- src/server/modules/auth/register/register.md

## Files Modified

- src/server/modules/auth/register/repository.ts
- prisma/schema.prisma

## Database Impact

- Removed duplicate credential storage write (`password`) in registration repository.
- Registration now writes `passwordHash` only.

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

- Removed legacy `password` write from `db.user.create`.
- Kept `PENDING` status behavior unchanged.

## Remaining Issues

- Apply and run Prisma migration strategy in deployment pipeline before production rollout.

## Next Safe Step

- Execute validation and grep checks and confirm no residual credential duplication paths.
