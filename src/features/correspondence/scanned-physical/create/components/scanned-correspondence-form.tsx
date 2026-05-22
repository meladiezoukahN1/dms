"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@/components/ui";
import type { ScannedPhysicalFormSchemaType } from "../schemas/scanned-physical.schema";

interface ScannedCorrespondenceFormProps {
  form: UseFormReturn<ScannedPhysicalFormSchemaType, unknown, ScannedPhysicalFormSchemaType>;
  onSubmit: ReturnType<
    UseFormReturn<ScannedPhysicalFormSchemaType, unknown, ScannedPhysicalFormSchemaType>["handleSubmit"]
  >;
  isSubmitting: boolean;
  errorMessage?: string | null;
}

export function ScannedCorrespondenceForm({
  form,
  onSubmit,
  isSubmitting,
  errorMessage,
}: ScannedCorrespondenceFormProps) {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl">إنشاء مراسلة ممسوحة</CardTitle>
        <CardDescription>
          ارفع ملف PDF أو صورة ممسوحة وأدخل بيانات المراسلة الأساسية قبل الحفظ.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
            التحكم المباشر في جهاز الماسح الضوئي سيتم لاحقًا، والمرحلة الحالية تعتمد على رفع ملف PDF أو صورة ممسوحة.
          </div>

          <Controller
            name="file"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="scanned-file">رفع ملف ممسوح</Label>
                <Input
                  id="scanned-file"
                  type="file"
                  accept="application/pdf,image/jpeg,image/png,image/webp"
                  onChange={(event) => {
                    const selectedFile = event.target.files?.[0];
                    field.onChange(selectedFile);
                  }}
                />
                {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
              </div>
            )}
          />

          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="scanned-title">العنوان</Label>
                <Input id="scanned-title" placeholder="عنوان المراسلة" {...field} />
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
                  <Label htmlFor="scanned-reference">الرقم الإشاري</Label>
                  <Input id="scanned-reference" placeholder="اختياري" {...field} value={field.value || ""} />
                  {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
                </div>
              )}
            />

            <Controller
              name="correspondenceDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="scanned-date">تاريخ المراسلة</Label>
                  <Input id="scanned-date" type="date" {...field} value={field.value || ""} />
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
                <Label htmlFor="scanned-subject">الموضوع</Label>
                <Input id="scanned-subject" placeholder="اختياري" {...field} value={field.value || ""} />
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
                  <Label htmlFor="scanned-direction">الاتجاه</Label>
                  <select
                    id="scanned-direction"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    {...field}
                  >
                    <option value="INCOMING">وارد</option>
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
                  <Label htmlFor="scanned-priority">الأولوية</Label>
                  <select
                    id="scanned-priority"
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
                  <Label htmlFor="scanned-confidentiality">السرية</Label>
                  <select
                    id="scanned-confidentiality"
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
              name="senderDepartmentId"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="scanned-sender-department">معرف الإدارة المرسلة</Label>
                  <Input id="scanned-sender-department" placeholder="اختياري" {...field} value={field.value || ""} />
                  {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
                </div>
              )}
            />

            <Controller
              name="receiverDepartmentId"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="scanned-receiver-department">معرف الإدارة المستقبلة</Label>
                  <Input id="scanned-receiver-department" placeholder="اختياري" {...field} value={field.value || ""} />
                  {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
                </div>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Controller
              name="senderEntityId"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="scanned-sender-entity">معرف الجهة المرسلة</Label>
                  <Input id="scanned-sender-entity" placeholder="اختياري" {...field} value={field.value || ""} />
                  {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
                </div>
              )}
            />

            <Controller
              name="receiverEntityId"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="scanned-receiver-entity">معرف الجهة المستقبلة</Label>
                  <Input id="scanned-receiver-entity" placeholder="اختياري" {...field} value={field.value || ""} />
                  {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
                </div>
              )}
            />
          </div>

          <Controller
            name="notes"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label htmlFor="scanned-notes">ملاحظات</Label>
                <textarea
                  id="scanned-notes"
                  rows={4}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="ملاحظات إضافية (اختياري)"
                  {...field}
                  value={field.value || ""}
                />
                {fieldState.error ? <p className="text-sm text-destructive">{fieldState.error.message}</p> : null}
              </div>
            )}
          />

          {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "جار حفظ المراسلة..." : "حفظ المراسلة الممسوحة"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
