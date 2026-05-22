import { z } from "zod";

export const archivedCorrespondenceListSchema = z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1).max(100),
  search: z.string().optional(),
  sourceType: z.enum(["DIGITAL_GENERATED", "SCANNED_PHYSICAL"]).optional(),
  direction: z.enum(["INCOMING", "OUTGOING", "INTERNAL"]).optional(),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).optional(),
  confidentiality: z
    .enum(["PUBLIC", "INTERNAL", "CONFIDENTIAL", "SECRET", "TOP_SECRET"])
    .optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  archiveDateFrom: z.string().optional(),
  archiveDateTo: z.string().optional(),
});

export const archivedCorrespondenceIdSchema = z.string().min(1);
