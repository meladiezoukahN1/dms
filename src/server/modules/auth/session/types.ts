import type { AccountStatus } from "@prisma/client";

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  status: AccountStatus;
}

export interface SessionPayload {
  userId: string | null;
}
