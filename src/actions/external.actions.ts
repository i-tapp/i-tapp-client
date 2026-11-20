"use server";

import { mutate } from "@/lib/api";
import { actionClient } from "@/lib/safe-action";
import * as z from "zod";

// ---------------------------------------------------------------------------
// Applying to email / form listings (students and corps members)
// ---------------------------------------------------------------------------

const documentSchema = z.object({
  type: z.string(),
  url: z.string(),
  name: z.string().optional(),
});
const answerSchema = z.object({
  questionId: z.string(),
  answer: z.string(),
});

/** Apply to an email-category listing with its cover letter, documents and answers. */
export const applyExternal = actionClient
  .inputSchema(
    z.object({
      id: z.string().min(1),
      coverLetter: z.string().optional(),
      documents: z.array(documentSchema).optional(),
      answers: z.array(answerSchema).optional(),
    }),
  )
  .action(async ({ parsedInput: { id, ...body } }) => {
    const response = await mutate(`/a/${id}/apply`, body, "POST");
    return response as {
      success?: boolean;
      message?: string;
      requiresPayment?: boolean;
      fee?: number;
    };
  });

export const agreeToShare = actionClient
  .inputSchema(z.object({}))
  .action(async () => {
    return await mutate("/external-apply/consent", { agree: true }, "POST");
  });

export const uploadApplicationDocument = actionClient
  .inputSchema(z.object({ file: z.custom<File>((v) => v instanceof File) }))
  .action(async ({ parsedInput: { file } }) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await mutate("/external-apply/documents", formData, "POST");
    return response as { url: string; name: string };
  });

export const openFormListing = actionClient
  .inputSchema(z.object({ id: z.string().min(1) }))
  .action(async ({ parsedInput: { id } }) => {
    return await mutate(`/external-apply/form/${id}/open`, undefined, "POST");
  });

export const answerFormListing = actionClient
  .inputSchema(
    z.object({
      id: z.string().min(1),
      answer: z.enum(["yes", "not_yet", "no"]),
    }),
  )
  .action(async ({ parsedInput: { id, answer } }) => {
    return await mutate(`/external-apply/form/${id}/answer`, { answer }, "POST");
  });

// ---------------------------------------------------------------------------
// Public pages behind the links in application emails (no login)
// ---------------------------------------------------------------------------

export const removeListing = actionClient
  .inputSchema(z.object({ id: z.string().min(1), token: z.string().min(1) }))
  .action(async ({ parsedInput: { id, token } }) => {
    return await mutate(`/listing-links/${id}/remove`, { t: token }, "POST");
  });

export const startListingClaim = actionClient
  .inputSchema(z.object({ id: z.string().min(1), token: z.string().min(1) }))
  .action(async ({ parsedInput: { id, token } }) => {
    const response = await mutate(`/listing-links/${id}/claim-token`, { t: token }, "POST");
    return response as { claimToken: string };
  });

// ---------------------------------------------------------------------------
// Admin: posting listings on behalf of companies
// ---------------------------------------------------------------------------

/** Failures come back as data, so the form can show the full list of problems. */
async function structured<T>(run: () => Promise<T>) {
  try {
    return { ok: true as const, data: await run() };
  } catch (e: any) {
    return {
      ok: false as const,
      status: e?.status as number | undefined,
      message: (e?.message as string) ?? "Something went wrong",
      errors: (e?.data?.errors as string[] | undefined) ?? [],
      duplicates:
        (e?.data?.duplicates as
          | { id: string; title: string; organisationName: string | null; status: string }[]
          | undefined) ?? [],
    };
  }
}

const anyObject = z.record(z.string(), z.any());

export const saveAdminListing = actionClient
  .inputSchema(z.object({ id: z.string().optional(), data: anyObject }))
  .action(async ({ parsedInput: { id, data } }) =>
    structured(() =>
      id
        ? mutate(`/admin/listings/${id}`, data, "PATCH")
        : mutate("/admin/listings", data, "POST"),
    ),
  );

export const publishAdminListing = actionClient
  .inputSchema(z.object({ id: z.string(), force: z.boolean().optional() }))
  .action(async ({ parsedInput: { id, force } }) =>
    structured(() => mutate(`/admin/listings/${id}/publish`, { force: !!force }, "POST")),
  );

export const pauseAdminListing = actionClient
  .inputSchema(z.object({ id: z.string(), paused: z.boolean() }))
  .action(async ({ parsedInput: { id, paused } }) =>
    structured(() => mutate(`/admin/listings/${id}/${paused ? "pause" : "resume"}`, undefined, "POST")),
  );

export const deleteAdminListing = actionClient
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id } }) =>
    structured(() => mutate(`/admin/listings/${id}`, undefined, "DELETE")),
  );

export const saveEmailTemplate = actionClient
  .inputSchema(z.object({ subject: z.string(), body: z.string() }))
  .action(async ({ parsedInput }) =>
    structured(() => mutate("/admin/email-template", parsedInput, "PUT")),
  );

export const resetEmailTemplate = actionClient.action(async () =>
  structured(() => mutate("/admin/email-template/reset", undefined, "POST")),
);

export const sendAdminListingTest = actionClient
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id } }) =>
    structured(() => mutate(`/admin/listings/${id}/test-email`, undefined, "POST")),
  );

export const checkListingUrl = actionClient
  .inputSchema(z.object({ url: z.string() }))
  .action(async ({ parsedInput: { url } }) =>
    structured(() => mutate("/admin/listings/check-url", { url }, "POST")),
  );

export const checkListingDuplicates = actionClient
  .inputSchema(anyObject)
  .action(async ({ parsedInput }) =>
    structured(() => mutate("/admin/listings/check-duplicates", parsedInput, "POST")),
  );

export const uploadListingLogo = actionClient
  .inputSchema(z.object({ file: z.custom<File>((v) => v instanceof File) }))
  .action(async ({ parsedInput: { file } }) =>
    structured(async () => {
      const formData = new FormData();
      formData.append("file", file);
      return (await mutate("/admin/listings/logo", formData, "POST")) as { url: string };
    }),
  );
