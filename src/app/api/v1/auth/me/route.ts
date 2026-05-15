import { NextResponse } from "next/server";
import { withErrorHandler } from "@/server/core/middleware/with-error-handler";
import { SessionService } from "@/server/modules/auth/session/service";

async function handler(): Promise<NextResponse> {
  const user = await SessionService.getCurrentSessionUser();
  return NextResponse.json({ success: true, data: user });
}

export const GET = withErrorHandler(handler);
