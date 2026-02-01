import * as z from "zod";

export const profileFormSchema = z.object({
  industry: z.string().min(1, "Industry is required"),

  companySize: z.enum([
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "501-1000",
    "1000+",
  ]),
  foundedYear: z
    .string()
    .regex(/^\d{4}$/, "Enter a valid year")
    .optional(),
  website: z.url("Invalid URL").optional(),
  phone: z.string().min(7, "Phone number is too short").optional(),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  bio: z.string().max(500, "Bio must be at most 500 characters").optional(),
});

// 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const fileSchema = z
  .custom<File>((v) => v instanceof File, "File is required")
  .refine((file) => file.size <= MAX_FILE_SIZE, "Max file size is 10MB")
  .refine(
    (file) => ACCEPTED_MIME_TYPES.includes(file.type),
    "Only PDF, JPG, PNG, or WEBP allowed",
  );

export const kycFormSchema = z.object({
  // include this if you didn't collect it earlier or you want to confirm it
  registrationNumber: z.string().min(3, "Registration number is required"),

  // Confirm the address you already collected on Step 2, or allow editing here
  // confirmAddress: z.boolean().refine((v) => v === true, {
  //   message: "You must confirm the address matches your proof document",
  // }),

  // required documents
  cacDocument: fileSchema,
  proofOfAddress: fileSchema,

  // optional extras
  repId: z
    .custom<File | undefined>((v) => v === undefined || v instanceof File)
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      "Max file size is 10MB",
    )
    .refine(
      (file) => !file || ACCEPTED_MIME_TYPES.includes(file.type),
      "Only PDF, JPG, PNG, or WEBP allowed",
    )
    .optional(),
});

export const onBoardCompanySchema = profileFormSchema.extend(
  kycFormSchema.shape,
);
