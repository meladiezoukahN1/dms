import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const PUBLIC_AUTH_PATHS = ["/login", "/register", "/forgot-password", "/reset-password"];

export const proxy = withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Redirect authenticated users away from public auth pages → dashboard
    if (token && PUBLIC_AUTH_PATHS.some((p) => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const { pathname } = req.nextUrl;

        // Always allow: auth pages, root, NextAuth API, public auth API
        if (
          pathname === "/" ||
          PUBLIC_AUTH_PATHS.some((p) => pathname.startsWith(p)) ||
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/api/v1/auth")
        ) {
          return true;
        }

        // Everything else (dashboard, settings, api/v1/…) requires a valid token
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
