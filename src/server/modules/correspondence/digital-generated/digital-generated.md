# Digital-Generated Correspondence Feature

## Feature Name

Digital-Generated Correspondence Backend Foundation

## Purpose

Implement backend infrastructure for creating and managing correspondence that originates from digital sources (DIGITAL_GENERATED sourceType). This is the first phase of a multi-phase correspondence management system with planned support for scanned physical documents and imported files in future phases.

## Current Scope

- Backend module: DIGITAL_GENERATED correspondence creation and real PDF generation flow
- Operations:
  - Create DRAFT correspondence with metadata
  - Load correspondence and verify it is eligible for PDF generation
  - Render correspondence to Arabic/RTL HTML template
  - Generate PDF with DocRaptor provider
  - Upload generated PDF to Vercel Blob
  - Persist StoredFile + CorrespondenceFile + status transition atomically
  - Audit logging on all mutations
  - Authorization enforcement via policies
  - Workflow state machine (DRAFT → GENERATED)
- Storage: Vercel Blob storage for generated PDFs
- PDF Generation: Implemented via DocRaptor using native fetch
- No frontend UI or components

## Out of Scope

- Scanned physical document workflows
- Archive flows (future phase)
- Approval workflows (future phase)
- Document scanner integration
- Bulk operations
- Frontend UI/components
- Email notifications
- Document signing/stamping (future phases)
- New PDF dependencies

## Architecture Compliance

✅ Uses hybrid architecture (src/server/modules for backend)
✅ Service/Repository/Validator/Policy/Workflow pattern
✅ All Prisma access isolated in repository.ts
✅ Validator uses Zod with Arabic error messages
✅ Policy enforces authorization (ACTIVE user required, creator-only PDF generation)
✅ Workflow enforces state transitions (DRAFT → GENERATED only)
✅ Transaction-based database writes with audit logging for create-draft flow
✅ Vercel Blob storage abstraction added
✅ Error handling via AppError/ValidationError/ConflictError
✅ API routes thin; service handles business logic
✅ Follows existing auth module patterns exactly

## Files Created

### Backend Module

- src/server/modules/correspondence/digital-generated/types.ts
- src/server/modules/correspondence/digital-generated/validator.ts
- src/server/modules/correspondence/digital-generated/policy.ts
- src/server/modules/correspondence/digital-generated/workflow.ts
- src/server/modules/correspondence/digital-generated/repository.ts
- src/server/modules/correspondence/digital-generated/service.ts

### Storage Infrastructure

- src/lib/storage/storage.types.ts
- src/lib/storage/vercel-blob-storage.ts
- src/lib/storage/storage-client.ts

### API Routes

- src/app/api/v1/correspondence/digital-generated/route.ts (POST create draft)
- src/app/api/v1/correspondence/digital-generated/[id]/generate-pdf/route.ts (POST generate PDF)

### Feature Tracking

- src/server/modules/correspondence/digital-generated/digital-generated.md (this file)

## Files Modified

- src/lib/storage/storage-client.ts
- src/lib/storage/storage.types.ts
- src/lib/storage/vercel-blob-storage.ts
- src/server/modules/correspondence/digital-generated/repository.ts
- src/server/modules/correspondence/digital-generated/service.ts
- src/app/api/v1/correspondence/digital-generated/route.ts
- src/app/api/v1/correspondence/digital-generated/[id]/generate-pdf/route.ts
- package.json
- package-lock.json
- src/server/modules/correspondence/digital-generated/digital-generated.md

## Database Impact

Uses exclusively existing Prisma models (no schema changes required):

- Correspondence model (sourceType DIGITAL_GENERATED, status DRAFT/GENERATED)
- DocumentTemplate model (for form schema and layout)
- StoredFile model (abstract file storage)
- CorrespondenceFile junction table (FilePurpose.GENERATED_PDF links)
- AuditLog model (CREATE, GENERATE_PDF actions)

Vercel Blob is the selected storage provider for future generated PDFs.

All operations transactional and audit-logged.

## Backend Status

✅ **COMPLETE**

- [x] Type definitions (CreateDraftInput, CreateDraftOutput, GeneratePdfInput, GeneratePdfOutput)
- [x] Validator module (Zod schemas, Arabic error messages)
- [x] Policy module (authorization checks for create/generate)
- [x] Workflow module (state machine DRAFT → GENERATED)
- [x] Repository module (transaction handling, audit logging, file linking)
- [x] Service module (orchestration, validation, policy, workflow, business logic)
- [x] API route: POST /api/v1/correspondence/digital-generated (create draft)
- [x] API route: POST /api/v1/correspondence/digital-generated/[id]/generate-pdf (generate PDF)
- [x] PDF stub removed
- [x] Vercel Blob storage abstraction added
- [x] PDF generation implemented with DocRaptor (native fetch)
- [x] Arabic/RTL HTML template renderer for official correspondence
- [x] Atomic transaction for StoredFile + CorrespondenceFile + GENERATED status
- [x] All mutations produce AuditLog entries (CREATE, GENERATE_PDF actions)

## Frontend Status

🚫 **NOT APPLICABLE**

No frontend UI, components, or hooks. Backend API only. Frontend development deferred to future phase.

## Validation Performed

- [x] TypeScript strict mode compilation
- [x] ESLint no-warnings validation
- [x] Prisma schema compatibility (no schema changes required)
- [x] Service/Repository/Validator/Policy/Workflow pattern consistency
- [x] Audit logging on all database mutations
- [x] Error handling coverage (AppError, ValidationError, policy enforcement)
- [x] Authorization policy enforcement (user status checks, creator validation)
- [x] Workspace cleanliness (no modified unrelated files)

## Latest Changes

**Contract Alignment Update:**

