import { mutate, query } from "@/lib/api";
import { actionClient } from "@/lib/safe-action";
import {
  studentOnboardingSchema,
  verifyStudentIdentitySchema,
} from "@/schemas";
import * as z from "zod";

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
        "PATCH",
      );
      return response;
    } catch (error) {
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
        "PATCH",
      );
      return response;
    } catch (error) {
      throw error;
    }
  });

export const apply = actionClient
  .inputSchema(applyJ)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const response = await mutate(`/a/${id}/apply`);
      return { success: true, data: response?.data };
    } catch (error: any) {
      const is402 =
        error?.status === 402 ||
        error?.data?.statusCode === 402 ||
        error?.data?.requiresPayment === true;
      if (is402) {
        // Parse fee from message as fallback (e.g. "A fee of ₦2,500 is required...")
        const feeFromMessage = (() => {
          const match = String(error?.data?.message ?? "").match(/[\d,]+/);
          return match ? parseInt(match[0].replace(/,/g, ""), 10) : 2500;
        })();
        return {
          requiresPayment: true as const,
          fee: (error?.data?.fee ?? feeFromMessage) as number,
          message: (error?.data?.message ?? "A fee is required to submit this application.") as string,
        };
      }
      throw error;
    }
  });

export const initializePayment = actionClient
  .inputSchema(
    z.object({
      opportunityId: z.string(),
      coverLetter: z.string().optional(),
      resumeUrl: z.string().optional(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const response = await mutate("/payments/initialize", parsedInput, "POST");
    return response as { authorizationUrl: string; reference: string };
  });

export const withdraw = actionClient
  .inputSchema(applyJ)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const response = await mutate(`/a/${id}/withdraw`, undefined, "PATCH");
      return response?.data;
    } catch (error) {
      throw error;
    }
  });

export const save = actionClient
  .inputSchema(applyJ)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const response = await mutate(`/o/${id}/saved`, undefined);
      return response;
    } catch (error) {
      throw error;
    }
  });

export const StudentProfileSchema = z.object({
  phone: z.string().optional(),
  bio: z.string().optional(),
  // gender: z.string().optional(),
  dob: z.string().optional(),
  address: z.string().optional(),
  techSkills: z.array(z.string()).optional(),
  softSkills: z.array(z.string()).optional(),
  preferredIndustry: z.string().optional(),
});

export const updateStudentProfile = actionClient

  .inputSchema(StudentProfileSchema)
  .action(async ({ parsedInput }) => {
    try {
      const response = await mutate("/s/profile", parsedInput, "PATCH");
      return response;
    } catch (error) {
      throw error;
    }
  });

export const updateStudentProfilePicture = actionClient
  .inputSchema(
    z.object({
      profileImage: z.instanceof(File),
    }),
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
      throw error;
    }
  });

export const verifyStudentIdentity = actionClient
  .inputSchema(verifyStudentIdentitySchema)
  .action(async ({ parsedInput: { matNo } }) => {
    const response = await query(`/s/matric/${encodeURIComponent(matNo)}`, {
    });
    return response;
  });

function appendToFormData(fd: FormData, key: string, value: unknown) {
  if (value === undefined || value === null) return;

  if (value instanceof File) {
    fd.append(key, value, value.name);
    return;
  }

  if (value instanceof Blob) {
    fd.append(key, value);
    return;
  }

  if (Array.isArray(value)) {
    fd.append(key, JSON.stringify(value));
    return;
  }

  if (typeof value === "object") {
    fd.append(key, JSON.stringify(value));
    return;
  }
  fd.append(key, String(value));
}

export const onBoardStudent = actionClient
  .inputSchema(studentOnboardingSchema)
  .action(async ({ parsedInput }) => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(parsedInput)) {
      appendToFormData(formData, key, value);
    }

    const response = await mutate("/s/onboarding", formData, "POST");
    return response;
  });
