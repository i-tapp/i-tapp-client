// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "./utils";
// import { env } from "process";

const roleRedirects: Record<string, string> = {
  student: "/portal/find-it-space",
  company: "/portal/dashboard",
  admin: "/admin",
};

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_BACKEND_API_URL;

async function me(token: string) {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch profile:", response.statusText);
    return null;
  }
  return response.json();
}

export async function proxy(req: NextRequest) {
  const skipStudentOnboarding =
    req.cookies.get("skip-student-onboarding")?.value === "true";
  const skipCompanyOnboarding =
    req.cookies.get("skip-company-onboarding")?.value === "true";
  // do for email verification routes later
  const token = req.cookies.get("session-token")?.value; // || "fake-token";
  const role = req.cookies.get("role")?.value; // || "admin";
  const { pathname } = req.nextUrl;

  const isCompanyRole = role === "company";
  const isStudentRole = role === "student";

  const isCompanyOnboardingRoute = pathname.startsWith("/portal/onboarding");
  const isStudentOnboardingRoute = pathname.startsWith("/portal/onboarding");
  // do for email verification routes later
  const isAdminRoute = pathname.startsWith("/admin");
  const isProfileRoute = pathname.startsWith("/portal/profile");
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
    response.cookies.delete("company-onboarded");
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

  if (pathname === "/portal") {
    if (!token) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    if (role && roleRedirects[role]) {
      return NextResponse.redirect(new URL(roleRedirects[role], req.url));
    }
  }

  if (isPortalRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    const profile = await me(token); // await me(token);
    // console.log("Profile:", profile);

    // const role = profile?.role; // "student" | "company" | "admin"
    // const company = profile?.company;
    // const student = profile?.student;
    const companyOnboarded = profile?.company?.isOnboarded === true; // boolean
    const studentOnboarded = profile?.student?.isOnboarded === true; // boolean

    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (isCompanyRole) {
      const canSkip = companyOnboarded || skipCompanyOnboarding;

      if (canSkip && isCompanyOnboardingRoute) {
        return NextResponse.redirect(new URL("/portal/dashboard", req.url));
      }

      // && !isProfileRoute

      if (!canSkip && !isCompanyOnboardingRoute) {
        return NextResponse.redirect(new URL("/portal/onboarding/", req.url));
      }
    }

    if (isStudentRole) {
      const canSkip = studentOnboarded || skipStudentOnboarding;

      if (canSkip && isStudentOnboardingRoute) {
        return NextResponse.redirect(new URL("/portal/find-it-space", req.url));
      }

      if (!canSkip && !isStudentOnboardingRoute) {
        return NextResponse.redirect(new URL("/portal/onboarding/", req.url));
      }
    }

    const response = NextResponse.next();
    if (role) response.headers.set("x-user-role", role);
    return response;
  }

  if (isAuthRoute && token) {
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
    "/company/:path*",
    "/auth",
  ],
};
