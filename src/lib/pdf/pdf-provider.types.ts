/**
 * Unified types for PDF provider abstraction
 * 
 * Different providers (DocRaptor, PDFShift, etc.) are normalized
 * through this interface for consistent usage in service layer.
 */

/**
 * Request to generate PDF from HTML content
 */
export interface PdfGenerationRequest {
  html: string;
  filename?: string;
  options?: {
    pageSize?: "A4" | "LETTER";
    orientation?: "portrait" | "landscape";
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
  };
}

/**
 * Response from PDF generation (normalized across all providers)
 */
export interface PdfGenerationResult {
  pdfBytes: Buffer;
  mimeType: "application/pdf";
  byteLength: number;
  providerName: string;
  generatedAt: Date;
}

/**
 * Error response from PDF provider
 */
export interface PdfProviderError {
  code:
    | "PROVIDER_ERROR"
    | "INVALID_HTML"
    | "TIMEOUT"
    | "UNAUTHORIZED"
    | "RATE_LIMITED"
    | "SERVICE_UNAVAILABLE";
  message: string;
  statusCode: number;
  retryable: boolean;
  details?: Record<string, unknown>;
}

/**
 * DocRaptor-specific request payload
 */
export interface DocRaptorCreateDocumentRequest {
  user_credentials: string;
  doc: {
    document_content: string;
    document_type: "pdf" | "excel" | "html";
    test: boolean; // false = production credits used
    javascript?: boolean;
    prince_options?: {
      media?: string;
      baseurl?: string;
    };
  };
}

/**
 * DocRaptor response metadata
 */
export interface DocRaptorCreateDocumentResponse {
  status: "completed" | "failed";
  document_url?: string;
  error?: string;
}

/**
 * DocRaptor binary PDF body response
 */
export type DocRaptorAsyncDocumentResponse = Buffer;

/**
 * PDF provider configuration
 */
export interface PdfProviderConfig {
  provider: "docraptor" | "pdfshift";
  apiKey?: string;
  timeout?: number;
}
