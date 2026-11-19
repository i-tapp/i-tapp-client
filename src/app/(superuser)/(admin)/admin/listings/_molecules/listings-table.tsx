"use client";

import { useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteAdminListing, pauseAdminListing } from "@/actions";
import { useFetchAdminListings } from "@/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STATUS_STYLE: Record<string, string> = {
  open: "bg-green-100 text-green-700",
  draft: "bg-gray-100 text-gray-600",
  paused: "bg-amber-100 text-amber-700",
  flagged: "bg-red-100 text-red-700",
  expired: "bg-gray-100 text-gray-500",
  closed: "bg-gray-100 text-gray-500",
};

export default function ListingsTable() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("");
  const [method, setMethod] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useFetchAdminListings({ status, method, search, page });

  const rows: any[] = data?.data ?? [];
  const pagination = data?.pagination;

  const toggle = async (id: string, paused: boolean) => {
    const res = await pauseAdminListing({ id, paused });
    if (res?.data?.ok) {
      toast.success(paused ? "Paused" : "Live again");
      queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
    } else {
      toast.error(res?.data?.message ?? "Could not update the listing");
    }
  };

  const remove = async (id: string, title: string, applied: number) => {
    const extra = applied > 0 ? ` Its ${applied} application(s) will be deleted too.` : "";
    if (!window.confirm(`Delete "${title}"?${extra} This cannot be undone.`)) return;
    const res = await deleteAdminListing({ id });
    if (res?.data?.ok) {
      toast.success("Listing deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
    } else {
      toast.error(res?.data?.message ?? "Could not delete the listing");
    }
  };

  const select = "rounded-md border border-gray-200 bg-white px-3 py-2 text-sm";

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Posted listings</h1>
          <p className="text-sm text-gray-500">Openings posted on a company&apos;s behalf (email and form).</p>
        </div>
        <Link href="/admin/listings/new">
          <Button>Post a listing</Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          className="max-w-xs"
          placeholder="Search title or company"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select className={select} value={method} onChange={(e) => { setMethod(e.target.value); setPage(1); }}>
          <option value="">All methods</option>
          <option value="email">Email</option>
          <option value="form">Form</option>
          <option value="direct">Direct (claimed)</option>
        </select>
        <select className={select} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All statuses</option>
          {["draft", "open", "paused", "flagged", "expired", "closed"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Listing</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Sent</th>
              <th className="px-4 py-3 text-right">Delivered</th>
              <th className="px-4 py-3 text-right">Bounced</th>
              <th className="px-4 py-3 text-right">Form opened / submitted</th>
              <th className="px-4 py-3 text-right">Claim views / removals</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && (
              <tr><td className="px-4 py-6 text-gray-400" colSpan={9}>Loading…</td></tr>
            )}
            {!isLoading && rows.length === 0 && (
              <tr><td className="px-4 py-6 text-gray-400" colSpan={9}>No listings yet.</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3">
                  <Link href={`/admin/listings/${r.id}`} className="font-medium text-gray-900 hover:text-primary">
                    {r.title}
                  </Link>
                  <p className="text-xs text-gray-500">{r.organisationName}{r.claimed ? " · claimed" : ""}</p>
                </td>
                <td className="px-4 py-3 capitalize">{r.applicationMethod}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLE[r.status] ?? "bg-gray-100"}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{r.stats.sent}</td>
                <td className="px-4 py-3 text-right tabular-nums">{r.stats.delivered}</td>
                <td className="px-4 py-3 text-right tabular-nums">{r.stats.bounced}</td>
                <td className="px-4 py-3 text-right tabular-nums">{r.stats.formOpened} / {r.stats.formSubmitted}</td>
                <td className="px-4 py-3 text-right tabular-nums">{r.stats.claimPageViews} / {r.stats.removals}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Link href={`/admin/listings/${r.id}`} className="text-primary hover:underline mr-3">Edit</Link>
                  {r.status === "open" && (
                    <button className="text-amber-700 hover:underline" onClick={() => toggle(r.id, true)}>Pause</button>
                  )}
                  {r.status === "paused" && (
                    <button className="text-green-700 hover:underline" onClick={() => toggle(r.id, false)}>Resume</button>
                  )}
                  <button className="ml-3 text-red-600 hover:underline" onClick={() => remove(r.id, r.title, r.stats.sent)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-end gap-3 text-sm">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
          <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}
