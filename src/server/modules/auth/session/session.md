# Session

## Purpose

Resolve current authenticated user from NextAuth session and return safe user profile for protected backend APIs.

## Current Scope

- Read authenticated user id from NextAuth server session.
- Enforce authenticated access for protected routes.
- Load current user from repository and return safe fields.

## Out of Scope

- Login flow changes.
- JWT/session callback shape changes.
- Role or permission model changes.

## Architecture Compliance

- Module path: src/server/modules/auth/session
- Flow: route.ts -> service.ts -> policy.ts -> repository.ts
- Prisma access only in repository.ts

## Files Created

- src/server/modules/auth/session/session.md

## Files Modified

- src/server/core/auth/get-current-user.ts
- src/server/modules/auth/session/service.ts
- src/app/api/v1/auth/me/route.ts
- src/server/modules/auth/session/session.md

## Database Impact

- None.

## Backend Status

- Complete for current scope.

## Frontend Status

- Not applicable.

## Validation Performed

- Pending runtime verification and build gates in this task.

## Latest Changes

### 2026-05-18

- Relaxed current-user helper to require only session user id.
- Kept safe optional fields (email/name/status) without trusting them for authentication.
- Added request-scoped fallback to resolve session via NextAuth `/api/auth/session` using forwarded cookies when direct `getServerSession`/JWT token decode is unavailable in App Router handlers.
- Updated session service and protected routes to pass route request into centralized current-user resolution.

## Remaining Issues

- None known inside this module.

## Next Safe Step

- Run end-to-end auth-session checks on /api/auth/session and protected business APIs.
