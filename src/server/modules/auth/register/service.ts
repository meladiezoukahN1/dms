import { hash } from "bcryptjs";
import { RegisterValidator } from "./validator";
import { RegisterRepository } from "./repository";
import { RegisterPolicy } from "./policy";
import { AppError } from "@/server/core/errors/app-error";
import type { RegisterOutput } from "./types";

/**
 * Service for registration business logic
 * Contains orchestration only
 */
export class RegisterService {
  static async register(
    payload: unknown,
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<RegisterOutput> {
    const input = RegisterValidator.validate(payload);

    // Check policy
    if (!RegisterPolicy.canRegister()) {
      throw new AppError("FORBIDDEN", 403, "Registration is not allowed");
    }

    if (
      input.accountType === "organization" &&
      !RegisterPolicy.canRegisterAsOrganization()
    ) {
      throw new AppError(
        "FORBIDDEN",
        403,
        "Organization registration is not allowed"
      );
    }

    // Hash password - business logic
    const passwordHash = await hash(input.password, 12);

    // Execute transaction through repository
    return RegisterRepository.executeRegisterTransaction(
      {
        email: input.email,
        passwordHash,
        fullName: input.fullName,
        accountType: input.accountType,
        organizationName: input.organizationName,
      },
      metadata
    );
  }
}
