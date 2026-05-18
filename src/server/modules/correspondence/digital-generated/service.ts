import { DigitalGeneratedValidator } from "./validator";
import { DigitalGeneratedPolicy } from "./policy";
import { DigitalGeneratedWorkflow } from "./workflow";
import { DigitalGeneratedRepository } from "./repository";
import { AppError } from "@/server/core/errors/app-error";
import type { CreateDraftOutput, GeneratePdfOutput } from "./types";
import type { AccountStatus } from "@prisma/client";
import { renderCorrespondenceToHtml } from "./template";
import { generatePdf } from "@/lib/pdf/pdf-provider-client";
import { uploadBufferToVercelBlob } from "@/lib/storage/vercel-blob-storage";

/**
 * Service for DIGITAL_GENERATED correspondence business logic
 * 
 * Responsibilities:
 * - Validator dispatch
 * - Policy enforcement
 * - Guarded PDF generation flow
 * - Repository coordination
 * - Transaction orchestration
 */
export class DigitalGeneratedService {
  /**
   * Create DRAFT correspondence
   */
  static async createDraft(
    payload: unknown,
    currentUserId: string,
    userStatus: AccountStatus,
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<CreateDraftOutput> {
    // Validate input
    const input = DigitalGeneratedValidator.validateCreateDraft(payload);

    // Enforce policy
    DigitalGeneratedPolicy.enforceCanCreateDraft(userStatus);

    // Execute transaction with audit logging
    return DigitalGeneratedRepository.executeCreateDraftTransaction(
      {
        ...input,
        createdById: currentUserId,
      },
      metadata
    );
  }

  /**
   * Generate PDF for correspondence.
   *
   * Orchestrates the complete PDF generation workflow:
   * 1. Load correspondence data
   * 2. Render to HTML with Arabic/RTL support
   * 3. Generate PDF using DocRaptor
   * 4. Upload PDF to Vercel Blob
   * 5. Commit all changes atomically to database
   *
   * If any step fails before DB commit, no changes are persisted.
   */
  static async generatePdf(
    payload: unknown,
    currentUserId: string,
    userStatus: AccountStatus,
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<GeneratePdfOutput> {
    // Validate input
    const input = DigitalGeneratedValidator.validateGeneratePdf(payload);

    // Load correspondence for guard checks
    const correspondence = await DigitalGeneratedRepository.findCorrespondenceForPdfGeneration(
      input.correspondenceId
    );

    if (!correspondence) {
      throw new AppError(
        "NOT_FOUND",
        404,
        "المراسلة غير موجودة"
      );
    }

    // Enforce policy
    DigitalGeneratedPolicy.enforceCanGeneratePdf(
      userStatus,
      correspondence.createdById,
      currentUserId
    );

    if (correspondence.sourceType !== "DIGITAL_GENERATED") {
      throw new AppError(
        "INVALID_SOURCE_TYPE",
        400,
        "المراسلة ليست من نوع DIGITAL_GENERATED"
      );
    }

    // Enforce workflow transition
    DigitalGeneratedWorkflow.enforceTransition(correspondence.status, "GENERATED");

    // Load full correspondence data for rendering
    const fullCorrespondence =
      await DigitalGeneratedRepository.findCorrespondenceForRendering(
        input.correspondenceId
      );

    if (!fullCorrespondence) {
      throw new AppError(
        "NOT_FOUND",
        404,
        "فشل في تحميل بيانات المراسلة"
      );
    }

    // 1. Render correspondence to HTML
    const html = renderCorrespondenceToHtml(fullCorrespondence);

    // 2. Generate PDF using DocRaptor
    const pdfResult = await generatePdf({
      html,
      filename: `correspondence_${input.correspondenceId}.pdf`,
      options: {
        pageSize: "A4",
        orientation: "portrait",
        margin: { top: 20, right: 20, bottom: 20, left: 20 },
      },
    });

    // 3. Upload PDF to Vercel Blob
    const blobResult = await uploadBufferToVercelBlob({
      pathname: `correspondence/${input.correspondenceId}.pdf`,
      contentType: "application/pdf",
      buffer: pdfResult.pdfBytes,
    });

    // 4. Execute transaction to save to database
    const result = await DigitalGeneratedRepository.executeGeneratePdfTransaction(
      input.correspondenceId,
      pdfResult.pdfBytes,
      blobResult.url,
      blobResult.storageKey,
      currentUserId,
      metadata
    );

    return result;
  }
}
