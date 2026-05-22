# create

## Feature name

Scanned Physical Correspondence Create

## Purpose

واجهة إنشاء مراسلة ممسوحة عبر رفع ملف ممسوح من جهاز المستخدم وربط بياناته الوصفية قبل الحفظ.

## Current scope

- نموذج React Hook Form مع Zod
- رفع ملف PDF/صورة ممسوحة عبر FormData
- preview محلي قبل الحفظ
- mutation عبر React Query
- عرض نتيجة الإنشاء الفعلية من API

## Out of scope

- scanner control
- OCR
- archive finalization
- PDF generation

## Architecture compliance

- صفحة app رفيعة تستدعي feature view فقط
- منطق الواجهة داخل src/features فقط
- لا imports من server/prisma
- استخدام semantic tokens فقط

## Files created

- src/features/correspondence/scanned-physical/create/types.ts
- src/features/correspondence/scanned-physical/create/schemas/scanned-physical.schema.ts
- src/features/correspondence/scanned-physical/create/api/scanned-physical.api.ts
- src/features/correspondence/scanned-physical/create/hooks/use-create-scanned-correspondence-form.ts
- src/features/correspondence/scanned-physical/create/hooks/use-create-scanned-correspondence.ts
- src/features/correspondence/scanned-physical/create/components/scanned-correspondence-form.tsx
- src/features/correspondence/scanned-physical/create/components/scanned-file-preview.tsx
- src/features/correspondence/scanned-physical/create/components/scanned-correspondence-create-view.tsx
- src/features/correspondence/scanned-physical/create/create.md
- src/app/(dashboard)/correspondence/scanned-physical/create/page.tsx

## Files modified

- src/components/layout/navigation-items.ts
- src/components/layout/layout-shell.md

## Database impact

لا يوجد تعديل schema.

## Backend status

مرتبط مع endpoint الإنشاء الممسوح.

## Frontend status

مكتمل ضمن نطاق مرحلة intake.

## Validation performed

- npx prisma validate: PASS
- npx prisma generate: PASS
- npm run lint -- --max-warnings=0: PASS
- npm run build: FAILED بسبب Prisma adapter issue خارج نطاق feature
- boundary checks: PASS (لا server/prisma imports في feature، لا ألوان hardcoded)

## Latest changes

- إنشاء واجهة رفع المراسلة الممسوحة
- إضافة معاينة محلية قبل الحفظ للصور وPDF
- إضافة note واضحة: "التحكم المباشر في جهاز الماسح الضوئي سيتم لاحقًا..."
- ربط النموذج مع API multipart/FormData فعليًا
- عرض نتيجة الإنشاء الفعلية (correspondenceId/status/fileId/purpose) بدون أي نجاح وهمي

## Remaining issues

- build/runtime الكامل محجوبان بسبب Prisma adapter issue خارج نطاق هذا الـfeature.

## Next safe step

بعد إصلاح Prisma adapter الحالي في المشروع، أعد تشغيل smoke test الكامل لهذا التدفق مع التحقق من DB rows.
