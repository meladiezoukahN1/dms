"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui";
import { DigitalCorrespondenceForm } from "./digital-correspondence-form";
import { DigitalCorrespondencePreview } from "./digital-correspondence-preview";
import { GeneratePdfAction } from "./generate-pdf-action";
import { useCreateDigitalCorrespondenceForm } from "../hooks/use-create-digital-correspondence-form";
import { useCreateDigitalCorrespondence } from "../hooks/use-create-digital-correspondence";
import { useGenerateDigitalCorrespondencePdf } from "../hooks/use-generate-digital-correspondence-pdf";
import {
  isApiClientError,
  type CreatedDigitalCorrespondenceDto,
} from "../types";

const PDF_NOT_CONFIGURED_MESSAGE = "لا يمكن توليد ملف PDF حاليًا لأن مزود توليد PDF غير مفعّل.";

export function DigitalCorrespondenceCreateView() {
  const { form, previewValues, toCreatePayload } = useCreateDigitalCorrespondenceForm();
  const createMutation = useCreateDigitalCorrespondence();
  const generateMutation = useGenerateDigitalCorrespondencePdf();

  const [createdDraft, setCreatedDraft] = useState<CreatedDigitalCorrespondenceDto | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generateSuccess, setGenerateSuccess] = useState<string | null>(null);

  const onSubmit = form.handleSubmit(async (values) => {
    setCreateError(null);
    setGenerateError(null);
    setGenerateSuccess(null);

    try {
      const created = await createMutation.mutateAsync(toCreatePayload(values));
      setCreatedDraft(created);
    } catch (error) {
      if (isApiClientError(error)) {
        setCreateError(error.message);
        return;
      }

      setCreateError("تعذر حفظ المسودة حالياً.");
    }
  });

  const handleGeneratePdf = async () => {
    if (!createdDraft?.id) {
      return;
    }

    setGenerateError(null);
    setGenerateSuccess(null);

    try {
      const result = await generateMutation.mutateAsync({ correspondenceId: createdDraft.id });
      setGenerateSuccess(`تم توليد PDF بنجاح. الحالة الحالية: ${result.status}`);
    } catch (error) {
      if (isApiClientError(error) && error.code === "PDF_PROVIDER_NOT_CONFIGURED") {
        setGenerateError(PDF_NOT_CONFIGURED_MESSAGE);
        return;
      }

      if (isApiClientError(error)) {
        setGenerateError(error.message);
        return;
      }

      setGenerateError("تعذر محاولة توليد ملف PDF حالياً.");
    }
  };

  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">إنشاء مراسلة رقمية</h1>
        <p className="text-sm text-muted-foreground">
          أدخل البيانات في النموذج وشاهد معاينة غير نهائية بصيغة ورقة رسمية تتحدث فورياً أثناء الكتابة قبل الحفظ أو التوليد.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
        <div className="lg:col-span-3">
          <DigitalCorrespondenceForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={Boolean(createMutation.isPending)}
            errorMessage={createError}
          />
        </div>

        <div className="space-y-6 lg:col-span-7">
          <DigitalCorrespondencePreview values={previewValues} createdDraft={createdDraft} />

          <GeneratePdfAction
            correspondenceId={createdDraft?.id ?? null}
            isGenerating={Boolean(generateMutation.isPending)}
            onGenerate={handleGeneratePdf}
            errorMessage={generateError}
            successMessage={generateSuccess}
          />

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                المخرجات هنا لا تنشئ روابط تحميل أو ملفات وهمية. حالة التوليد تعتمد كلياً على استجابة API.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
