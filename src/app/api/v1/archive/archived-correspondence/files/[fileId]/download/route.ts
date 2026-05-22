import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/server/core/middleware/with-error-handler";
import { SessionService } from "@/server/modules/auth/session/service";
import { ArchivedCorrespondenceService } from "@/server/modules/archive/archived-correspondence/service";
import { ArchivedCorrespondenceValidator } from "@/server/modules/archive/archived-correspondence/validator";
import { AppError } from "@/server/core/errors/app-error";

async function getHandler(req: NextRequest, fileId: string): Promise<NextResponse> {
  const currentUser = await SessionService.getCurrentSessionUser(req);
  const validatedFileId = ArchivedCorrespondenceValidator.validateId(fileId, "معرّف الملف مطلوب");

  const fileAccess = await ArchivedCorrespondenceService.getDownloadFileAccess(
    validatedFileId,
    currentUser.status
  );

  if (!fileAccess.url) {
    throw new AppError("STORAGE_ERROR", 502, "رابط الملف غير متاح");
  }

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!blobToken) {
    throw new AppError("BLOB_STORAGE_NOT_CONFIGURED", 503, "BLOB_READ_WRITE_TOKEN غير مهيأ");
  }

  const blobResponse = await fetch(fileAccess.url, {
    headers: { Authorization: `Bearer ${blobToken}` },
  });

  if (!blobResponse.ok || !blobResponse.body) {
    throw new AppError("STORAGE_ERROR", 502, "تعذر استرداد الملف من التخزين");
  }

  return new NextResponse(blobResponse.body, {
    status: 200,
    headers: {
      "Content-Type": fileAccess.mimeType,
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(fileAccess.originalName)}`,
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ fileId: string }> }
) {
  const handler = withErrorHandler(async (request) => {
    const { fileId } = await context.params;
    return getHandler(request, fileId);
  });

  return handler(req);
}