- Updated backend validator to accept `direction` (required: OUTGOING | INTERNAL only, no INCOMING)
- Updated backend validator to accept `correspondenceDate` (optional)
- Updated backend repository to persist `direction` from frontend input (no longer hardcoded)
- Updated backend repository to persist `correspondenceDate` from frontend input (optional)
- Frontend now sends `direction` and `correspondenceDate` in create-draft payload
- Backend remains server-controlled for `sourceType: DIGITAL_GENERATED` and `status: DRAFT`
- DocRaptor provider integrated for real PDF generation
- Arabic/RTL template renderer added for official correspondence format
- Generated PDFs now upload to Vercel Blob and persist atomically to database

**Auth Session Propagation Fix (Business APIs):**

- Updated protected digital-generated API routes to use centralized `SessionService.getCurrentSessionUser()`.
- Session resolution now receives the route request and uses centralized current-user helper fallback behavior for App Router API handlers.
- Removed direct route-level `getServerSession` checks from digital-generated routes to ensure consistent current-user resolution with `/api/v1/auth/me`.

**Generate PDF Route Param Fix:**

- Updated `generate-pdf` route to read dynamic `id` from App Router `params` context instead of manual URL path slicing.
- Route now awaits `context.params` and forwards exact `id` value to service for repository lookup.
- Added backend create-draft support for optional `referenceNumber` (validated and persisted without schema changes).
- Strengthened create-draft validator with `.strict()` to reject frontend-controlled extra fields (including `sourceType` and `status`).
- Extended rendering selection to include `referenceNumber` and `formData` for official document blocks.
- Replaced PDF HTML renderer with professional Arabic A4 official correspondence structure matching frontend preview design.
- PDF template now includes: institutional header, metadata (date/reference/type/confidentiality/priority), recipient block, subject, intro, body, formal closing, signature block, and footer location/contact line.
- Added strict RTL handling in generated template (`dir=rtl`, `lang=ar`, right-aligned blocks, `unicode-bidi: isolate`, `dir=ltr` wrappers for mixed values).

## Remaining Issues

Remaining issues:

- None for current DIGITAL_GENERATED scope

Future work (out of scope):

- Approval workflow integration
- Scanner upload pipeline
- Archive workflow
- Frontend UI and API clients
- Email notifications
- Document signing/stamping

## Next Safe Step

### Option 1: Test Current Implementation

Run validation commands to ensure no regressions:

```bash
npx prisma validate
npx prisma generate
npm run build
npm run lint -- --max-warnings=0
```

### Option 2: Configure Production Environment

Set required variables:

- `DOCRAPTOR_API_KEY`
- `BLOB_READ_WRITE_TOKEN`
- `PDF_GENERATION_TIMEOUT_MS` (optional)

### Option 3: Implement Approval Workflow (Next Phase)

When ready to add approval flows:

- Create src/server/modules/correspondence/approval/ module (separate feature)
- Implement status transitions: GENERATED → UNDER_REVIEW → APPROVED
- Create approval API endpoints
- Create feature tracking file for approval module
- Follows same pattern as digital-generated

## Architecture Decisions

1. **DocRaptor PDF Provider Integrated**: The flow now performs real PDF generation via external provider using native fetch.

2. **File Storage Abstraction**: Uses Vercel Blob as the real storage direction for future generated PDFs. The storage helper requires `BLOB_READ_WRITE_TOKEN`.

3. **Creator-Only PDF Generation**: Only the user who created the correspondence can generate its PDF (enforced by policy). Future approval phase may relax this.

4. **Transactional Consistency**: All writes (correspondence creation, status update, file linking, audit logging) happen in single transaction. No partial states.

5. **Audit Action GENERATE_PDF**: Used for PDF generation, differentiates from generic UPDATE action.

6. **Direction Controlled by Input Contract**: DIGITAL_GENERATED accepts OUTGOING or INTERNAL from validated input contract.

7. **Arabic Error Messages**: Consistent with existing auth system (Arabic UI, Arabic error messages in validation/policy/workflow).

## Code Quality Notes

- All static classes following auth module pattern
- Transaction-safe repository methods
- No N+1 queries (select fields precisely)
- All error paths throw appropriate error types
- Service layer pure (no state), safe for concurrent requests
- Policy checks before write attempts (fail-fast)
- Workflow validated before status update
- Metadata tracking (ipAddress, userAgent) for audit trail

## Current Behavior Summary

## PDF Generation - FULLY IMPLEMENTED

- Created DocRaptor provider client (src/lib/pdf/)
- Created template renderer for Arabic/RTL (src/server/modules/correspondence/digital-generated/template.ts)
- Real PDF generation pipeline: render HTML -> DocRaptor -> Vercel Blob -> DB transaction
- executeGeneratePdfTransaction() for atomic all-or-nothing persistence
- All configuration via environment variables (DOCRAPTOR_API_KEY, BLOB_READ_WRITE_TOKEN, PDF_GENERATION_TIMEOUT_MS)

## Runtime Acceptance Verification (2026-05-18)

- Verification scope executed first: docs read, file inspection, env readiness, prisma/lint/build gates, boundary checks.
- Environment readiness result: DATABASE_URL present, DOCRAPTOR_API_KEY present, BLOB_READ_WRITE_TOKEN present, auth secret detected in shell context.
- Build gates result: prisma validate pass, prisma generate pass, lint pass, build pass.
- Tooling gap: no npm `typecheck` script is defined.
- Runtime blocker: authenticated API runtime flow could not be completed because a valid ACTIVE user session could not be established in a non-invasive way within this run.
- Stop condition applied: runtime acceptance stopped at authentication gate to avoid unsafe auth bypass or unauthorized data manipulation.
