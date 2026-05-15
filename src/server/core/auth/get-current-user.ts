import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  status: string;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email || !session.user.name) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    status: session.user.status,
  };
}
