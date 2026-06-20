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

  for (const name of ["session-token", "role", "skip-student-onboarding", "skip-company-onboarding"]) {
    store.delete(name);
    store.set(name, "", { ...options, maxAge: 0 });
  }
}
