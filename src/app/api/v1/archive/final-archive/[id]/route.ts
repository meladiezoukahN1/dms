import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/server/core/middleware/with-error-handler";
import { SessionService } from "@/server/modules/auth/session/service";
import { FinalArchiveService } from "@/server/modules/archive/final-archive/service";
import { AppError } from "@/server/core/errors/app-error";
import type { ApiResponse } from "@/shared/types/api-response";
import type { UpdateFinalArchiveOutput } from "@/server/modules/archive/final-archive/types";

async function patchHandler(req: NextRequest): Promise<NextResponse> {
  const currentUser = await SessionService.getCurrentSessionUser(req);

  const pathSegments = req.nextUrl.pathname.split("/").filter(Boolean);
  const id = pathSegments[pathSegments.length - 1];

  if (!id) {
    throw new AppError("BAD_REQUEST", 400, "معرف المراسلة مطلوب");
  }

  const body = await req.json();

  const userAgent = req.headers.get("user-agent") || "unknown";

  const result = await FinalArchiveService.updateMetadata(
    id,
    body,
    currentUser.id,
    currentUser.status,
    {
      userAgent,
    }
  );

  return NextResponse.json(
    {
      success: true,
      data: result,
    } satisfies ApiResponse<UpdateFinalArchiveOutput>,
    { status: 200 }
  );
}

export const PATCH = withErrorHandler(patchHandler);
