"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { approveCorps, rejectCorps } from "@/actions";
import { toast } from "react-toastify";
import { studentStatusStyle } from "@/utils/admin-status-style";

export default function CorpsTable({
  data,
  isLoading,
}: {
  data: any[];
  isLoading: boolean;
}) {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-all-corps"] });

  const { execute: approve, isExecuting: isApproving } = useAction(
    approveCorps,
    {
      onSuccess: () => { toast.success("Corps member approved!"); invalidate(); },
      onError: (e) => toast.error(e?.error?.serverError || "Failed to approve."),
    },
  );

  const { execute: reject, isExecuting: isRejecting } = useAction(rejectCorps, {
    onSuccess: () => { toast.success("Corps member removed."); invalidate(); },
    onError: (e) => toast.error(e?.error?.serverError || "Failed to remove."),
  });

  if (isLoading) return <div className="p-4">Loading corps members...</div>;

  const filtered = data.filter((c: any) => {
    const name = `${c.firstName ?? ""} ${c.lastName ?? ""}`.toLowerCase();
    const email = (c.user?.email ?? "").toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  return (
    <div className="border rounded-xl overflow-x-auto bg-white shadow">
      <div className="p-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search corps members..."
          className="border px-3 py-2 rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3">#</th>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">State of Deployment</th>
            <th className="p-3">Call-Up No.</th>
            <th className="p-3">Account</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((c: any, index: number) => (
            <tr key={c.id} className="border-b hover:bg-gray-50 transition">
              <td className="p-3">{index + 1}</td>
              <td className="p-3 font-medium">
                {c.firstName} {c.lastName}
              </td>
              <td className="p-3 text-gray-500">{c.user?.email}</td>
              <td className="p-3">{c.stateOfDeployment ?? "—"}</td>
              <td className="p-3">{c.callUpNumber ?? "—"}</td>
              <td className="p-3">
                {c.user?.isActive ? "Active" : "Inactive"}
              </td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    studentStatusStyle[
                      c.status as keyof typeof studentStatusStyle
                    ] ?? "bg-gray-100 text-gray-600"
                  }`}
                >
                  {c.status ?? "pending"}
                </span>
              </td>
              <td className="p-3">
                <div className="flex gap-2">
                  <button
                    disabled={isApproving || isRejecting}
                    onClick={() => approve({ corpsId: c.id })}
                    className="px-3 py-1 text-xs rounded bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50 cursor-pointer"
                  >
                    Approve
                  </button>
                  <button
                    disabled={isApproving || isRejecting}
                    onClick={() => reject({ corpsId: c.id })}
                    className="px-3 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center p-6 text-gray-400">
                No corps members found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
