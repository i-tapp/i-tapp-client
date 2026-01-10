import { mutate } from "@/lib/api";
import { actionClient } from "@/lib/safe-action";
import { companyIdSchema, companyStatusSchema } from "@/lib/validations/auth";
import z from "zod";

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
      `/company/${companyId}/status`,
      {
        companyId,
        status,
      },
      "PATCH"
    );
    return { success: true, data: response };
  });

export const updateStudentStatus = actionClient
  .inputSchema(
    z.object({
      studentId: z.string().min(1, "Student ID is required"),
      status: z.enum(["active", "inactive", "suspended"]),
    })
  )
  .action(async ({ parsedInput: { studentId, status } }) => {
    const response = await mutate(
      `/s/${studentId}/status`,
      {
        studentId,
        status,
      },
      "PATCH"
    );
    return { success: true, data: response };
  });

export const updateOpportunityStatus = actionClient
  .inputSchema(
    z.object({
      opportunityId: z.string().min(1, "Opportunity ID is required"),
      status: z.enum(["open", "closed", "flagged"]),
    })
  )
  .action(async ({ parsedInput: { opportunityId, status } }) => {
    const response = await mutate(
      `/o/${opportunityId}/admin/status`,
      {
        opportunityId,
        status,
      },
      "PATCH"
    );
    return { success: true, data: response };
  });

export const createAdmin = actionClient
  .inputSchema(
    z.object({
      username: z.string().min(1, "Username is required"),
      email: z.email("Invalid email address"),
      role: z.enum(["superadmin", "admin", "moderator", "support"]),
    })
  )
  .action(async ({ parsedInput: { username, email, role } }) => {
    const response = await mutate(`/admins/`, {
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
    })
  )
  .action(async ({ parsedInput: { adminId, role } }) => {
    const response = await mutate(
      `/admins/role/${adminId}`,
      {
        role,
      },
      "PATCH"
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
