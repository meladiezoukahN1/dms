import { ForbiddenError } from "@/server/core/errors/forbidden-error";

export class SessionPolicy {
  static assertAuthenticated(userId: string | null): asserts userId is string {
    if (!userId) {
      throw new ForbiddenError("غير مصرح");
    }
  }
}
