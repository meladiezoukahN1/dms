import { ZodError } from "zod";

/**
 * Format Zod errors into field error format
 */
export function formatZodError(
  error: ZodError
): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};

  error.issues.forEach((err) => {
    const path = err.path.join(".");
    if (!fieldErrors[path]) {
      fieldErrors[path] = [];
    }
    fieldErrors[path].push(err.message);
  });

  return fieldErrors;
}
