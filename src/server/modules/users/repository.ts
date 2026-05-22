import { prisma } from "@/lib/prisma/client";
import type { AccountStatus } from "@prisma/client";
import type { CreateUserInput, UserListItem, UserListOutput, UserListQuery } from "./types";

export class UsersRepository {
  static async getList(query: UserListQuery): Promise<UserListOutput> {
    const { page, pageSize, search } = query;
    const skip = (page - 1) * pageSize;

    const where = search
      ? {
          OR: [
            { fullName: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : undefined;

    const [items, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        select: {
          id: true,
          fullName: true,
          email: true,
          accountType: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return { items: items as UserListItem[], total, page, pageSize };
  }

  static async findByEmail(email: string): Promise<{ id: string } | null> {
    return prisma.user.findUnique({ where: { email }, select: { id: true } });
  }

  static async create(
    data: CreateUserInput & { passwordHash: string }
  ): Promise<UserListItem> {
    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        passwordHash: data.passwordHash,
        accountType: data.accountType,
        status: "ACTIVE",
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        accountType: true,
        status: true,
        createdAt: true,
      },
    });
    return user as UserListItem;
  }

  static async updateStatus(
    id: string,
    status: AccountStatus
  ): Promise<UserListItem> {
    const user = await prisma.user.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        fullName: true,
        email: true,
        accountType: true,
        status: true,
        createdAt: true,
      },
    });
    return user as UserListItem;
  }

  static async findById(id: string): Promise<{ id: string } | null> {
    return prisma.user.findUnique({ where: { id }, select: { id: true } });
  }

  static async findForAuth(
    id: string
  ): Promise<{ id: string; status: import("@prisma/client").AccountStatus; accountType: string | null } | null> {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, status: true, accountType: true },
    });
  }
}
