import { mutate, query } from "@/lib/api";
import { actionClient } from "@/lib/safe-action";
import {
  acceptSchema,
  companyProfileSchema,
  opportunityFormSchema,
  updateOpportunitySchema,
} from "@/lib/validations/auth";
import z from "zod";

/* -------------------------- Profile Actions -------------------------- */
export const updateCompanyProfile = actionClient
  .inputSchema(companyProfileSchema)
  .action(async ({ parsedInput }) => {
    console.log("Updating companys profile...", parsedInput);
    try {
      return {
        success: true,
        message: "Company profile updated successfully.",
      };
    } catch (error) {
      console.error("Error updating company profile:", error);
      return {
        success: false,
        message: "Failed to update company profile. Please try again.",
      };
    }
  });

/* -------------------------- Opportunity / Job Actions -------------------------- */
const createOpportunity = actionClient
  .inputSchema(opportunityFormSchema)
  .action(async ({ parsedInput }) => {
    console.log("Creating opportunity...");
    try {
      const response = await mutate("/opportunities", parsedInput);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

export const closeOpportunity = actionClient
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const response = await mutate(
        `/opportunities/${id}/`,
        { status: "closed" },
        "PATCH"
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

export const updateOpportunity = actionClient
  .inputSchema(updateOpportunitySchema)
  .action(async ({ parsedInput }) => {
    const { id, ...updateData } = parsedInput;
    try {
      const response = await mutate(
        `/opportunities/${id}`,
        updateData,
        "PATCH"
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

export const fetchCompanyJobs = actionClient.action(async () => {
  try {
    const response = await query("/company/jobs/all");
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log(error);
  }
});

/* -------------------------- Application Actions -------------------------- */
export const fetchAllCompanyApplications = actionClient.action(async () => {
  try {
    const response = await query("/company/all/category");
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log(error);
  }
});

export const createOffer = actionClient
  .inputSchema(acceptSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const response = await mutate(
        `/offers/${id}/create-offer/`,
        undefined,
        "POST"
      );
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

export const acceptApplication = actionClient
  .inputSchema(acceptSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const response = await mutate(
        `/applications/${id}/accept/`,
        undefined,
        "PATCH"
      );
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

export const declineApplication = actionClient
  .inputSchema(acceptSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const response = await mutate(
        `/applications/${id}/reject/`,
        undefined,
        "PATCH"
      );
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

export const bookmarkApplication = actionClient
  .inputSchema(acceptSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const response = await mutate(`/company/applicants/accept/`, id, "PATCH");
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

export { createOpportunity };
