"use client";

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";

interface GeneratePdfActionProps {
  correspondenceId: string | null;
  isGenerating: boolean;
  onGenerate: () => void;
  errorMessage?: string | null;
  successMessage?: string | null;
}

export function GeneratePdfAction({
  correspondenceId,
  isGenerating,
  onGenerate,
  errorMessage,
  successMessage,
}: GeneratePdfActionProps) {
  const hasValidCorrespondenceId =
    typeof correspondenceId === "string" && /^c[a-z0-9]{10,}$/i.test(correspondenceId);

  const shouldDisableGenerate = !hasValidCorrespondenceId || Boolean(isGenerating);

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="text-base">إجراء PDF</CardTitle>
        <CardDescription>
          يتفعّل الزر بعد حفظ المسودة. النتيجة تعتمد على استجابة واجهة الخادم الحالية.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <Button
          type="button"
          onClick={onGenerate}
          disabled={shouldDisableGenerate}
          className="w-full"
        >
          {Boolean(isGenerating) ? "جار محاولة توليد PDF..." : "توليد PDF"}
        </Button>

        {!hasValidCorrespondenceId ? (
          <p className="text-sm text-muted-foreground">احفظ المسودة أولاً لتفعيل توليد PDF.</p>
        ) : null}

        {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
        {successMessage ? <p className="text-sm text-muted-foreground">{successMessage}</p> : null}
      </CardContent>
    </Card>
  );
}
