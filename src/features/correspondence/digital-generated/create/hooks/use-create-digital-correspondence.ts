"use client";

import { useMutation } from "@tanstack/react-query";
import { createDigitalGeneratedDraft } from "../api/digital-generated.api";
import type {
  ApiClientError,
  CreateDigitalCorrespondencePayload,
  CreatedDigitalCorrespondenceDto,
} from "../types";

export function useCreateDigitalCorrespondence() {
  return useMutation<CreatedDigitalCorrespondenceDto, ApiClientError, CreateDigitalCorrespondencePayload>({
    mutationFn: createDigitalGeneratedDraft,
  });
}
