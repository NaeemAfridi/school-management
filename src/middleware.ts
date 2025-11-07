// ============================================
// File: middleware.ts
// ============================================

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // If user not approved, block dashboard access
    if (token?.approvalStatus !== "approved") {
      if (
        pathname.startsWith("/admin") ||
        pathname.startsWith("/teacher") ||
        pathname.startsWith("/student") ||
        pathname.startsWith("/parent")
      ) {
        return NextResponse.redirect(new URL("/pending-approval", req.url));
      }
    }

    // Role-based route protection
    const roleRoutes = {
      admin: ["/admin"],
      teacher: ["/teacher"],
      student: ["/student"],
      parent: ["/parent"],
    };

    for (const [role, routes] of Object.entries(roleRoutes)) {
      if (routes.some((route) => pathname.startsWith(route))) {
        if (token?.role !== role) {
          const redirectMap: Record<string, string> = {
            admin: "/admin",
            teacher: "/teacher",
            student: "/student",
            parent: "/parent",
          };
          return NextResponse.redirect(
            new URL(redirectMap[token?.role as string] || "/login", req.url)
          );
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/teacher/:path*",
    "/student/:path*",
    "/parent/:path*",
    "/api/admin/:path*",
    "/api/teacher/:path*",
    "/api/student/:path*",
    "/api/parent/:path*",
  ],
};
