import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/server/core/middleware/with-error-handler";
import { RegisterService } from "@/server/modules/auth/register/service";
import type { ApiResponse } from "@/shared/types/api-response";
import type { RegisterOutput } from "@/server/modules/auth/register/types";

/**
 * POST /api/v1/auth/register
 * Register a new user
 * 
 * Keep route.ts thin - call service only
 */
async function handler(req: NextRequest): Promise<NextResponse> {
  const body = await req.json();

  // Get metadata
  const ipAddress =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";

  // Call service
  const result = await RegisterService.register(body, {
    ipAddress,
    userAgent,
  });

  return NextResponse.json(
    {
      success: true,
      data: result,
    } satisfies ApiResponse<RegisterOutput>,
    { status: 201 }
  );
}

export const POST = withErrorHandler(handler);
