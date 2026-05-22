import { z } from "zod";

export const updateFinalArchiveSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب").optional(),
  referenceNumber: z.string().nullable().optional(),
  subject: z.string().nullable().optional(),
  direction: z.enum(["INCOMING", "OUTGOING", "INTERNAL"]).optional(),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).optional(),
  confidentiality: z.enum(["PUBLIC", "INTERNAL", "CONFIDENTIAL", "SECRET", "TOP_SECRET"]).optional(),
  correspondenceDate: z.string().nullable().optional(),
  archiveHandoverNotes: z.string().nullable().optional(),
});

export const archiveConfirmSchema = z.object({
  archiveCode: z.string().optional(),
  archiveLocation: z.string().optional(),
  shelf: z.string().optional(),
  boxNumber: z.string().optional(),
  retentionPolicy: z.string().optional(),
  notes: z.string().optional(),
});

export type UpdateFinalArchiveFormData = z.infer<typeof updateFinalArchiveSchema>;
export type ArchiveConfirmFormData = z.infer<typeof archiveConfirmSchema>;
