# final-archive

## Feature name

Final Archive (Backend Module)

## Purpose

تمكين الأرشفة النهائية للمراسلات المحالة للأرشفة.

## Current scope

- GET قائمة المراسلات المؤهلة (ARCHIVE_PENDING فقط) مع pagination/search/filters
- PATCH لتعديل metadata قبل الأرشفة النهائية
- POST archive لإتمام الأرشفة النهائية وإنشاء ArchiveRecord
- التحقق من حالة ARCHIVE_PENDING فقط (لا تقبل GENERATED/RECEIVED/ARCHIVED)
- التحقق من وجود ملفات
- التحقق من وجود handover information
- استخدام transaction للأرشفة النهائية
- تسجيل Audit log للعمليات

## Out of scope

- تعديل SourceType
- تعديل StoredFile أو CorrespondenceFile (إلا ربط الملفات بـ ArchiveRecord)
- حذف الملفات
- نقل الملفات

## Architecture compliance

- Prisma محصور في repository.ts
- validator/policy/workflow/service مفعلة
- AuditLog مضاف لعمليات UPDATE و ARCHIVE
- Transaction للأرشفة النهائية

## Files created

- src/server/modules/archive/final-archive/types.ts
- src/server/modules/archive/final-archive/validator.ts
- src/server/modules/archive/final-archive/policy.ts
- src/server/modules/archive/final-archive/workflow.ts
- src/server/modules/archive/final-archive/repository.ts
- src/server/modules/archive/final-archive/service.ts

## Database impact

استخدام الحقول الموجودة:

- Correspondence.status = ARCHIVE_PENDING → ARCHIVED
- Correspondence.archivedAt
- ArchiveRecord (إنشاء)
- ArchiveFile (ربط الملفات)

## Backend status

✓ Types defined
✓ Validator implemented
✓ Policy implemented
✓ Workflow implemented
✓ Repository implemented
✓ Service implemented

## API routes status

- ✓ GET /api/v1/archive/final-archive
- ✓ PATCH /api/v1/archive/final-archive/[id]
- ✓ POST /api/v1/archive/final-archive/[id]/archive

## Frontend status

- ✓ Frontend integrated with backend module

## Validation performed

- ✓ Prisma validate
- ✓ Prisma generate
- ✓ npm run lint -- --max-warnings=0
- ✓ npm run build
- ✓ Runtime smoke test (login, GET, PATCH, POST, DB verification, invalid/unauth checks)

## Latest changes

Completed backend implementation, aligned update contract with supported editable fields, fixed AuditLogger integration, fixed archive POST route runtime signature, and verified production build plus runtime smoke test.

## Remaining issues

- No known backend issues in this feature scope

## Next safe step

Run runtime smoke tests for edit and archive flows against seeded ARCHIVE_PENDING data.
