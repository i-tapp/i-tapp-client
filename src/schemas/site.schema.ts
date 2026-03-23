import * as z from "zod";

export const industries = [
  "tech",
  "education",
  "manufacturing",
  "health",
  "engineering",
  "other",
] as const;

export const studyFields = [
  "agriculture & related technology",
  "engineering and technology",
  "environmental science",
  "education",
  "medical science",
  "sciences",
  "management",
  "social sciences",
  "hospitality",
  "communications",
  "art",
  "other",
] as const;

export const onboardingSchema = z.object({
  // Company info
  companyName: z.string().min(2, "Company name is required"),
  address: z.string().min(1, "Office Address is required"),
  industry: z.string().min(1, "Industry is required"),
  industryOther: z.string().optional(),
  acceptingStudents: z.enum(["Yes", "No", "Soon"]),

  // Internship / Opportunity info
  internshipTitle: z.string().min(1, "Internship title is required"),
  stipend: z.enum(["stipend provided", "unpaid", "depends"]),
  location: z.string().optional(), // default to "Remote" if missing
  // type: z.enum(["INTERNSHIP", "JOB"]),
  // mode: z.enum(["REMOTE", "ONSITE", "HYBRID"]),
  preferredFieldsOfStudy: z
    .array(z.enum(studyFields))
    .min(1, "At least one field of study must be selected"),

  // Contact person info
  contact: z.object({
    name: z.string().min(2, "Contact name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    position: z.string().optional(),
  }),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;
