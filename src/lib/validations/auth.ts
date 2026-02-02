import {
  OpportunityMode,
  OpportunityStatus,
  OpportunityType,
} from "@/types/enums";
import { z } from "zod";

const modeValues = Object.values(OpportunityMode) as string[];
const statusValues = Object.values(OpportunityStatus) as string[];
const typeValues = Object.values(OpportunityType) as string[];

export const signinSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const companyIdSchema = z.object({
  companyId: z.string(),
});

export const companyStatusSchema = z.object({
  companyId: z.string(),
  status: z.enum([
    "pending",
    "under_review",
    "approved",
    "rejected",
    "suspended",
  ]),
});

export const signupSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  school: z.string().min(1),
  matriculation: z.string().min(1),
});

export const resetPasswordSchema = z
  .object({
    npassword: z.string().min(8, "Password must be at least 8 characters long"),
    cpassword: z.string().min(8, "Password must be at least 8 characters long"),
    token: z.string().optional(),
  })
  .refine((data) => data.npassword === data.cpassword, {
    message: "Passwords do not match",
    path: ["cpassword"], // 👈 attach error to confirm field
  });

export const acceptSchema = z.object({
  id: z.string(),
});

export const verifyStudentIdentitySchema = z.object({
  matNo: z
    .string()
    .min(1, "Please provide school matric or registration number"),
  school: z.string().min(1),
});

export const studentSignupSchema = z
  .object({
    email: z.email(),
    password: z.string().min(4, "Provide password"),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// export const verifyCompanySchema = z.object({
//   company_name: z.string().min(1, "Company name is required"),
//   email: z.email("Invalid email format"),
//   address: z.string().min(1, "Address is required"),
//   password: z.string().min(1, "Password is required"),
// });

export const companySignupSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  email: z
    .email("Please enter a valid email address")
    .min(1, "Email address is required"),
  registrationNumber: z
    .string()
    .min(1, "Company registration number is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const companyProfileSchema = z.object({
  website: z.url().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  logoImage: z.instanceof(File).optional(),
  bannerImage: z.instanceof(File).optional(),
});

export const opportunityFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  department: z.string().min(1, "Department is required"),
  industry: z.string().min(1, "Industry is required"),
  location: z.string().min(2, "Location is required"),
  mode: z.enum(modeValues),
  type: z.enum(typeValues),
  status: z.enum(statusValues),
  duration: z.number().int().positive(), // Remove z.coerce
  description: z.string().min(10, "Description must be at least 10 characters"),
  maxApplicants: z.number().optional(),
  applicationDeadline: z.string().optional(),
  autoCloseOnDeadline: z.boolean().optional(),
  resumeRequired: z.boolean().optional(),
  schoolLetterRequired: z.boolean().optional(),
  skills: z.string().optional(),
});

export const updateOpportunitySchema = opportunityFormSchema.extend({
  id: z.string().min(1, "Opportunity ID is required"),
});

// export const fullCompanySignupSchema =
//   verifyCompanySchema.merge(companySignupSchema);
