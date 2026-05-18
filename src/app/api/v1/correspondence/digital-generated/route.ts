import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/server/core/middleware/with-error-handler";
import { DigitalGeneratedService } from "@/server/modules/correspondence/digital-generated/service";
import { SessionService } from "@/server/modules/auth/session/service";
import type { ApiResponse } from "@/shared/types/api-response";
import type { CreateDraftOutput } from "@/server/modules/correspondence/digital-generated/types";

/**
 * POST /api/v1/correspondence/digital-generated
 * Create a DRAFT correspondence
 * 
 * Keep route.ts thin - call service only
 */
async function handler(req: NextRequest): Promise<NextResponse> {
  const currentUser = await SessionService.getCurrentSessionUser(req);

  const body = await req.json();

  // Get metadata
  const ipAddress =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";

  // Call service
  const result = await DigitalGeneratedService.createDraft(
    body,
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
    } satisfies ApiResponse<CreateDraftOutput>,
    { status: 201 }
  );
}

export const POST = withErrorHandler(handler);
