# Digital Generated Create Feature

## Feature name

Digital Generated Correspondence Create Frontend Binding

## Purpose

Provide a dashboard page that lets users create DIGITAL_GENERATED correspondence drafts, view a live final print-like preview while typing, and attempt PDF generation through existing backend APIs.

## Current scope

- Route page for create flow under dashboard
- React Hook Form + Zod client validation
- React Query mutations for create draft and generate PDF
- Honest PDF generation state handling for `PDF_PROVIDER_NOT_CONFIGURED`
- Two-panel RTL UI: form and live final print preview

## Out of scope

- Scanner flows
- Archive flows
- Auth modifications
- Prisma schema changes
- PDF provider implementation
- Fake PDF links or fake generated status

## Architecture compliance

- `src/app` page kept thin
- UI and client logic inside `src/features`
- API calls use `fetch` only
- No server module imports in feature files
- Semantic token classes used, no hardcoded colors

## Files created

- src/app/providers.tsx
- src/app/(dashboard)/correspondence/digital-generated/create/page.tsx
- src/features/correspondence/digital-generated/create/types.ts
- src/features/correspondence/digital-generated/create/schemas/digital-generated.schema.ts
- src/features/correspondence/digital-generated/create/api/digital-generated.api.ts
- src/features/correspondence/digital-generated/create/hooks/use-create-digital-correspondence-form.ts
- src/features/correspondence/digital-generated/create/hooks/use-create-digital-correspondence.ts
- src/features/correspondence/digital-generated/create/hooks/use-generate-digital-correspondence-pdf.ts
- src/features/correspondence/digital-generated/create/components/digital-correspondence-create-view.tsx
- src/features/correspondence/digital-generated/create/components/digital-correspondence-form.tsx
- src/features/correspondence/digital-generated/create/components/digital-correspondence-preview.tsx
- src/features/correspondence/digital-generated/create/components/generate-pdf-action.tsx
- src/features/correspondence/digital-generated/create/create.md

## Files modified

- src/app/layout.tsx
- package.json
- package-lock.json

## Database impact

No database or Prisma schema changes.

## Backend status

No breaking changes; backend now accepts and persists direction and correspondenceDate.

## Frontend status

Implemented complete draft create + guarded PDF attempt binding with direction and correspondenceDate payload alignment.

## Validation performed

- Dependency installed: `@tanstack/react-query`
- Typecheck: PASSED ✓
- Lint with --max-warnings=0: PASSED ✓
- Boundary checks: PASSED ✓

## Latest changes

- Added global React Query provider and wrapped root layout
- Added dashboard create page for digital-generated correspondence
- Added feature module with form, preview, API client, and mutation hooks
- Added exact warning handling for `PDF_PROVIDER_NOT_CONFIGURED`
- Replaced non-final summary preview with final print-like iframe preview that updates instantly while typing
- **[Contract Aligned]** Backend validator now accepts direction (OUTGOING | INTERNAL only)
- **[Contract Aligned]** Backend repository now persists direction from frontend
- **[Contract Aligned]** Backend validator now accepts correspondenceDate (optional)
- **[Contract Aligned]** Backend repository now persists correspondenceDate from frontend
- **[Contract Aligned]** Frontend API payload now sends direction and correspondenceDate
- **[Contract Aligned]** sourceType remains server-controlled as DIGITAL_GENERATED
- **[Contract Aligned]** status remains server-controlled as DRAFT
- Redesigned form for official correspondence fields (reference number, recipient block, signature block, footer location, intro line)
- Added template-only display controls and serialized them into `formData` (recipientTitle, recipientName, senderDisplayName, receiverDisplayName, signatureName, signatureTitle, footerLocation, documentIntro, referenceDisplay)
- Rebuilt live preview into official Arabic A4-style document with strict RTL, metadata grid, recipient/subject/body/closing/signature/footer blocks
- Added explicit label "معاينة غير نهائية" and removed any wording that implies preview equals generated PDF
- Enforced RTL text behavior in preview (`dir=rtl`, `lang=ar`, right alignment, `unicode-bidi: isolate`, `dir=ltr` wrappers for reference/date)
- Added optional frontend support for `referenceNumber` persistence through backend API payload

## Remaining issues

None. Contract fully aligned.

## Next safe step

Integration testing and manual QA of create flow end-to-end.
