import { AppError } from "@/server/core/errors/app-error";
import type {
  PdfGenerationRequest,
  PdfGenerationResult,
  PdfProviderError,
} from "./pdf-provider.types";

/**
 * DocRaptor PDF provider client
 * 
 * Uses native fetch only (no SDK dependency).
 * Supports HTML/CSS with RTL and Arabic rendering.
 * API: https://docraptor.com/docs
 */

const DOCRAPTOR_API_URL = "https://docraptor.com/docs";
const DEFAULT_TIMEOUT_MS = 30000;

function getApiKey(): string {
  const key = process.env.DOCRAPTOR_API_KEY?.trim();

  if (!key) {
    throw new AppError(
      "PDF_PROVIDER_NOT_CONFIGURED",
      503,
      "DOCRAPTOR_API_KEY environment variable is not set"
    );
  }

  return key;
}

function getTimeoutMs(): number {
  const timeoutStr = process.env.PDF_GENERATION_TIMEOUT_MS;

  if (!timeoutStr) {
    return DEFAULT_TIMEOUT_MS;
  }

  const parsed = parseInt(timeoutStr, 10);
  return isNaN(parsed) ? DEFAULT_TIMEOUT_MS : Math.max(5000, parsed);
}

/**
 * Create AbortController with timeout
 */
function createAbortController(timeoutMs: number): {
  signal: AbortSignal;
  timeoutId: NodeJS.Timeout;
} {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return { signal: controller.signal, timeoutId };
}

/**
 * Generate PDF from HTML using DocRaptor
 *
 * @param request - HTML content and options
 * @returns PDF as buffer
 * @throws AppError for various failure modes
 */
export async function generatePdfWithDocRaptor(
  request: PdfGenerationRequest
): Promise<PdfGenerationResult> {
  const apiKey = getApiKey();
  const timeoutMs = getTimeoutMs();
  const { signal, timeoutId } = createAbortController(timeoutMs);

  try {
    const response = await fetch(DOCRAPTOR_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_credentials: apiKey,
        doc: {
          document_content: request.html,
          document_type: "pdf",
          test: false, // Use production credits
          javascript: false, // No JS execution needed
          prince_options: {
            baseurl: undefined, // Files will be inline data URIs
          },
        },
      }),
      signal,
    });

    // Handle timeout abort
    if (!response.ok && response.status === 0) {
      throw new AppError(
        "TIMEOUT",
        504,
        "PDF generation timed out after " + timeoutMs + "ms"
      );
    }

    // Handle API errors
    if (!response.ok) {
      const errorText = await response.text();
      const isRetryable = response.status >= 500;

      if (response.status === 401 || response.status === 403) {
        throw new AppError(
          "UNAUTHORIZED",
          403,
          "DocRaptor API authentication failed",
          { statusCode: response.status, retryable: false }
        );
      }

      if (response.status === 400) {
        throw new AppError(
          "INVALID_HTML",
          400,
          "Invalid HTML content or formatting",
          { statusCode: response.status, retryable: false, error: errorText }
        );
      }

      if (response.status === 429) {
        throw new AppError(
          "RATE_LIMITED",
          429,
          "DocRaptor rate limit exceeded",
          { statusCode: response.status, retryable: true }
        );
      }

      if (isRetryable) {
        throw new AppError(
          "SERVICE_UNAVAILABLE",
          response.status,
          "DocRaptor service temporarily unavailable",
          { statusCode: response.status, retryable: true, error: errorText }
        );
      }

      throw new AppError(
        "PROVIDER_ERROR",
        response.status,
        "DocRaptor API returned an error: " + response.status,
        { statusCode: response.status, retryable: false, error: errorText }
      );
    }

    // Response should be binary PDF
    if (!response.headers.get("content-type")?.includes("pdf")) {
      throw new AppError(
        "PROVIDER_ERROR",
        500,
        "Invalid response from DocRaptor: not a PDF",
        { contentType: response.headers.get("content-type") }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const pdfBytes = Buffer.from(arrayBuffer);

    return {
      pdfBytes,
      mimeType: "application/pdf",
      byteLength: pdfBytes.byteLength,
      providerName: "DocRaptor",
      generatedAt: new Date(),
    };
  } catch (error) {
    clearTimeout(timeoutId);

    // Re-throw AppErrors as-is
    if (error instanceof AppError) {
      throw error;
    }

    // Handle abort (timeout)
    if (error instanceof Error && error.name === "AbortError") {
      throw new AppError(
        "TIMEOUT",
        504,
        "PDF generation request timed out"
      );
    }

    // Handle network errors
    if (error instanceof TypeError) {
      throw new AppError(
        "SERVICE_UNAVAILABLE",
        503,
        "Failed to connect to DocRaptor: " + error.message,
        { retryable: true }
      );
    }

    // Unexpected errors
    throw new AppError(
      "PROVIDER_ERROR",
      500,
      "Unexpected error during PDF generation: " +
        (error instanceof Error ? error.message : String(error))
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Create normalized error from provider response
 */
export function normalizePdfProviderError(
  error: AppError
): PdfProviderError {
  const retryableCodes = [
    "TIMEOUT",
    "RATE_LIMITED",
    "SERVICE_UNAVAILABLE",
  ];

  return {
    code: (error.code as unknown as PdfProviderError["code"]) || "PROVIDER_ERROR",
    message: error.message,
    statusCode: error.statusCode,
    retryable: retryableCodes.includes(error.code),
    details: error.details,
  };
}
