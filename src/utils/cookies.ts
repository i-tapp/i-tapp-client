"use server";

import { cookies } from "next/headers";

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: "/",
};

export async function setAuthCookies(token: string, role: string) {
  const store = await cookies();

  store.set("session-token", token, options);
  store.set("role", role, options);
}
