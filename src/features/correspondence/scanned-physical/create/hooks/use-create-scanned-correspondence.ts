"use client";

import { useMutation } from "@tanstack/react-query";
import { createScannedPhysicalCorrespondence } from "../api/scanned-physical.api";
import type { ApiClientError, CreateScannedPhysicalPayload, CreatedScannedPhysicalDto } from "../types";

export function useCreateScannedCorrespondence() {
  return useMutation<CreatedScannedPhysicalDto, ApiClientError, CreateScannedPhysicalPayload>({
    mutationFn: createScannedPhysicalCorrespondence,
  });
}
