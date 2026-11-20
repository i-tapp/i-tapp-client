"use client";

import { useState } from "react";
import { useFetchEarningsSummary, useFetchPayments, type PaymentFilters } from "@/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const naira = (n: number) => `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;

const PURPOSE_LABEL: Record<string, string> = {
  application_fee: "Application fees",
  company_subscription: "Company access",
};

const STATUS_STYLE: Record<string, string> = {
  success: "bg-green-50 text-green-700 border-green-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  failed: "bg-red-50 text-red-700 border-red-200",
};

const TYPE_LABEL: Record<string, string> = {
  student: "Student",
  corps: "NYSC member",
  company: "Company",
  unknown: "Unknown",
};

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const empty: PaymentFilters = { page: 1, status: "", purpose: "", search: "", from: "", to: "" };

export default function EarningsDashboard() {
  const { data: summary, isLoading: summaryLoading } = useFetchEarningsSummary();
  const [filters, setFilters] = useState<PaymentFilters>(empty);
  const [searchText, setSearchText] = useState("");
  const { data: payments, isFetching } = useFetchPayments(filters);

  const set = (patch: Partial<PaymentFilters>) => setFilters((f) => ({ ...f, ...patch, page: 1 }));
  const select =
    "rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm h-10";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Earnings</h1>
        <p className="text-sm text-gray-500">
          Every payment made on PlaceIT: who paid, what for, how much and when.
        </p>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card label="Total earned" value={summary ? naira(summary.totalEarned) : "…"} sub={summary ? `${summary.successCount} payments` : ""} strong />
        <Card label="This month" value={summary ? naira(summary.thisMonth.amount) : "…"} sub={summary ? `${summary.thisMonth.count} payments` : ""} />
        <Card label="Last 30 days" value={summary ? naira(summary.last30Days.amount) : "…"} sub={summary ? `${summary.last30Days.count} payments` : ""} />
        <Card label="Today" value={summary ? naira(summary.today.amount) : "…"} sub={summary ? `${summary.today.count} payments` : ""} />
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {Object.entries(summary?.byPurpose ?? {}).map(([k, v]) => (
          <Card key={k} label={PURPOSE_LABEL[k] ?? k} value={naira(v.amount)} sub={`${v.count} payments`} />
        ))}
        <Card
          label="Started, not completed"
          value={summary ? naira(summary.pending.amount) : "…"}
          sub={summary ? `${summary.pending.count} pending · ${summary.failedCount} failed` : ""}
          muted
        />
      </div>
      {!summaryLoading && summary && summary.successCount === 0 && (
        <p className="text-sm text-gray-500">No payments have been completed yet.</p>
      )}

      {/* Filters */}
      <div className="rounded-xl border border-gray-100 bg-white p-4">
        <form
          className="flex flex-wrap items-end gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            set({ search: searchText });
          }}
        >
          <div className="min-w-[220px] flex-1 space-y-1">
            <label className="text-xs font-medium text-gray-500" htmlFor="pay-search">Search name, email or reference</label>
            <Input id="pay-search" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="e.g. Ada, ada@mail.com, itapp-app-…" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500" htmlFor="pay-status">Status</label>
            <select id="pay-status" className={select} value={filters.status} onChange={(e) => set({ status: e.target.value })}>
              <option value="">All</option>
              <option value="success">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500" htmlFor="pay-purpose">Type</label>
            <select id="pay-purpose" className={select} value={filters.purpose} onChange={(e) => set({ purpose: e.target.value })}>
              <option value="">All</option>
              <option value="application_fee">Application fee</option>
              <option value="company_subscription">Company access</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500" htmlFor="pay-from">From</label>
            <Input id="pay-from" type="date" value={filters.from} onChange={(e) => set({ from: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500" htmlFor="pay-to">To</label>
            <Input id="pay-to" type="date" value={filters.to} onChange={(e) => set({ to: e.target.value })} />
          </div>
          <Button type="submit">Search</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSearchText("");
              setFilters(empty);
            }}
          >
            Clear
          </Button>
        </form>
      </div>

      {/* Payments */}
      <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Paid by</th>
              <th className="px-4 py-3">For</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Reference</th>
            </tr>
          </thead>
          <tbody>
            {(payments?.items ?? []).map((p) => (
              <tr key={p.id} className="border-t border-gray-100 align-top">
                <td className="whitespace-nowrap px-4 py-3 text-gray-600">{when(p.createdAt)}</td>
                <td className="px-4 py-3">
                  <p className="font-medium">{p.payerName}</p>
                  <p className="text-xs text-gray-500">{p.payerEmail ?? "No email"} · {TYPE_LABEL[p.payerType]}</p>
                </td>
                <td className="px-4 py-3 text-gray-700">{p.description}</td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-semibold">{naira(p.amount)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[p.status] ?? ""}`}>
                    {p.status === "success" ? "Paid" : p.status === "pending" ? "Pending" : "Failed"}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500 break-all">{p.reference}</td>
              </tr>
            ))}
            {payments && payments.items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                  No payments match these filters.
                </td>
              </tr>
            )}
            {!payments && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-500">Loading…</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {payments && payments.total > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            {payments.total} payment{payments.total === 1 ? "" : "s"} · page {payments.page} of {payments.pages}
            {isFetching ? " · updating…" : ""}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={payments.page <= 1} onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={payments.page >= payments.pages} onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ label, value, sub, strong, muted }: { label: string; value: string; sub?: string; strong?: boolean; muted?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${strong ? "border-indigo-200 bg-indigo-50" : muted ? "border-gray-100 bg-gray-50" : "border-gray-100 bg-white"}`}>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className={`mt-1 font-semibold ${strong ? "text-2xl text-indigo-700" : "text-xl"}`}>{value}</p>
      {sub ? <p className="text-xs text-gray-500">{sub}</p> : null}
    </div>
  );
}
