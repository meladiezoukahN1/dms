import type { AccountStatus } from "@prisma/client";

export interface CredentialsInput {
  email: string;
  password: string;
}

export interface CredentialUserRecord {
  id: string;
  email: string;
  fullName: string;
  passwordHash: string;
  status: AccountStatus;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  status: AccountStatus;
}
