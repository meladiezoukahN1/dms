"use client";

import { useWatch, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { scannedPhysicalFormSchema, type ScannedPhysicalFormSchemaType } from "../schemas/scanned-physical.schema";
import type { CreateScannedPhysicalPayload, ScannedCorrespondenceFormValues } from "../types";

function cleanOptional(value?: string): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

export function useCreateScannedCorrespondenceForm() {
  const form = useForm<ScannedPhysicalFormSchemaType, unknown, ScannedPhysicalFormSchemaType>({
    resolver: zodResolver(scannedPhysicalFormSchema),
    defaultValues: {
      file: undefined,
      title: "",
      referenceNumber: "",
      subject: "",
      direction: "INCOMING",
      correspondenceDate: "",
      priority: "NORMAL",
      confidentiality: "INTERNAL",
      senderDepartmentId: "",
      receiverDepartmentId: "",
      senderEntityId: "",
      receiverEntityId: "",
      notes: "",
    },
  });

  const previewValues = useWatch({ control: form.control }) as ScannedCorrespondenceFormValues;

  const toCreatePayload = (values: ScannedPhysicalFormSchemaType): CreateScannedPhysicalPayload => {
    return {
      file: values.file,
      title: values.title.trim(),
      referenceNumber: cleanOptional(values.referenceNumber),
      subject: cleanOptional(values.subject),
      direction: values.direction,
      correspondenceDate: cleanOptional(values.correspondenceDate),
      priority: values.priority,
      confidentiality: values.confidentiality,
      senderDepartmentId: cleanOptional(values.senderDepartmentId),
      receiverDepartmentId: cleanOptional(values.receiverDepartmentId),
      senderEntityId: cleanOptional(values.senderEntityId),
      receiverEntityId: cleanOptional(values.receiverEntityId),
      notes: cleanOptional(values.notes),
    };
  };

  return {
    form,
    previewValues,
    toCreatePayload,
  };
}
