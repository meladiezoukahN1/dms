import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/server/core/middleware/with-error-handler";
import { SessionService } from "@/server/modules/auth/session/service";
import { ArchiveHandoverService } from "@/server/modules/correspondence/archive-handover/service";
import { AppError } from "@/server/core/errors/app-error";
import type { ApiResponse } from "@/shared/types/api-response";
import type { SendToArchiveOutput } from "@/server/modules/correspondence/archive-handover/types";

async function postHandler(req: NextRequest): Promise<NextResponse> {
  const currentUser = await SessionService.getCurrentSessionUser(req);

  const pathSegments = req.nextUrl.pathname.split("/").filter(Boolean);
  const id = pathSegments[pathSegments.length - 2];

  if (!id) {
    throw new AppError("BAD_REQUEST", 400, "معرف المراسلة مطلوب");
  }

  const body = await req.json().catch(() => ({}));

  const ipAddress =
    req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";

  const result = await ArchiveHandoverService.sendToArchive(
    id,
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
    } satisfies ApiResponse<SendToArchiveOutput>,
    { status: 200 }
  );
}

export const POST = withErrorHandler(postHandler);
