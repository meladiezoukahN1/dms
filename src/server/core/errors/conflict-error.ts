import { AppError } from "./app-error";

/**
 * Conflict error for when a resource already exists
 */
export class ConflictError extends AppError {
  constructor(message: string, resource: string) {
    super("CONFLICT", 409, message, { resource });
    this.name = "ConflictError";
  }
}
