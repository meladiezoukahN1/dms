import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/server/core/middleware/with-error-handler";
import { PasswordResetService } from "@/server/modules/auth/password-reset/service";

async function handler(req: NextRequest): Promise<NextResponse> {
  const body = await req.json();
  const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";

  const result = await PasswordResetService.resetPassword(body, { ipAddress, userAgent });
  return NextResponse.json({ success: true, data: result });
}

export const POST = withErrorHandler(handler);
