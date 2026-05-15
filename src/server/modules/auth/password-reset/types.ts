import type { AccountStatus } from "@prisma/client";

export interface ForgotPasswordInput {
  email: string;
}

export interface VerifyResetOtpInput {
  email: string;
  otp: string;
}

export interface ResetPasswordInput {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

export interface PasswordResetTokenRecord {
  id: string;
  userId: string;
  otpHash: string;
  expiresAt: Date;
  usedAt: Date | null;
}

export interface PasswordResetUserRecord {
  id: string;
  email: string;
  fullName: string;
  status: AccountStatus;
}

export interface PasswordResetMetadata {
  ipAddress?: string;
  userAgent?: string;
}
