/**
 * Types for the registration module
 */

export interface RegisterInput {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  accountType: "individual" | "organization";
  organizationName?: string;
}

export interface RegisterOutput {
  id: string;
  email: string;
  fullName: string;
  accountType: string;
  createdAt: Date;
}

export interface CreateUserData {
  email: string;
  passwordHash: string;
  fullName: string;
  accountType: "individual" | "organization";
  organizationName?: string;
}
