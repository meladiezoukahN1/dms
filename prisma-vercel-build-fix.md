# Prisma Vercel Build Fix

## Purpose

Fix Vercel production builds failing at TypeScript check with:

- Module "@prisma/client" has no exported member "PrismaClient"

## Root Cause

In clean CI installs, Prisma Client generation may be skipped or Prisma CLI may be unavailable during dependency lifecycle. This leaves `@prisma/client` declarations without a generated client export surface at type-check time.

In Vercel install phase specifically, `postinstall` ran `prisma generate` before `DATABASE_URL` was available to Prisma config resolution, which caused an early install failure.

## Changes Applied

- Moved `prisma` from `devDependencies` to `dependencies` in package manifest.
- Added `postinstall` script to always run `prisma generate` after install.
- Updated lockfile to reflect dependency movement.
- Updated `prisma.config.ts` datasource URL resolution to use `process.env.DATABASE_URL` with a safe local fallback for generate-time config loading.

## Files Modified

- `package.json`
- `package-lock.json`
- `prisma.config.ts`

## Validation Performed

- `npm install --package-lock-only` executed successfully.
- `postinstall` executed and generated Prisma Client successfully.

## Expected Vercel Outcome

- During `npm install`, `postinstall` runs `prisma generate`.
- `prisma generate` no longer crashes if `DATABASE_URL` is not injected at that exact install step.
- Type-check stage can resolve `PrismaClient` from `@prisma/client`.
- Build no longer fails at `prisma/seed.ts` import.

## Notes

- This is safe for local development and CI.
- No runtime behavior changes were introduced.
