import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/server/core/middleware/with-error-handler";
import { DigitalGeneratedService } from "@/server/modules/correspondence/digital-generated/service";
import { SessionService } from "@/server/modules/auth/session/service";
import { AppError } from "@/server/core/errors/app-error";
import type { ApiResponse } from "@/shared/types/api-response";
import type { GeneratePdfOutput } from "@/server/modules/correspondence/digital-generated/types";

/**
 * POST /api/v1/correspondence/digital-generated/[id]/generate-pdf
 * Generate PDF for a DRAFT correspondence
 */
async function baseHandler(req: NextRequest): Promise<NextResponse> {
  const currentUser = await SessionService.getCurrentSessionUser(req);

  const pathSegments = req.nextUrl.pathname.split("/").filter(Boolean);
  const id = pathSegments[pathSegments.length - 2];

  if (!id) {
    throw new AppError(
      "BAD_REQUEST",
      400,
      "معرف المراسلة مطلوب"
    );
  }

  // Get metadata
  const ipAddress =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";

  // Call service
  const result = await DigitalGeneratedService.generatePdf(
    { correspondenceId: id },
    currentUser.id,
    currentUser.status,
    {
      ipAddress,
      userAgent,
    }
  );

  return NextResponse.json(
    {
      success: true,
      data: result,
    } satisfies ApiResponse<GeneratePdfOutput>,
    { status: 200 }
  );
}

export const POST = withErrorHandler(baseHandler);
