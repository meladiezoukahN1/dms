import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/server/core/middleware/with-error-handler";
import { PasswordResetService } from "@/server/modules/auth/password-reset/service";

async function handler(req: NextRequest): Promise<NextResponse> {
  const body = await req.json();
  const result = await PasswordResetService.verifyResetOtp(body);

  return NextResponse.json({
    success: true,
    data: result,
  });
}

export const POST = withErrorHandler(handler);
