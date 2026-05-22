# archive-handover

## Feature name

Correspondence Archive Handover (Frontend)

## Purpose

واجهة عربية RTL لعرض المراسلات المؤهلة للإحالة للأرشفة، مراجعة الملفات، تعديل metadata قبل الإحالة، ومحاولة الإرسال.

## Current scope

- صفحة list مع URL query params
- search + filters + pagination
- files dialog مع أزرار معاينة وتحميل محمية server-side
- edit dialog (metadata فقط)
- send action ينجح وينقل السجل إلى ARCHIVE_PENDING
- عرض handedOverBy وhandedOverAt وarchiveHandoverNotes في الجدول
- ARCHIVE_PENDING يظهر كعرض فقط عند التصفية بالحالة دون زر "إحالة للأرشفة"
- edit dialog يعرض "الملفات المرتبطة" كملخص للعرض فقط
- معاينة مضمّنة (PDF + صور) عبر route محمية بجلسة المستخدم
- تحميل مباشر عبر route محمية بجلسة المستخدم

## Out of scope

- الأرشفة النهائية
- أي روابط ملفات وهمية
- أي تعديل على scanner/pdf/auth

## Architecture compliance

- page.tsx نحيف
- كل منطق الواجهة في feature
- لا prisma/server imports في feature
- semantic tokens فقط

## Files created

- src/features/correspondence/archive-handover/types.ts
- src/features/correspondence/archive-handover/schemas/archive-handover.schema.ts
- src/features/correspondence/archive-handover/api/archive-handover.api.ts
- src/features/correspondence/archive-handover/hooks/use-archive-handover-query-state.ts
- src/features/correspondence/archive-handover/hooks/use-archive-handover-list.ts
- src/features/correspondence/archive-handover/hooks/use-update-archive-handover-correspondence.ts
- src/features/correspondence/archive-handover/hooks/use-send-to-archive.ts
- src/features/correspondence/archive-handover/components/archive-handover-page.tsx
- src/features/correspondence/archive-handover/components/archive-handover-filters.tsx
- src/features/correspondence/archive-handover/components/archive-handover-table.tsx
- src/features/correspondence/archive-handover/components/archive-handover-files-dialog.tsx
- src/features/correspondence/archive-handover/components/archive-handover-file-preview.tsx
- src/features/correspondence/archive-handover/components/edit-handover-correspondence-dialog.tsx
- src/features/correspondence/archive-handover/components/send-to-archive-action.tsx
- src/features/correspondence/archive-handover/archive-handover.md
- src/app/(dashboard)/correspondence/archive-handover/page.tsx
- src/app/api/v1/correspondence/archive-handover/files/[fileId]/preview/route.ts
- src/app/api/v1/correspondence/archive-handover/files/[fileId]/download/route.ts

## Frontend status

واجهة مكتملة مع دعم إرسال handover الفعلي ومعاينة وتحميل الملفات عبر routes محمية.

## Remaining issues

- لا توجد مشكلات blocker معروفة ضمن النطاق الحالي.

## Next safe step

اختبار تفاعلي بصري للتأكد من عمل أزرار المعاينة والتحميل مع بيانات حقيقية.
