import type { AccountStatus } from "@prisma/client";

export interface UserListItem {
  id: string;
  fullName: string;
  email: string;
  accountType: string | null;
  status: AccountStatus;
  createdAt: Date;
}

export interface UserListQuery {
  page: number;
  pageSize: number;
  search?: string;
}

export interface UserListOutput {
  items: UserListItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateUserInput {
  fullName: string;
  email: string;
  password: string;
  accountType: string;
}

export interface UpdateUserStatusInput {
  status: AccountStatus;
}
