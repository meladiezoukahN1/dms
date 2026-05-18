"use client";

import { useMutation } from "@tanstack/react-query";
import { generateDigitalGeneratedPdf } from "../api/digital-generated.api";
import type {
  ApiClientError,
  GenerateDigitalCorrespondencePdfPayload,
  GeneratedDigitalCorrespondencePdfDto,
} from "../types";

export function useGenerateDigitalCorrespondencePdf() {
  return useMutation<GeneratedDigitalCorrespondencePdfDto, ApiClientError, GenerateDigitalCorrespondencePdfPayload>({
    mutationFn: ({ correspondenceId }) => generateDigitalGeneratedPdf(correspondenceId),
  });
}
