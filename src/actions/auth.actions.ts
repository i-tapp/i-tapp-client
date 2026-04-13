"use server";

import { mutate, query } from "@/lib/api";
import { actionClient } from "@/lib/safe-action";
import {
  companySignupSchema,
  resetPasswordSchema,
  signinSchema,
  signupSchema,
} from "@/schemas";

import { setAuthCookies } from "@/utils/cookies";
import * as z from "zod";

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
    await query("/auth/me");
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
    await setAuthCookies(token, user.role);
    await query("/auth/me");
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
    await query("/auth/me");
    return { token, role, user, profile };
  });

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
    },
  );

export const claimAccount = actionClient
  .inputSchema(resetPasswordSchema)
  .action(async ({ parsedInput: { npassword, token, cpassword } }) => {
    const response = await mutate(`/admin/claim?token=${token}`, {
      password: cpassword,
    });
    return response;
  });

export const requestPasswordReset = actionClient
  .inputSchema(
    z.object({
      email: z.email("Please enter a valid email address"),
    }),
  )
  .action(async ({ parsedInput: { email } }) => {
    const response = await mutate("/auth/password-reset/request", {
      email,
    });
    return response;
  });

export const verifyEmail = actionClient
  .inputSchema(
    z.object({
      token: z.string().min(1, "Token is required"),
    }),
  )
  .action(async ({ parsedInput: { token } }) => {
    const response = await query(`/auth/verify?token=${token}`);
    return response;
  });

export const resendEmailVerification = actionClient
  .inputSchema(
    z.object({
      email: z.string().min(1, "Email is required"),
    }),
  )
  .action(async ({ parsedInput: { email } }) => {
    const response = await mutate("/auth/resend-verification", { email });
    return response;
  });

export const changePassword = actionClient
  .inputSchema(resetPasswordSchema)
  .action(async ({ parsedInput: { npassword, token } }) => {
    const response = await mutate(
      `/auth/password-reset/confirm?token=${encodeURIComponent(token!)}`,
      {
        password: npassword,
      },
    );
    return response;
  });

export const companySignup = actionClient
  .inputSchema(companySignupSchema)
  .action(async ({ parsedInput }) => {
    const response = await mutate("/auth/signup/company", parsedInput);
    return response;
  });
