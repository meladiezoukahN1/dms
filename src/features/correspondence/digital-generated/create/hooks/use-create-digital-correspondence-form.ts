"use client";

import { useWatch, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { digitalGeneratedFormSchema, type DigitalGeneratedFormSchemaType } from "../schemas/digital-generated.schema";
import type {
  CreateDigitalCorrespondencePayload,
  DigitalCorrespondenceFormValues,
} from "../types";

function cleanOptional(value?: string): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

export function useCreateDigitalCorrespondenceForm() {
  const form = useForm<DigitalGeneratedFormSchemaType, unknown, DigitalGeneratedFormSchemaType>({
    resolver: zodResolver(digitalGeneratedFormSchema),
    defaultValues: {
      title: "",
      referenceNumber: "",
      subject: "",
      body: "",
      direction: "OUTGOING",
      priority: "NORMAL",
      confidentiality: "INTERNAL",
      receiverDepartmentId: "",
      receiverEntityId: "",
      correspondenceDate: "",
      templateId: "",
      recipientTitle: "السادة",
      recipientName: "",
      senderDisplayName: "",
      receiverDisplayName: "",
      signatureName: "",
      signatureTitle: "",
      footerLocation: "",
      documentIntro: "تحية طيبة وبعد،",
      formData: {},
    },
  });

  const previewValues = useWatch({ control: form.control }) as DigitalCorrespondenceFormValues;

  const toCreatePayload = (values: DigitalGeneratedFormSchemaType): CreateDigitalCorrespondencePayload => {
    const recipientTitle = cleanOptional(values.recipientTitle);
    const recipientName = cleanOptional(values.recipientName);
    const senderDisplayName = cleanOptional(values.senderDisplayName);
    const receiverDisplayName = cleanOptional(values.receiverDisplayName);
    const signatureName = cleanOptional(values.signatureName);
    const signatureTitle = cleanOptional(values.signatureTitle);
    const footerLocation = cleanOptional(values.footerLocation);
    const documentIntro = cleanOptional(values.documentIntro);
    const referenceNumber = cleanOptional(values.referenceNumber);

    return {
      title: values.title.trim(),
      referenceNumber,
      subject: cleanOptional(values.subject),
      body: cleanOptional(values.body),
      direction: values.direction,
      templateId: cleanOptional(values.templateId),
      priority: values.priority,
      confidentiality: values.confidentiality,
      correspondenceDate: cleanOptional(values.correspondenceDate),
      receiverDepartmentId: cleanOptional(values.receiverDepartmentId),
      receiverEntityId: cleanOptional(values.receiverEntityId),
      formData: {
        ...(values.formData ?? {}),
        recipientTitle,
        recipientName,
        senderDisplayName,
        receiverDisplayName,
        signatureName,
        signatureTitle,
        footerLocation,
        documentIntro,
        referenceDisplay: referenceNumber || "مسودة غير مرقمة",
      },
    };
  };

  return {
    form,
    previewValues,
    toCreatePayload,
  };
}
