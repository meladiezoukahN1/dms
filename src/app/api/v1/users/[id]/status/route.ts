import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/server/core/middleware/with-error-handler";
import { UsersService } from "@/server/modules/users/service";
import { AppError } from "@/server/core/errors/app-error";
import type { ApiResponse } from "@/shared/types/api-response";
import type { UserListItem } from "@/server/modules/users/types";

async function patchHandler(req: NextRequest): Promise<NextResponse> {
  const segments = req.nextUrl.pathname.split("/").filter(Boolean);
  // Path: /api/v1/users/{id}/status  →  id is second-to-last
  const id = segments[segments.length - 2];

  if (!id) {
    throw new AppError("BAD_REQUEST", 400, "معرف المستخدم مطلوب");
  }

  const body = await req.json();
  const user = await UsersService.updateStatus(id, body, req);

  return NextResponse.json(
    { success: true, data: user } satisfies ApiResponse<UserListItem>,
    { status: 200 }
  );
}

export const PATCH = withErrorHandler(patchHandler);
