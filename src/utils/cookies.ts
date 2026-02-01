"use server";

import { cookies } from "next/headers";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: "/",
};

export async function setAuthCookies(
  token: string,
  role: string,
  companyOnboarded?: boolean,
) {
  const store = await cookies();

  store.set("session-token", token, cookieOptions);
  store.set("role", role, cookieOptions);
  if (companyOnboarded !== undefined) {
    store.set(
      "company-onboarded",
      companyOnboarded ? "true" : "false",
      cookieOptions,
    );
  }
}

export async function clearAuthCookies() {
  const store = await cookies();
  store.delete("session-token");
  store.delete("role");
  store.delete("company-onboarded");
}
