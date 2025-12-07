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

export const StudentProfileSchema = z.object({
  phone: z.string().optional(),
  bio: z.string().optional(),
  // gender: z.string().optional(),
  // dob: z.string().optional(),
  // address: z.string().optional(),
  techSkills: z.array(z.string()).optional(),
  softSkills: z.array(z.string()).optional(),
  preferredIndustry: z.string().optional(),
});

// Create the action
export const updateStudentProfile = actionClient

  .inputSchema(StudentProfileSchema)
  .action(async ({ parsedInput }) => {
    try {
      const response = await mutate("/s/profile", parsedInput, "PATCH");
      return response;
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  });

export const updateStudentProfilePicture = actionClient
  .inputSchema(
    z.object({
      profileImage: z.instanceof(File),
    })
  )
  .action(async ({ parsedInput: { profileImage } }) => {
    const formData = new FormData();

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      const response = await mutate("/s/profile-picture", formData, "PATCH");
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

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
