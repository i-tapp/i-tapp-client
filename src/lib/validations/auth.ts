import { z } from "zod";

export const signinSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const logoutSchema = z.object({});

export const companyIdSchema = z.object({
  companyId: z.string(),
});

export const signupSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  school: z.string().min(1),
  matriculation: z.string().min(1),
});

export const acceptSchema = z.object({
  studentId: z.string(),
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

export const verifyCompanySchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  email: z.email("Invalid email format"),
  address: z.string().min(1, "Address is required"),
  password: z.string().min(1, "Password is required"),
});

export const companySignupSchema = z.object({
  rc_number: z.string().min(1, "RC number is required"),
  year_founded: z.string().min(1, "Year founded is required"),
  student_capacity: z.string().min(1, "Student capacity must be at least 1"),
  it_duration: z.string().min(1, "IT duration must be at least 1"),
  // companyId: z.string().min(1, "Company ID is required"),
});

export const companyProfileSchema = z.object({
  phone: z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  studentCapacity: z.number().optional(),
  profilePicture: z.any().optional(),
  bannerImage: z.any().optional(),
});

export const createSpaceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Title must be at least 2 characters"),
  industry: z.string().min(2, "Industry must be at least 2 characters"),
  level: z.string().min(2, "Industry must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  duration: z.coerce.number().int().positive(),
  // showAvailability: z.boolean().default(false),
});

export const fullCompanySignupSchema =
  verifyCompanySchema.merge(companySignupSchema);
