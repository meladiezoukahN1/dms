import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth/auth";

export interface CurrentUser {
  id: string;
  email?: string | null;
  name?: string | null;
  status?: string;
}

export async function getCurrentUser(
  request?: NextRequest
): Promise<CurrentUser | null> {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      status: session.user.status,
    };
  }

  if (!request) {
    return null;
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  });

  if (!token?.sub) {
    const origin = new URL(request.url).origin;
    const cookieHeader = request.headers.get("cookie");

    const sessionResponse = await fetch(`${origin}/api/auth/session`, {
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      cache: "no-store",
    });

    if (!sessionResponse.ok) {
      return null;
    }

    const fallbackSession = (await sessionResponse.json()) as {
      user?: {
        id?: string;
        email?: string | null;
        name?: string | null;
        status?: string;
      };
    };

    if (!fallbackSession.user?.id) {
      return null;
    }

    return {
      id: fallbackSession.user.id,
      email: fallbackSession.user.email,
      name: fallbackSession.user.name,
      status: fallbackSession.user.status,
    };
  }

  return {
    id: token.sub,
    email: typeof token.email === "string" ? token.email : null,
    name: typeof token.name === "string" ? token.name : null,
    status: typeof token.status === "string" ? token.status : undefined,
  };
}
