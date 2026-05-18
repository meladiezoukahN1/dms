"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import type { CreatedDigitalCorrespondenceDto, DigitalCorrespondenceFormValues } from "../types";
import { renderFinalPreviewHtml } from "./render-final-preview-html";

interface DigitalCorrespondencePreviewProps {
  values: DigitalCorrespondenceFormValues;
  createdDraft: CreatedDigitalCorrespondenceDto | null;
}

export function DigitalCorrespondencePreview({
  values,
  createdDraft,
}: DigitalCorrespondencePreviewProps) {
  const previewHtml = useMemo(
    () => renderFinalPreviewHtml(values, createdDraft),
    [values, createdDraft]
  );

  return (
    <Card className="h-full">
      <CardHeader className="space-y-3">
        <div>
          <CardTitle className="text-xl">معاينة غير نهائية</CardTitle>
          <CardDescription>
            تتم مزامنة معاينة الورقة الرسمية فورياً أثناء الكتابة، وقد تختلف فروق طفيفة عن ملف PDF النهائي.
          </CardDescription>
        </div>

        {createdDraft ? (
          <div className="rounded-md border border-border bg-muted p-3 text-sm text-foreground">
            <p>تم حفظ المسودة بنجاح.</p>
            <p className="text-muted-foreground">المعرف: {createdDraft.id}</p>
            <p className="text-muted-foreground">الحالة: {createdDraft.status}</p>
          </div>
        ) : null}
      </CardHeader>

      <CardContent>
        <div className="overflow-hidden rounded-lg border border-border bg-muted/20">
          <iframe
            title="معاينة غير نهائية لوثيقة المراسلة"
            srcDoc={previewHtml}
            className="h-210 w-full bg-background"
            sandbox="allow-same-origin"
          />
        </div>
      </CardContent>
    </Card>
  );
}
