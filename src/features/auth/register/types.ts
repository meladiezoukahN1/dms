/**
 * Frontend types for the registration feature
 */

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  accountType: "individual" | "organization";
  organizationName?: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  fullName: string;
  accountType: string;
  createdAt: string;
}

export interface RegistrationError {
  code: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
}
