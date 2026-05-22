export type UserAccountType = "admin" | "staff";

export type UserStatus = "ACTIVE" | "SUSPENDED" | "DEACTIVATED";

export interface UserDto {
  id: string;
  fullName: string;
  email: string;
  accountType: string | null;
  status: UserStatus;
  createdAt: string;
}

export interface UsersListResponseDto {
  items: UserDto[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UsersQueryState {
  page: number;
  pageSize: number;
  search?: string;
}

export interface CreateUserPayload {
  fullName: string;
  email: string;
  password: string;
  accountType: UserAccountType;
}

export interface UpdateStatusPayload {
  status: UserStatus;
}

export class ApiClientError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(opts: { status: number; code?: string; message: string; details?: unknown }) {
    super(opts.message);
    this.name = "ApiClientError";
    this.status = opts.status;
    this.code = opts.code;
    this.details = opts.details;
  }
}
