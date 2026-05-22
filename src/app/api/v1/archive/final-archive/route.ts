import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/server/core/middleware/with-error-handler";
import { SessionService } from "@/server/modules/auth/session/service";
import { FinalArchiveService } from "@/server/modules/archive/final-archive/service";
import type { ApiResponse } from "@/shared/types/api-response";
import type { FinalArchiveListOutput } from "@/server/modules/archive/final-archive/types";

async function getHandler(req: NextRequest): Promise<NextResponse> {
  const currentUser = await SessionService.getCurrentSessionUser(req);

  const result = await FinalArchiveService.list(
    {
      page: req.nextUrl.searchParams.get("page") ?? undefined,
      pageSize: req.nextUrl.searchParams.get("pageSize") ?? undefined,
      search: req.nextUrl.searchParams.get("search") ?? undefined,
      sourceType: req.nextUrl.searchParams.get("sourceType") ?? undefined,
      direction: req.nextUrl.searchParams.get("direction") ?? undefined,
      priority: req.nextUrl.searchParams.get("priority") ?? undefined,
      confidentiality: req.nextUrl.searchParams.get("confidentiality") ?? undefined,
      dateFrom: req.nextUrl.searchParams.get("dateFrom") ?? undefined,
      dateTo: req.nextUrl.searchParams.get("dateTo") ?? undefined,
    },
    currentUser.status
  );

  return NextResponse.json(
    {
      success: true,
      data: result,
    } satisfies ApiResponse<FinalArchiveListOutput>,
    { status: 200 }
  );
}

export const GET = withErrorHandler(getHandler);
