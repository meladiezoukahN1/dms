# archive-handover

## Feature name

Correspondence Archive Handover (Backend)

## Purpose

إتاحة قائمة مراسلات مؤهلة للإحالة للأرشفة مع تحديث بياناتها الوصفية قبل الإحالة.

## Current scope

- GET قائمة مؤهلة مع pagination/search/filters
- PATCH لتعديل metadata للمراسلات المؤهلة فقط
- POST send يحدّث الحالة إلى ARCHIVE_PENDING
- POST send يسجّل archiveHandoverById وarchiveHandoverAt وarchiveHandoverNotes
- تضمين createdBy من علاقة المستخدم
- تضمين handedOverBy من archiveHandoverBy relation
- تضمين handedOverAt وarchiveHandoverNotes في DTO
- القائمة الافتراضية تستثني ARCHIVE_PENDING وتعرضه فقط عند فلتر حالة صريح

## Out of scope

- الأرشفة النهائية
- إنشاء ArchiveRecord
- تعديل StoredFile أو CorrespondenceFile
- تعديل schema تلقائيًا

## Architecture compliance

- Prisma محصور في repository.ts
- routes نحيفة
- validator/policy/workflow/service مفعلة
- AuditLog مضاف لعمليات PATCH

## Files created

- src/server/modules/correspondence/archive-handover/types.ts
- src/server/modules/correspondence/archive-handover/validator.ts
- src/server/modules/correspondence/archive-handover/policy.ts
- src/server/modules/correspondence/archive-handover/workflow.ts
- src/server/modules/correspondence/archive-handover/repository.ts
- src/server/modules/correspondence/archive-handover/service.ts
- src/server/modules/correspondence/archive-handover/archive-handover.md
- src/app/api/v1/correspondence/archive-handover/route.ts
- src/app/api/v1/correspondence/archive-handover/[id]/route.ts
- src/app/api/v1/correspondence/archive-handover/[id]/send/route.ts

## Files modified

- none yet

## Database impact

تم اعتماد حد أدنى من تعديل schema:

- إضافة الحالة ARCHIVE_PENDING
- إضافة حقول archiveHandoverById/archiveHandoverAt/archiveHandoverNotes وعلاقة archiveHandoverBy

## Backend status

قائمة + تعديل metadata + send جاهزون.

## Remaining issues

- لا توجد مشكلات blocker معروفة داخل نطاق handover الحالي.

## Next safe step

الخطوة التالية الآمنة: اختبار UI يدوي سريع للتأكد من عدم ظهور إجراء الإحالة للسجلات ARCHIVE_PENDING.
