import { NextRequest, NextResponse } from "next/server";
import { AppError } from "../errors/app-error";
import { AuditLogger } from "@/lib/audit/audit-logger";

/**
 * Higher-order function to wrap route handlers with error handling
 */
export function withErrorHandler(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error) {
      const ipAddress = req.headers.get("x-forwarded-for") || 
                       req.headers.get("x-real-ip") || 
                       "unknown";
      const userAgent = req.headers.get("user-agent") || "unknown";

      // Log to audit trail
      await AuditLogger.log({
        action: "ERROR",
        entityType: "SYSTEM",
        entityId: req.url,
        metadata: {
          ipAddress,
          userAgent,
          errorMessage: error instanceof Error ? error.message : String(error),
        },
      });

      // Handle known app errors
      if (error instanceof AppError) {
        return NextResponse.json(error.toJSON(), {
          status: error.statusCode,
        });
      }

      // Handle unexpected errors
      console.error("Unhandled error:", error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred",
          },
        },
        { status: 500 }
      );
    }
  };
}
