import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/server/core/middleware/with-error-handler";
import { SessionService } from "@/server/modules/auth/session/service";
import { ArchivedCorrespondenceService } from "@/server/modules/archive/archived-correspondence/service";
import type { ApiResponse } from "@/shared/types/api-response";
import type { ArchivedCorrespondenceListOutput } from "@/server/modules/archive/archived-correspondence/types";

async function getHandler(req: NextRequest): Promise<NextResponse> {
  const currentUser = await SessionService.getCurrentSessionUser(req);

  const result = await ArchivedCorrespondenceService.list(
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
      archiveDateFrom: req.nextUrl.searchParams.get("archiveDateFrom") ?? undefined,
      archiveDateTo: req.nextUrl.searchParams.get("archiveDateTo") ?? undefined,
    },
    currentUser.status
  );

  return NextResponse.json(
    {
      success: true,
      data: result,
    } satisfies ApiResponse<ArchivedCorrespondenceListOutput>,
    { status: 200 }
  );
}

export const GET = withErrorHandler(getHandler);
