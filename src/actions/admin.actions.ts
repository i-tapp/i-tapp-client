// import { createCompanySchema } from "@/app/(superuser)/(admin)/admin/company/new";
import { createCompanySchema } from "@/schemas/company.schema";
import { createStudentSchema } from "@/app/(superuser)/(admin)/admin/student/new";
import { mutate } from "@/lib/api";
import { actionClient } from "@/lib/safe-action";
import {
  companyIdSchema,
  companyStatusSchema,
  reviewDocumentSchema,
} from "@/schemas";

import * as z from "zod";

export const approveCompany = actionClient
  .inputSchema(companyIdSchema)
  .action(async ({ parsedInput: { companyId } }) => {
    const response = await mutate(`/admin/company/approve`, { companyId });
    return { success: true, data: response };
  });

export const declineCompany = actionClient
  .inputSchema(companyIdSchema)
  .action(async ({ parsedInput: { companyId } }) => {
    const response = await mutate(`/admin/company/decline`, { companyId });
    return { success: true, data: response };
  });

export const updateCompanyStatus = actionClient
  .inputSchema(companyStatusSchema)
  .action(async ({ parsedInput: { companyId, status } }) => {
    const response = await mutate(
      `/c/${companyId}/status`,
      {
        companyId,
        status,
      },
      "PATCH",
    );
    return { success: true, data: response };
  });

export const reviewCompanyDocuments = actionClient
  .inputSchema(reviewDocumentSchema)
  .action(async ({ parsedInput }) => {
    const response = await mutate(
      `/c/documents/review/${parsedInput.companyId}`,
      parsedInput,
      "PATCH",
    );
    return { success: true, data: response };
  });

export const createStudent = actionClient
  .inputSchema(createStudentSchema)
  .action(async ({ parsedInput }) => {
    const response = await mutate(`/admin/create-student`, parsedInput);
    return { success: true, data: response };
  });

export const inviteCompany = actionClient
  .inputSchema(createCompanySchema)
  .action(async ({ parsedInput }) => {
    const response = await mutate(`/admin/invite-company`, parsedInput);
    return { success: true, data: response };
  });

export const updateStudentStatus = actionClient
  .inputSchema(
    z.object({
      studentId: z.string().min(1, "Student ID is required"),
      status: z.enum(["active", "inactive", "suspended"]),
    }),
  )
  .action(async ({ parsedInput: { studentId, status } }) => {
    const response = await mutate(
      `/s/${studentId}/status`,
      {
        studentId,
        status,
      },
      "PATCH",
    );
    return { success: true, data: response };
  });

export const updateOpportunityStatus = actionClient
  .inputSchema(
    z.object({
      opportunityId: z.string().min(1, "Opportunity ID is required"),
      status: z.enum(["open", "closed", "flagged"]),
    }),
  )
  .action(async ({ parsedInput: { opportunityId, status } }) => {
    const response = await mutate(
      `/o/${opportunityId}/admin/status`,
      {
        opportunityId,
        status,
      },
      "PATCH",
    );
    return { success: true, data: response };
  });

export const createAdmin = actionClient
  .inputSchema(
    z.object({
      username: z.string().min(1, "Username is required"),
      email: z.email("Invalid email address"),
      role: z.enum(["superadmin", "admin", "moderator", "support"]),
    }),
  )
  .action(async ({ parsedInput: { username, email, role } }) => {
    const response = await mutate(`/admin/`, {
      email,
      username,
      role,
    });
    return { success: true, data: response };
  });

export const updateAdminRole = actionClient
  .inputSchema(
    z.object({
      adminId: z.string().min(1, "Admin ID is required"),
      role: z.enum(["superadmin", "admin", "moderator", "support"]),
    }),
  )
  .action(async ({ parsedInput: { adminId, role } }) => {
    const response = await mutate(
      `/admin/role/${adminId}`,
      {
        role,
      },
      "PATCH",
    );
    return { success: true, data: response };
  });

// export const logout = actionClient.schema(logoutSchema).action(async ({}) => {
//   (await cookies()).set("token", "", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//     expires: new Date(0),
//     path: "/",
//   });

//   return {};
// });
