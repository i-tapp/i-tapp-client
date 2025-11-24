import { mutate, query } from "@/lib/api";
import { actionClient } from "@/lib/safe-action";
import { acceptSchema, opportunityFormSchema } from "@/lib/validations/auth";

/* -------------------------- Profile Actions -------------------------- */
export const updateCompanyProfile = actionClient.action(async () => {
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
  .action(
    async ({ parsedInput: { title, duration, description, industry } }) => {
      try {
        const response = await mutate("/company/job/new", {
          title,
          duration,
          description,
          industry,
        });
        return response.data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  );

export const updateSpace = actionClient
  .inputSchema(opportunityFormSchema)
  .action(
    async ({
      parsedInput: {
        title,
        duration,
        mode,
        type,
        status,
        description,
        industry,
      },
    }) => {
      try {
        const response = await mutate(
          `/company/job/update/`,
          { title, mode, type, status, duration, description, industry },
          "PUT"
        );
        return response.data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  );

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
