import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { CredentialsService } from "@/server/modules/auth/credentials/service";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await CredentialsService.authenticate({
          email: credentials?.email,
          password: credentials?.password,
        });

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          status: user.status,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.status = user.status;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.status = token.status as string;
      }
      return session;
    },
  },
};
