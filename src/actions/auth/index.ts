"use server";

import { mutate } from "@/lib/api";
import { actionClient } from "@/lib/safe-action";

import {
  fullCompanySignupSchema,
  signinSchema,
  signupSchema,
} from "@/lib/validations/auth";
import { clearAuthCookies, setAuthCookies } from "@/utils/cookies";

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
    await setAuthCookies(token, user.role);
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
      console.log(email);
      try {
        const response = await mutate("/auth/signup/student", {
          firstName,
          lastName,
          email,
          password,
          matriculationNumber: matriculation,
          school,
        });

        console.log(response);
      } catch (error) {
        console.log(error);

        throw error;
      }
    }
  );

export const companySignup = actionClient

  .inputSchema(fullCompanySignupSchema)
  .action(
    async ({
      parsedInput: {
        address,
        company_name,
        email,
        it_duration,
        password,
        rc_number,
        student_capacity,
        year_founded,
      },
    }) => {
      const response = await mutate("/company/create", {
        address,
        company_name,
        email,
        it_duration,
        password,
        rc_number,
        student_capacity,
        year_founded,
      });

      console.log(response);

      return response;
    }
  );
