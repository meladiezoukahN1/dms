import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/server/core/middleware/with-error-handler";
import { SessionService } from "@/server/modules/auth/session/service";
import { ScannedPhysicalService } from "@/server/modules/correspondence/scanned-physical/service";
import type { ApiResponse } from "@/shared/types/api-response";
import type { CreateScannedPhysicalOutput } from "@/server/modules/correspondence/scanned-physical/types";

function getString(form: FormData, key: string): string | undefined {
  const value = form.get(key);
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

async function handler(req: NextRequest): Promise<NextResponse> {
  const currentUser = await SessionService.getCurrentSessionUser(req);
  const form = await req.formData();

  const fileEntry = form.get("file");
  const file = fileEntry instanceof File ? fileEntry : null;

  const payload = {
    title: getString(form, "title"),
    referenceNumber: getString(form, "referenceNumber"),
    subject: getString(form, "subject"),
    direction: getString(form, "direction"),
    correspondenceDate: getString(form, "correspondenceDate"),
    priority: getString(form, "priority"),
    confidentiality: getString(form, "confidentiality"),
    senderDepartmentId: getString(form, "senderDepartmentId"),
    receiverDepartmentId: getString(form, "receiverDepartmentId"),
    senderEntityId: getString(form, "senderEntityId"),
    receiverEntityId: getString(form, "receiverEntityId"),
    notes: getString(form, "notes"),
  };

  const ipAddress =
    req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";

  const result = await ScannedPhysicalService.createIntake(
    payload,
    file,
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
    } satisfies ApiResponse<CreateScannedPhysicalOutput>,
    { status: 201 }
  );
}

export const POST = withErrorHandler(handler);
