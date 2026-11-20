import { query } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export type CompanyBilling = {
  state: "trial" | "paid" | "expired";
  hasAccess: boolean;
  trialEndsAt: string;
  paidUntil: string | null;
  accessUntil: string;
  daysLeft: number;
  feeNaira: number;
  periodDays: number;
};

/** The logged-in company's free-trial / paid state. */
export const useFetchCompanyBilling = () =>
  useQuery({
    queryKey: ["company-billing"],
    queryFn: async () => (await query("/payments/company/billing")) as CompanyBilling,
  });

export type EarningsSummary = {
  totalEarned: number;
  successCount: number;
  today: { amount: number; count: number };
  thisMonth: { amount: number; count: number };
  last30Days: { amount: number; count: number };
  pending: { amount: number; count: number };
  failedCount: number;
  byPurpose: Record<string, { amount: number; count: number }>;
};

export const useFetchEarningsSummary = () =>
  useQuery({
    queryKey: ["earnings-summary"],
    queryFn: async () => (await query("/admin/payments/summary")) as EarningsSummary,
  });

export type PaymentRow = {
  id: string;
  reference: string;
  amount: number;
  status: "pending" | "success" | "failed";
  purpose: "application_fee" | "company_subscription";
  payerType: "student" | "corps" | "company" | "unknown";
  payerName: string;
  payerEmail: string | null;
  description: string;
  createdAt: string;
};

export type PaymentsPage = {
  items: PaymentRow[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type PaymentFilters = {
  page: number;
  status: string;
  purpose: string;
  search: string;
  from: string;
  to: string;
};

export const useFetchPayments = (f: PaymentFilters) =>
  useQuery({
    queryKey: ["admin-payments", f],
    queryFn: async () => {
      const p = new URLSearchParams({ page: String(f.page), limit: "20" });
      if (f.status) p.set("status", f.status);
      if (f.purpose) p.set("purpose", f.purpose);
      if (f.search.trim()) p.set("search", f.search.trim());
      if (f.from) p.set("from", f.from);
      if (f.to) p.set("to", f.to);
      return (await query(`/admin/payments?${p.toString()}`)) as PaymentsPage;
    },
    placeholderData: (prev) => prev,
  });
