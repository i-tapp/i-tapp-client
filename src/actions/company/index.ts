import { mutate, query } from "@/lib/api";
import { actionClient } from "@/lib/safe-action";
import {
  acceptSchema,
  companyProfileSchema,
  opportunityFormSchema,
  updateOpportunitySchema,
} from "@/lib/validations/auth";
import { start } from "repl";
import z from "zod";

/* -------------------------- Profile Actions -------------------------- */
export const updateCompanyProfile = actionClient
  .inputSchema(companyProfileSchema)
  .action(async ({ parsedInput }) => {
    console.log("Updating company profile...", parsedInput);
    const formData = new FormData();

    if (parsedInput.logoImage) {
      formData.append("logo", parsedInput.logoImage);
    }

    if (parsedInput.bannerImage) {
      formData.append("banner", parsedInput.bannerImage);
    }

    if (parsedInput.website) {
      formData.append("website", parsedInput.website);
    }
    if (parsedInput.address) {
      formData.append("address", parsedInput.address);
    }

    if (parsedInput.description) {
      formData.append("description", parsedInput.description);
    }

    try {
      const response = await mutate(
        "/company/profile/update",
        formData,
        "PATCH"
      );
      console.log("Update company profile response:", response);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
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

export const deleteOffer = actionClient
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const response = await mutate(`/offers/${id}/`, undefined, "DELETE");
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

export const createOffer = actionClient
  .inputSchema(
    z.object({
      id: z.string(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      file: z.any().optional(),
      stipend: z.string().optional(),
    })
  )
  .action(async ({ parsedInput }) => {
    console.log("Creating offer...", parsedInput);

    const formData = new FormData();

    if (parsedInput.startDate) {
      formData.append("startDate", parsedInput.startDate);
    }

    if (parsedInput.endDate) {
      formData.append("endDate", parsedInput.endDate);
    }
    if (parsedInput.stipend) {
      formData.append("stipend", parsedInput.stipend);
    }
    if (parsedInput.file) {
      formData.append("letter", parsedInput.file);
    }

    try {
      const response = await mutate(
        `/offers/${parsedInput.id}/create-offer/`,
        formData,
        "POST"
      );

      console.log("create offer response", response);
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
