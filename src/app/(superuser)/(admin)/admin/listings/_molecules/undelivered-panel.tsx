"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { requeueUndelivered } from "@/actions";
import { useFetchUndelivered } from "@/queries";
import { Button } from "@/components/ui/button";

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

/**
 * Applications whose email never left PlaceIT (for example when the mail
 * provider's daily limit was reached). Only shown when there are some.
 */
export default function UndeliveredPanel() {
  const queryClient = useQueryClient();
  const { data } = useFetchUndelivered();
  const [busy, setBusy] = useState(false);

  const rows = data ?? [];
  if (rows.length === 0) return null;
  const retryable = rows.filter((r) => r.retryable);

  const resendAll = async () => {
    if (!window.confirm(`Resend ${retryable.length} application email${retryable.length === 1 ? "" : "s"} to the companies now?`)) return;
    setBusy(true);
    const res = await requeueUndelivered({});
    setBusy(false);
    if (res?.data?.ok) {
      const n = res.data.data?.requeued ?? retryable.length;
      toast.success(`${n} application${n === 1 ? "" : "s"} put back in the queue. They go out within a few minutes.`);
      queryClient.invalidateQueries({ queryKey: ["undelivered-applications"] });
    } else {
      toast.error(res?.data?.message ?? "Could not resend");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 md:px-6">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-amber-900">
              {rows.length} application{rows.length === 1 ? "" : "s"} did not reach the company
            </h2>
            <p className="mt-1 max-w-3xl text-sm text-amber-900/80">
              These emails never left PlaceIT, for example because the mail provider&apos;s daily limit was reached.
              Resending puts them back in the queue, and each applicant gets an &quot;Application sent&quot; notice
              when theirs goes out.
            </p>
          </div>
          <Button onClick={resendAll} disabled={busy || retryable.length === 0}>
            {busy ? "Resending…" : `Resend ${retryable.length}`}
          </Button>
        </div>

        <div className="mt-3 overflow-x-auto rounded-lg border border-amber-100 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-amber-50/60 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-3 py-2">Applied</th>
                <th className="px-3 py-2">Applicant</th>
                <th className="px-3 py-2">Listing</th>
                <th className="px-3 py-2">Why it failed</th>
                <th className="px-3 py-2">Can resend?</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-gray-100 align-top">
                  <td className="whitespace-nowrap px-3 py-2 text-gray-600">{when(r.appliedAt)}</td>
                  <td className="px-3 py-2">
                    <p className="font-medium">{r.applicantName}</p>
                    <p className="text-xs text-gray-500">{r.applicantType === "nysc" ? "NYSC member" : "Student"}</p>
                  </td>
                  <td className="px-3 py-2">
                    <p>{r.listingTitle}</p>
                    {r.organisationName ? <p className="text-xs text-gray-500">{r.organisationName}</p> : null}
                  </td>
                  <td className="max-w-xs px-3 py-2 text-xs text-gray-600">{r.reason}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${r.retryable ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
                      {r.retryable ? "Yes" : "Needs a look"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
