/**
 * PDF Provider Client
 * 
 * Exports the unified PDF generation interface.
 * Currently uses DocRaptor; can be extended to support multiple providers.
 */

import { generatePdfWithDocRaptor } from "./docraptor-provider";
import type {
  PdfGenerationRequest,
  PdfGenerationResult,
} from "./pdf-provider.types";

/**
 * Generate PDF from HTML content
 *
 * Central entry point for PDF generation.
 * Delegates to configured provider (currently DocRaptor).
 *
 * @param request - HTML and rendering options
 * @returns PDF as buffer with metadata
 * @throws AppError for all failure modes
 */
export async function generatePdf(
  request: PdfGenerationRequest
): Promise<PdfGenerationResult> {
  return generatePdfWithDocRaptor(request);
}

export type { PdfGenerationRequest, PdfGenerationResult };
