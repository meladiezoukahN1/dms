"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui";
import { useCreateScannedCorrespondence } from "../hooks/use-create-scanned-correspondence";
import { useCreateScannedCorrespondenceForm } from "../hooks/use-create-scanned-correspondence-form";
import { isApiClientError, type CreatedScannedPhysicalDto } from "../types";
import { ScannedCorrespondenceForm } from "./scanned-correspondence-form";
import { ScannedFilePreview } from "./scanned-file-preview";

export function ScannedCorrespondenceCreateView() {
  const { form, previewValues, toCreatePayload } = useCreateScannedCorrespondenceForm();
  const createMutation = useCreateScannedCorrespondence();

  const [createError, setCreateError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedScannedPhysicalDto | null>(null);

  const onSubmit = form.handleSubmit(async (values) => {
    setCreateError(null);

    try {
      const result = await createMutation.mutateAsync(toCreatePayload(values));
      setCreated(result);
    } catch (error) {
      if (isApiClientError(error)) {
        setCreateError(error.message);
        return;
      }

      setCreateError("تعذر حفظ المراسلة الممسوحة حالياً.");
    }
  });

  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">إنشاء مراسلة ممسوحة</h1>
        <p className="text-sm text-muted-foreground">
          ارفع ملفًا ممسوحًا بصيغة PDF أو صورة مع بيانات المراسلة لتسجيله كمراسلة واردة ممسوحة.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
        <div className="lg:col-span-4">
          <ScannedCorrespondenceForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={Boolean(createMutation.isPending)}
            errorMessage={createError}
          />
        </div>

        <div className="space-y-6 lg:col-span-6">
          <ScannedFilePreview file={previewValues.file} />

          <Card>
            <CardContent className="pt-6 space-y-2 text-sm">
              <p className="text-foreground">رفع الملف لا يتم إلا بعد الضغط على حفظ.</p>
              <p className="text-muted-foreground">
                لا يتم إنشاء روابط وهمية أو تخزين محلي؛ كل نجاح يعتمد على استجابة API الفعلية.
              </p>
              {created ? (
                <div className="rounded-md border border-border bg-muted/20 p-3 text-sm text-foreground space-y-1">
                  <p>تم حفظ المراسلة الممسوحة بنجاح.</p>
                  <p className="text-muted-foreground">معرف المراسلة: {created.correspondenceId}</p>
                  <p className="text-muted-foreground">الحالة: {created.status}</p>
                  <p className="text-muted-foreground">معرف الملف: {created.fileId}</p>
                  <p className="text-muted-foreground">الغرض: {created.purpose}</p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
