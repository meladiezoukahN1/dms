import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/server/core/middleware/with-error-handler";
import { SessionService } from "@/server/modules/auth/session/service";
import { ArchiveHandoverService } from "@/server/modules/correspondence/archive-handover/service";
import type { ApiResponse } from "@/shared/types/api-response";
import type { ArchiveHandoverListOutput } from "@/server/modules/correspondence/archive-handover/types";

async function getHandler(req: NextRequest): Promise<NextResponse> {
  const currentUser = await SessionService.getCurrentSessionUser(req);

  const result = await ArchiveHandoverService.list(
    {
      page: req.nextUrl.searchParams.get("page") ?? undefined,
      pageSize: req.nextUrl.searchParams.get("pageSize") ?? undefined,
      search: req.nextUrl.searchParams.get("search") ?? undefined,
      sourceType: req.nextUrl.searchParams.get("sourceType") ?? undefined,
      status: req.nextUrl.searchParams.get("status") ?? undefined,
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
    } satisfies ApiResponse<ArchiveHandoverListOutput>,
    { status: 200 }
  );
}

export const GET = withErrorHandler(getHandler);
