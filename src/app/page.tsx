import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { ROUTES } from "@/shared/constants/routes";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    redirect(ROUTES.DASHBOARD.HOME);
  }
  redirect(ROUTES.PUBLIC.LOGIN);
}
