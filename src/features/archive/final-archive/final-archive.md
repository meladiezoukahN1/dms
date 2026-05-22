# final-archive

## Feature name

Final Archive (Frontend)

## Purpose

واجهة لإدارة الأرشفة النهائية للمراسلات المحالة للأرشفة.

## Current scope

- عرض قائمة المراسلات المؤهلة (ARCHIVE_PENDING فقط)
- البحث والتصفية حسب معايير متعددة
- Pagination مع URL state
- تعديل metadata قبل الأرشفة
- تأكيد الأرشفة النهائية وإنشاء ArchiveRecord
- عرض الملفات المرتبطة
- عرض "الملفات المرتبطة" داخل popup التعديل كملخص read-only
- Arabic RTL interface

## Out of scope

- تعديل StoredFile أو CorrespondenceFile
- حذف الملفات
- نقل الملفات

## Architecture compliance

- Feature structure في src/features/archive/final-archive
- Types والـ schemas منفصلة
- Hooks لـ Query و Mutations
- Components للـ UI
- API client محصور في يومي واحدة
- استخدام React Query للـ data fetching
- URL state للـ pagination والـ filters

## Files created

- src/features/archive/final-archive/types.ts
- src/features/archive/final-archive/schemas/final-archive.schema.ts
- src/features/archive/final-archive/api/final-archive.api.ts
- src/features/archive/final-archive/hooks/use-final-archive-query-state.ts
- src/features/archive/final-archive/hooks/use-final-archive-list.ts
- src/features/archive/final-archive/hooks/use-update-final-archive-metadata.ts
- src/features/archive/final-archive/hooks/use-final-archive-action.ts
- src/features/archive/final-archive/components/final-archive-page.tsx
- src/features/archive/final-archive/components/final-archive-table.tsx
- src/features/archive/final-archive/components/final-archive-filters.tsx
- src/features/archive/final-archive/components/final-archive-files-dialog.tsx
- src/features/archive/final-archive/components/edit-final-archive-dialog.tsx
- src/features/archive/final-archive/components/archive-confirm-dialog.tsx

## Database impact

None (frontend only, uses existing backend)

## Frontend status

✓ Types defined
✓ Schemas defined
✓ API client implemented
✓ Hooks implemented
✓ Components implemented

## Page/Route status

- ✓ Page route created at src/app/(dashboard)/archive/final-archive/page.tsx

## Validation performed

- ✓ Page integrated into dashboard navigation
- ✓ Suspense wrapper added for useSearchParams prerender safety
- ✓ npm run lint -- --max-warnings=0
- ✓ npm run build
- ✓ Runtime smoke test عبر API flow كامل

## Latest changes

Frontend integrated with route and navigation, prerender issue fixed, and edit dialog enhanced with attached files summary.

## Remaining issues

- No known frontend issues in this feature scope

## Next safe step

Run runtime smoke tests for filtering, editing, and final archive confirmation flows.
