# archived-correspondence

## Feature Name

Archived Correspondence Registry

## Purpose

Read-only registry for archived correspondences with secure file preview/download through protected backend streaming endpoints.

## Current Scope

- List archived correspondences only (`status = ARCHIVED`, `deletedAt IS NULL`)
- Detail endpoint for archived correspondence and related files
- Protected preview endpoint for supported types (PDF/JPEG/PNG/WebP)
- Protected download endpoint for all archived files
- No private Blob URL exposure

## Out of Scope

- Any status mutation or archive workflow state change
- Creating archive records
- Auth flow changes
- Final archive workflow changes

## Architecture Compliance

- Route handlers are thin and delegate to service
- Service enforces policy and orchestration
- Prisma queries only in repository
- Shared API response format maintained

## Files Created

- `src/server/modules/archive/archived-correspondence/types.ts`
- `src/server/modules/archive/archived-correspondence/policy.ts`
- `src/server/modules/archive/archived-correspondence/validator.ts`
- `src/server/modules/archive/archived-correspondence/repository.ts`
- `src/server/modules/archive/archived-correspondence/service.ts`
- `src/server/modules/archive/archived-correspondence/archived-correspondence.md`

## Files Modified

- `src/app/api/v1/archive/archived-correspondence/route.ts`
- `src/app/api/v1/archive/archived-correspondence/[id]/route.ts`
- `src/app/api/v1/archive/archived-correspondence/files/[fileId]/preview/route.ts`
- `src/app/api/v1/archive/archived-correspondence/files/[fileId]/download/route.ts`
- `src/components/layout/navigation-items.ts`
- `src/components/layout/dashboard-sidebar.tsx`
- `src/app/(dashboard)/archive/archived-correspondence/page.tsx`
- `src/features/archive/archived-correspondence/*`

## Database Impact

- No schema change
- Read-only queries only

## Backend Status

- Module scaffolded and implemented
- API route wiring complete
- Protected file streaming uses backend fetch with Blob token only on the server

## Frontend Status

- Implemented registry page, filters, detail dialog, file preview, and download actions

## Validation Performed

- `npm run lint -- --max-warnings=0`
- `npm run build`

## Latest Changes

- Implemented ARCHIVED-only list/detail/file-access repository queries
- Added preview mime-type guard in validator
- Added active-user policy enforcement
- Added API routes for list/detail/preview/download
- Added archive navigation entry and registry page
- Added protected preview/download streaming from server routes

## Remaining Issues

- No known code issues; runtime verification still recommended

## Next Safe Step

Run authenticated browser checks for list, detail, preview, and download flows.
