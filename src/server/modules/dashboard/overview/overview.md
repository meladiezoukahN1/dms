# Dashboard Overview Module

## Purpose

Backend module that provides aggregated dashboard statistics including correspondence counts, metrics, monthly trends, status distributions, recent items, and archive progress data.

## Scope

- Fetch and aggregate correspondence statistics
- Calculate derived metrics (completion percentages, trends)
- Return structured DTOs for frontend consumption
- Enforce authorization policy for dashboard access

## Out of Scope

- Detailed correspondence editing
- Archive workflow execution
- User authentication (handled by SessionService)
- Audit logging for views (read-only operation)

## Architecture Compliance

✅ Service/Repository pattern enforced
✅ Prisma confined to repository.ts only  
✅ DTOs returned (no Prisma models exposed)
✅ Policy authorization required
✅ API route kept thin
✅ No business logic in routes

## Files Created

### Backend Module

- `src/server/modules/dashboard/overview/types.ts` – DTOs
- `src/server/modules/dashboard/overview/repository.ts` – Prisma queries (8 methods)
- `src/server/modules/dashboard/overview/service.ts` – Orchestration
- `src/server/modules/dashboard/overview/validator.ts` – Input validation (placeholder)
- `src/server/modules/dashboard/overview/policy.ts` – Authorization checks

### API Route

- `src/app/api/v1/dashboard/overview/route.ts` – GET endpoint

## Files Modified

- None

## Database Impact

✅ No schema changes
✅ No migrations required
✅ Uses existing indices on Correspondence and related tables

## Metrics Implemented

| Metric                | Source         | Query                                                                                                   |
| --------------------- | -------------- | ------------------------------------------------------------------------------------------------------- |
| Total Correspondences | Correspondence | COUNT(\*) WHERE deletedAt IS NULL                                                                       |
| Digital Generated     | Correspondence | COUNT(\*) WHERE sourceType='DIGITAL_GENERATED' AND deletedAt IS NULL                                    |
| Scanned Physical      | Correspondence | COUNT(\*) WHERE sourceType='SCANNED_PHYSICAL' AND deletedAt IS NULL                                     |
| Pending Archive       | Correspondence | COUNT(\*) WHERE status='ARCHIVE_PENDING' AND deletedAt IS NULL                                          |
| Archived              | Correspondence | COUNT(\*) WHERE status='ARCHIVED' AND deletedAt IS NULL                                                 |
| Today Created         | Correspondence | COUNT(\*) WHERE DATE(createdAt) = TODAY AND deletedAt IS NULL                                           |
| Month Created         | Correspondence | COUNT(\*) WHERE MONTH(createdAt) = MONTH(NOW()) AND YEAR(createdAt) = YEAR(NOW()) AND deletedAt IS NULL |
| Archive %             | Calculated     | (archived / (archived + pending)) \* 100                                                                |
| Monthly Data          | Correspondence | Grouped by month, sourceType                                                                            |
| Status Distribution   | Correspondence | GROUP BY status, COUNT(\*)                                                                              |

## Backend Status

✅ Repository implemented (8 data access methods)
✅ Service layer implemented (orchestrates queries)
✅ Policy enforced (checks user.status === ACTIVE)
✅ Validator created (placeholder for future filters)
✅ API route thin (calls service, applies policy)
✅ DTOs defined (all response types)

## Frontend Status

- See: `src/features/dashboard/home/dashboard-home.md`

## Validation Performed

- [x] Prisma model relationships verified
- [x] Enum values match schema (sourceType, status)
- [x] Soft delete rule applied (deletedAt IS NULL)
- [x] Date calculations use JavaScript Date for consistency
- [x] Percentage calculation handles zero division

## Latest Changes

- Initial implementation of dashboard overview backend module
- Created service/repository/policy/validator pattern
- Implemented GET /api/v1/dashboard/overview endpoint

## Remaining Issues

- None known at backend level

## Next Safe Step

1. Frontend integration via React Query
2. Build and typecheck validation
3. Runtime testing with sample data
