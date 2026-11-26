import { query } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

/** Has this student / corps member agreed to share details with companies? */
export const useFetchShareConsent = (enabled = true) =>
  useQuery({
    queryKey: ["share-consent"],
    queryFn: async () =>
      (await query("/external-apply/consent")) as {
        consented: boolean;
        version: string | null;
      },
    enabled,
  });

/** The cover letter a template-mode listing pre-fills for this applicant. */
export const useFetchCoverLetterDraft = (id?: string, enabled = true) =>
  useQuery({
    queryKey: ["cover-letter-draft", id],
    queryFn: async () =>
      (await query(`/external-apply/cover-letter/${id}`)) as { text: string },
    enabled: !!id && enabled,
    staleTime: Infinity,
  });

export const useFetchAdminListings = (filter: {
  status?: string;
  method?: string;
  search?: string;
  page?: number;
}) =>
  useQuery({
    queryKey: ["admin-listings", filter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter.status) params.set("status", filter.status);
      if (filter.method) params.set("method", filter.method);
      if (filter.search?.trim()) params.set("search", filter.search.trim());
      params.set("page", String(filter.page ?? 1));
      return await query(`/admin/listings?${params.toString()}`);
    },
  });

export const useFetchAdminListing = (id?: string) =>
  useQuery({
    queryKey: ["admin-listing", id],
    queryFn: async () => await query(`/admin/listings/${id}`),
    enabled: !!id,
  });

/** The admin-editable subject and opening of the application email. */
export type EmailTemplateData = {
  subject: string;
  body: string;
  isDefault: boolean;
  updatedAt: string | null;
  updatedBy: string | null;
  defaults: { subject: string; body: string };
  placeholders: { key: string; label: string; sample: string }[];
};

export const useFetchEmailTemplate = () =>
  useQuery({
    queryKey: ["email-template"],
    queryFn: async () => (await query("/admin/email-template")) as EmailTemplateData,
  });

/** Application emails that never left PlaceIT (see the admin recovery panel). */
export type UndeliveredApplication = {
  id: string;
  applicantName: string;
  applicantType: "student" | "nysc";
  listingTitle: string;
  organisationName: string | null;
  appliedAt: string;
  attempts: number;
  reason: string;
  retryable: boolean;
};

export const useFetchUndelivered = () =>
  useQuery({
    queryKey: ["undelivered-applications"],
    queryFn: async () =>
      (await query("/admin/application-emails/undelivered")) as UndeliveredApplication[],
  });
