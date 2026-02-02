"use server";

import { mutate } from "@/lib/api";
import { actionClient } from "@/lib/safe-action";

import {
  companySignupSchema,
  resetPasswordSchema,
  signinSchema,
  signupSchema,
} from "@/lib/validations/auth";
import { clearAuthCookies, setAuthCookies } from "@/utils/cookies";
import z from "zod";

export const signinStudent = actionClient
  .inputSchema(signinSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    const response = await mutate("/auth/signin", {
      email,
      password,
      role: "student",
    });
    const { user, token, profile } = response.data;
    await setAuthCookies(token, user.role);
    return { user, token, profile };
  });

export const signinCompany = actionClient
  .inputSchema(signinSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    const response = await mutate("/auth/signin", {
      email,
      password,
      role: "company",
    });
    const { token, user, role, profile } = response.data;
    await setAuthCookies(token, user.role, profile.companyOnboarded);
    return { token, role, user, profile };
  });

export const signinAdmin = actionClient
  .inputSchema(signinSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    const response = await mutate("/auth/signin", {
      email,
      password,
      role: "admin",
    });
    const { token, user, role, profile } = response.data;
    await setAuthCookies(token, user.role);
    return { token, role, user, profile };
  });

export const logout = async () => {
  await clearAuthCookies();
};

export const studentSignup = actionClient
  .inputSchema(signupSchema)
  .action(
    async ({
      parsedInput: {
        email,
        firstName,
        lastName,
        password,
        matriculation,
        school,
      },
    }) => {
      const response = await mutate("/auth/signup/student", {
        firstName,
        lastName,
        email,
        password,
        matriculationNumber: matriculation,
        school,
      });

      console.log(response);
    },
  );

export const resetPassword = actionClient
  .inputSchema(
    z.object({
      email: z.email("Please enter a valid email address"),
    }),
  )
  .action(async ({ parsedInput: { email } }) => {
    const response = await mutate("/auth/reset-password", {
      email,
    });
    return response;
  });

export const changePassword = actionClient
  .inputSchema(resetPasswordSchema)
  .action(async ({ parsedInput: { npassword, token } }) => {
    const response = await mutate("/auth/change-password", {
      token,
      password: npassword,
    });
    return response;
  });

export const companySignup = actionClient
  .inputSchema(companySignupSchema)
  .action(async ({ parsedInput }) => {
    const response = await mutate("/auth/signup/company", parsedInput);
    return response;
  });
