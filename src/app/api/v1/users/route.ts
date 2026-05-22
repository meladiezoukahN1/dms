import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/server/core/middleware/with-error-handler";
import { UsersService } from "@/server/modules/users/service";
import type { ApiResponse } from "@/shared/types/api-response";
import type { UserListOutput, UserListItem } from "@/server/modules/users/types";

async function getHandler(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = req.nextUrl;
  const result = await UsersService.list(
    {
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined,
      search: searchParams.get("search") ?? undefined,
    },
    req
  );

  return NextResponse.json(
    { success: true, data: result } satisfies ApiResponse<UserListOutput>,
    { status: 200 }
  );
}

async function postHandler(req: NextRequest): Promise<NextResponse> {
  const body = await req.json();
  const user = await UsersService.create(body, req);

  return NextResponse.json(
    { success: true, data: user } satisfies ApiResponse<UserListItem>,
    { status: 201 }
  );
}

export const GET = withErrorHandler(getHandler);
export const POST = withErrorHandler(postHandler);
