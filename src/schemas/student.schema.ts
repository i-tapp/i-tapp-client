import * as z from "zod";
import { fileSchema } from "./company.schema";
import { StudentProfileSchema } from "@/actions";

export const documentStepSchema = z.object({
  itLetter: fileSchema,
  cv: fileSchema.optional(),
});

export const schoolInfoSchema = z.object({
  school: z.string().min(1, "School name is required"),
  courseOfStudy: z.string().min(1, "Field of study is required"),
  level: z.string().min(1, "Level is required"),
  gpa: z.string().optional(),
  degreeType: z.enum(["OND", "BSC", "MSC"], "Select a valid degree type"),
  graduationYear: z.string().min(1, "Graduation year is required"),
  phone: z.string().min(10, "Phone number is too short"),
});

export const preferencesSchema = z.object({
  preferredWorkMode: z.enum(["remote", "onsite", "hybrid"]),
  internshipDuration: z.enum(["1-3 months", "3-6 months", "6+ months"]),
  preferredIndustry: z
    .array(z.string())
    .min(1, "Select at least one area of interest"),
  availableStartDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
});

export const studentOnboardingSchema = schoolInfoSchema
  .extend(preferencesSchema.shape)
  .extend(documentStepSchema.shape);

export type DocumentSchema = z.infer<typeof documentStepSchema>;
export type PreferencesSchema = z.infer<typeof preferencesSchema>;
export type SchoolInfoSchema = z.infer<typeof schoolInfoSchema>;
export type StudentProfileFormData = z.infer<typeof StudentProfileSchema>;
