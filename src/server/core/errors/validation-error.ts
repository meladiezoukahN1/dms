import { AppError } from "./app-error";

/**
 * Validation error for Zod validation failures
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    public fieldErrors: Record<string, string[]>
  ) {
    super("VALIDATION_ERROR", 400, message, { fieldErrors });
    this.name = "ValidationError";
  }
}
