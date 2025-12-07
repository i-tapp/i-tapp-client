// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const roleRedirects: Record<string, string> = {
  student: "/portal/find-it-space",
  company: "/portal/overview/dashboard",
  admin: "/admin",
};

export function proxy(req: NextRequest) {
  const token = req.cookies.get("session-token")?.value;
  const role = req.cookies.get("role")?.value;
  const { pathname } = req.nextUrl;

  console.log("parsing middleware:", { pathname, role, token });

  const isAdminRoute = pathname.startsWith("/admin");
  const isPortalRoute = pathname.startsWith("/portal");
  const isAuthRoute = [
    "/signin",
    "/signup",
    "/company/signin",
    "/company/signup",
    "/auth",
  ].includes(pathname);

  // Case 0: Token but no role → reset cookies and force re-login
  if (token && !role) {
    const response = NextResponse.redirect(new URL("/signin", req.url));
    response.cookies.delete("session-token");
    response.cookies.delete("role");
    return response;
  }

  if (isAdminRoute) {
    if (!token || role !== "admin") {
      return NextResponse.redirect(new URL("/auth", req.url));
    }
    const response = NextResponse.next();
    if (role) response.headers.set("x-user-role", role);
    return response;
  }

  if (isPortalRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    const response = NextResponse.next();
    if (role) response.headers.set("x-user-role", role);
    return response;
  }

  // Case 1: Not logged in → block portal access
  // if (!token && pathname.startsWith("/portal")) {
  //   if (pathname.startsWith("/portal/overview")) {
  //     return NextResponse.redirect(new URL("/company/signin", req.url));
  //   }

  //   if (pathname.startsWith("/portal/find-it-space")) {
  //     return NextResponse.redirect(new URL("/signin", req.url));
  //   }

  //   return NextResponse.redirect(new URL("/signin", req.url));
  // }

  // Case 2: Logged in and on signin → push to role page
  if (isAuthRoute && token) {
    if (role && roleRedirects[role]) {
      return NextResponse.redirect(new URL(roleRedirects[role], req.url));
    }
  }

  // Case 3: Logged in and at the bare "/portal"
  if (pathname === "/portal") {
    if (role && roleRedirects[role]) {
      return NextResponse.redirect(new URL(roleRedirects[role], req.url));
    }
  }

  const response = NextResponse.next();
  if (role) response.headers.set("x-user-role", role);
  return response;
}

export const config = {
  matcher: [
    "/portal/:path*",
    "/admin/:path*",
    "/signin",
    "/signup",
    "/company/signin",
    "/company/signup",
    "/auth",
  ],
};
