# Password Reset

## Purpose

Allow users to reset passwords through OTP verification and secure password hash updates.

## Current Scope

- Forgot password request with OTP issuance.
- OTP verification.
- Reset password with bcrypt hashing.
- Audit logging for reset events.

## Out of Scope

- Password reset UI redesign.
- MFA extension.
- Scanner/email provider redesign.

## Architecture Compliance

- App routes: src/app/api/v1/auth/forgot-password, src/app/api/v1/auth/verify-reset-otp, src/app/api/v1/auth/reset-password
- Frontend feature path: src/features/auth/reset-password, src/features/auth/forgot-password
- Backend module path: src/server/modules/auth/password-reset
- Shared components used: None
- Prisma models touched: User, PasswordResetToken, AuditLog

## Files Created

- src/server/modules/auth/password-reset/password-reset.md

## Files Modified

- src/server/modules/auth/password-reset/repository.ts
- prisma/schema.prisma

## Database Impact

- Password reset now updates `passwordHash` only.
- Removed legacy `password` nulling update.

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

- Removed legacy `password` update from reset transaction.
- Kept reset flow and status policy behavior unchanged.

## Remaining Issues

- Apply and run Prisma migration strategy in deployment pipeline before production rollout.

## Next Safe Step

- Execute validation and grep checks and verify end-to-end auth behavior in integration tests.
