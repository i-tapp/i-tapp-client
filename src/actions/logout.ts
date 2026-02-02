"use server";

import { cookies } from "next/headers";

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function logout() {
  const store = await cookies();
  store.delete("session-token");
  store.delete("role");

  store.set("session-token", "", { ...options, maxAge: 0 });
  store.set("role", "", { ...options, maxAge: 0 });
}
