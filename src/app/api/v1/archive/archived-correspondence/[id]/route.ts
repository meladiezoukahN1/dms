import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/server/core/middleware/with-error-handler";
import { SessionService } from "@/server/modules/auth/session/service";
import { ArchivedCorrespondenceService } from "@/server/modules/archive/archived-correspondence/service";
import { ArchivedCorrespondenceValidator } from "@/server/modules/archive/archived-correspondence/validator";
import type { ApiResponse } from "@/shared/types/api-response";
import type { ArchivedCorrespondenceDetailOutput } from "@/server/modules/archive/archived-correspondence/types";

async function getHandler(req: NextRequest, id: string): Promise<NextResponse> {
  const currentUser = await SessionService.getCurrentSessionUser(req);
  const validatedId = ArchivedCorrespondenceValidator.validateId(id, "معرّف المراسلة مطلوب");

  const result = await ArchivedCorrespondenceService.getDetail(validatedId, currentUser.status);

  return NextResponse.json(
    {
      success: true,
      data: result,
    } satisfies ApiResponse<ArchivedCorrespondenceDetailOutput>,
    { status: 200 }
  );
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const handler = withErrorHandler(async (request) => {
    const { id } = await context.params;
    return getHandler(request, id);
  });

  return handler(req);
}
