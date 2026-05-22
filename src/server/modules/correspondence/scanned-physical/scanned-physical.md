# scanned-physical

## Feature name

SCANNED_PHYSICAL Correspondence Intake

## Purpose

تنفيذ تدفق إدخال المراسلات الممسوحة عبر رفع ملف PDF/صورة ممسوحة وحفظها كمراسلة من النوع SCANNED_PHYSICAL مع ربط الملف في StoredFile وCorrespondenceFile.

## Current scope

- إنشاء backend module كامل: service/repository/validator/policy/workflow/types
- API route multipart: POST /api/v1/correspondence/scanned-physical
- رفع الملف إلى Vercel Blob قبل عملية DB
- حفظ Correspondence + StoredFile + CorrespondenceFile + AuditLog داخل transaction واحدة
- إنشاء الحالة الابتدائية RECEIVED

## Out of scope

- التحكم المباشر بالماسح الضوئي
- OCR
- الأرشفة النهائية
- approval flow
- PDF generation
- تعديل Auth
- تعديل Prisma schema

## Architecture compliance

- route.ts رفيع ويفوض الخدمة فقط
- Prisma محصور في repository.ts
- التحقق عبر validator.ts
- التفويض عبر policy.ts
- transition في workflow.ts
- تسجيل تدقيق AuditLog لكل عملية إنشاء

## Files created

- src/server/modules/correspondence/scanned-physical/types.ts
- src/server/modules/correspondence/scanned-physical/validator.ts
- src/server/modules/correspondence/scanned-physical/policy.ts
- src/server/modules/correspondence/scanned-physical/workflow.ts
- src/server/modules/correspondence/scanned-physical/repository.ts
- src/server/modules/correspondence/scanned-physical/service.ts
- src/server/modules/correspondence/scanned-physical/scanned-physical.md
- src/app/api/v1/correspondence/scanned-physical/route.ts

## Files modified

- src/components/layout/navigation-items.ts (enabled scanned flow route)
- src/components/layout/layout-shell.md (navigation tracking update)

## Database impact

- لا يوجد تعديل schema
- استخدام موديلات موجودة: Correspondence, StoredFile, CorrespondenceFile, AuditLog

## Backend status

مكتمل ضمن نطاق هذه المرحلة.

## Frontend status

مكتمل ومربوط مع endpoint الجديد.

## Validation performed

- npx prisma validate: PASS
- npx prisma generate: PASS
- npm run lint -- --max-warnings=0: PASS
- npm run build: FAILED (عائق سابق في إعداد Prisma Adapter داخل المسارات الحالية لـ Auth خارج نطاق هذه الميزة)
- boundary check prisma confinement: PASS (Prisma داخل repository.ts فقط)
- boundary check fake/local markers: PASS (لا fake أو LOCAL storage)
- boundary check hardcoded colors in features: PASS

## Latest changes

- إضافة module جديد لتدفق SCANNED_PHYSICAL
- إضافة endpoint multipart
- التحقق من MIME types المسموحة: PDF/JPEG/PNG/WEBP
- منع الملفات الفارغة وغير المدعومة والملفات الأكبر من الحد الافتراضي 15MB
- رفع الملف الفعلي إلى Vercel Blob قبل transaction
- إنشاء Correspondence بقيمة sourceType=SCANNED_PHYSICAL وحالة RECEIVED
- إنشاء StoredFile بقيمة provider=VERCEL_BLOB وربط CorrespondenceFile purpose=SCANNED_DOCUMENT
- تسجيل AuditLog action=SCAN_UPLOAD
- إضافة معالجة فشل transaction بعد رفع Blob مع TODO واضح لتنظيف Blob

## Remaining issues

- اختبار runtime المتكامل محجوب حاليًا بسبب خطأ Prisma adapter في مسارات Auth الحالية: PrismaClientConstructorValidationError
- فشل build مرتبط بنفس المشكلة خارج نطاق SCANNED_PHYSICAL (يظهر أثناء جمع بيانات API auth routes)

## Next safe step

إصلاح إعداد Prisma adapter في طبقة Prisma/Auth الحالية، ثم إعادة اختبار runtime الكامل (login + upload + DB assertions) لنفس التدفق.
