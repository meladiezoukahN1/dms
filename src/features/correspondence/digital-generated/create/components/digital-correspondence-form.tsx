"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@/components/ui";
import type { DigitalGeneratedFormSchemaType } from "../schemas/digital-generated.schema";

interface DigitalCorrespondenceFormProps {
  form: UseFormReturn<DigitalGeneratedFormSchemaType, unknown, DigitalGeneratedFormSchemaType>;
  onSubmit: ReturnType<
    UseFormReturn<DigitalGeneratedFormSchemaType, unknown, DigitalGeneratedFormSchemaType>["handleSubmit"]
  >;
  isSubmitting: boolean;
  errorMessage?: string | null;
}

export function DigitalCorrespondenceForm({
  form,
  onSubmit,
  isSubmitting,
  errorMessage,
}: DigitalCorrespondenceFormProps) {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl">إنشاء مراسلة رقمية</CardTitle>
        <CardDescription>أدخل بيانات المراسلة الرسمية. يمكن تعديلها قبل الحفظ وبعده.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
            الحقول الخاصة بالمظهر الرسمي مثل المخاطب والتوقيع والتذييل تُخزن داخل بيانات النموذج
            <span dir="ltr" className="mx-1 inline-block">formData</span>
            بدون تعديل المخطط.
          </div>

          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="digital-title">العنوان</Label>
                <Input id="digital-title" placeholder="عنوان المراسلة" {...field} />
                {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
              </div>
            )}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Controller
              name="referenceNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="digital-reference-number">الرقم الإشاري</Label>
                  <Input
                    id="digital-reference-number"
                    placeholder="مثال: ص/و/2026/155"
                    {...field}
                    value={field.value || ""}
                  />
                  {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
                </div>
              )}
            />

            <Controller
              name="correspondenceDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="digital-date">تاريخ المراسلة</Label>
                  <Input id="digital-date" type="date" {...field} value={field.value || ""} />
                  {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
                </div>
              )}
            />
          </div>

          <Controller
            name="subject"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="digital-subject">الموضوع</Label>
                <Input id="digital-subject" placeholder="موضوع مختصر" {...field} value={field.value || ""} />
                {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
              </div>
            )}
          />

          <Controller
            name="body"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="digital-body">النص</Label>
                <textarea
                  id="digital-body"
                  rows={5}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="نص المراسلة"
                  {...field}
                  value={field.value || ""}
                />
                {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
              </div>
            )}
          />

          <div className="grid gap-4 md:grid-cols-3">
            <Controller
              name="direction"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="digital-direction">الاتجاه</Label>
                  <select
                    id="digital-direction"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    {...field}
                  >
                    <option value="OUTGOING">صادر</option>
                    <option value="INTERNAL">داخلي</option>
                  </select>
                  {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
                </div>
              )}
            />

            <Controller
              name="priority"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="digital-priority">الأولوية</Label>
                  <select
                    id="digital-priority"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    {...field}
                  >
                    <option value="LOW">منخفضة</option>
                    <option value="NORMAL">عادية</option>
                    <option value="HIGH">مرتفعة</option>
                    <option value="URGENT">عاجلة</option>
                  </select>
                  {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
                </div>
              )}
            />

            <Controller
              name="confidentiality"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="digital-confidentiality">السرية</Label>
                  <select
                    id="digital-confidentiality"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    {...field}
                  >
                    <option value="PUBLIC">عام</option>
                    <option value="INTERNAL">داخلي</option>
                    <option value="CONFIDENTIAL">سري</option>
                    <option value="SECRET">سري جداً</option>
                    <option value="TOP_SECRET">سري للغاية</option>
                  </select>
                  {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
                </div>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Controller
              name="receiverEntityId"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="digital-receiver-entity">معرف الجهة المستقبلة</Label>
                  <Input id="digital-receiver-entity" placeholder="اختياري" {...field} value={field.value || ""} />
                  {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
                </div>
              )}
            />

            <Controller
              name="receiverDepartmentId"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="digital-receiver-department">معرف الإدارة المستقبلة</Label>
                  <Input id="digital-receiver-department" placeholder="اختياري" {...field} value={field.value || ""} />
                  {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
                </div>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Controller
              name="recipientTitle"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="digital-recipient-title">صيغة المخاطبة</Label>
                  <Input id="digital-recipient-title" placeholder="السيد/السادة" {...field} value={field.value || ""} />
                  {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
                </div>
              )}
            />

            <Controller
              name="recipientName"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="digital-recipient-name">الجهة المستقبلة (عرض)</Label>
                  <Input id="digital-recipient-name" placeholder="اسم الجهة أو الشخص" {...field} value={field.value || ""} />
                  {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
                </div>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Controller
              name="senderDisplayName"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="digital-sender-display">بيانات الجهة المرسلة (عرض)</Label>
                  <Input id="digital-sender-display" placeholder="اختياري" {...field} value={field.value || ""} />
                  {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
                </div>
              )}
            />

            <Controller
              name="receiverDisplayName"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="digital-receiver-display">الإدارة/القسم المستلم (عرض)</Label>
                  <Input id="digital-receiver-display" placeholder="اختياري" {...field} value={field.value || ""} />
                  {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
                </div>
              )}
            />
          </div>

          <Controller
            name="templateId"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="digital-template-id">معرف القالب</Label>
                <Input id="digital-template-id" placeholder="اختياري" {...field} value={field.value || ""} />
                {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
              </div>
            )}
          />

          <Controller
            name="documentIntro"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="digital-document-intro">افتتاحية الخطاب</Label>
                <Input id="digital-document-intro" placeholder="تحية طيبة وبعد،" {...field} value={field.value || ""} />
                {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
              </div>
            )}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Controller
              name="signatureName"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="digital-signature-name">الاسم (التوقيع)</Label>
                  <Input id="digital-signature-name" placeholder="الاسم الكامل" {...field} value={field.value || ""} />
                  {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
                </div>
              )}
            />

            <Controller
              name="signatureTitle"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="digital-signature-title">الصفة (التوقيع)</Label>
                  <Input id="digital-signature-title" placeholder="الصفة الوظيفية" {...field} value={field.value || ""} />
                  {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
                </div>
              )}
            />
          </div>

          <Controller
            name="footerLocation"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="digital-footer-location">الموقع/العنوان في التذييل</Label>
                <Input id="digital-footer-location" placeholder="المدينة - العنوان - وسائل التواصل" {...field} value={field.value || ""} />
                {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
              </div>
            )}
          />

          {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "جار حفظ المسودة..." : "حفظ كمسودة"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
