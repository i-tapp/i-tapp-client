import { mutate, query } from "@/lib/api";
import { actionClient } from "@/lib/safe-action";
import { verifyStudentIdentitySchema } from "@/lib/validations/auth";
import z from "zod";

const applyJ = z.object({
  id: z.string(),
});

export const acceptOffer = actionClient
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const response = await mutate(
        `/offers/${id}/accept/`,
        undefined,
        "PATCH"
      );
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

export const declineOffer = actionClient
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const response = await mutate(
        `/offers/${id}/decline/`,
        undefined,
        "PATCH"
      );
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

export const apply = actionClient
  .inputSchema(applyJ)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const response = await mutate(`/applications/${id}/apply`);
      return response?.data;
    } catch (error) {
      console.log(error);
      throw error; // Ensure the error is propagated back to the frontend
    }
  });

export const withdraw = actionClient
  .inputSchema(applyJ)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const response = await mutate(
        `/applications/${id}/withdraw`,
        undefined,
        "PATCH"
      );
      return response?.data;
    } catch (error) {
      console.log(error);
      throw error; // Ensure the error is propagated back to the frontend
    }
  });

export const save = actionClient
  .inputSchema(applyJ)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const response = await mutate(`/applications/${id}/apply`);
      return response;
    } catch (error) {
      console.log(error);
      throw error; // Ensure the error is propagated back to the frontend
    }
  });

const updateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  bio: z.string().optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
});

// Create the action
export const updateProfile = actionClient

  .inputSchema(updateProfileSchema)
  .action(
    async ({
      parsedInput: { firstName, lastName, email, phoneNumber, bio, password },
    }) => {
      try {
        const response = await mutate("/student/profile", {
          firstName,
          lastName,
          email,
          phoneNumber,
          bio,
          password,
        });
        return response.data;
      } catch (error) {
        console.error("Profile update error:", error);
        return {
          success: false,
          message: "Failed to update profile. Please try again.",
        };
      }
    }
  );

export const verifyStudentIdentity = actionClient

  .inputSchema(verifyStudentIdentitySchema)
  .action(async ({ parsedInput: { matNo } }) => {
    // return true;
    const response = await query(`/s/matric/${encodeURIComponent(matNo)}`, {
      // matriculation: matNo,
    });
    console.log("student data retrieved", response);
    return response;
  });
