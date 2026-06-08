"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useFetchAdminPPA } from "@/queries/admin";
import { updatePPAStatus } from "@/actions";
import { NIGERIAN_STATES } from "@/constants";
import SummaryCard from "../_molecules/summary-card";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-600",
  closed: "bg-red-100 text-red-700",
};

export default function AdminPPAPage() {
  const [stateFilter, setStateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<any>(null);

  const { data, isLoading } = useFetchAdminPPA({
    state: stateFilter || undefined,
    status: statusFilter || undefined,
  });

  const queryClient = useQueryClient();
  const listings: any[] = data?.data?.listings ?? data?.data ?? data ?? [];
  const total = data?.data?.total ?? listings.length;

  const active = listings.filter((p: any) => p.status === "active").length;
  const closed = listings.filter((p: any) => p.status === "closed").length;

  const { execute: updateStatus, isExecuting } = useAction(updatePPAStatus, {
    onSuccess: () => {
      toast.success("PPA status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-ppa"] });
    },
    onError: (e) => toast.error(e?.error?.serverError ?? "Failed to update status"),
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold">PPA Listings</h1>

      <div className="flex flex-wrap gap-6">
        <SummaryCard title="Total Listings" number={total} component="" />
        <SummaryCard title="Active" number={active} component="" />
        <SummaryCard title="Closed" number={closed} component="" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          className="border rounded px-3 py-2 text-sm"
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
        >
          <option value="">All States</option>
          {NIGERIAN_STATES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <select
          className="border rounded px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="flex gap-6 h-[calc(100vh-320px)]">
        {/* Table */}
        <div className="flex-1 border rounded-xl bg-white shadow overflow-auto">
          {isLoading ? (
            <div className="p-6 text-center text-gray-400">Loading...</div>
          ) : (
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="p-3">Organisation</th>
                  <th className="p-3">State</th>
                  <th className="p-3">Sector</th>
                  <th className="p-3">Applications</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((ppa: any) => (
                  <tr
                    key={ppa.id}
                    className={`border-b hover:bg-gray-50 cursor-pointer transition ${selected?.id === ppa.id ? "bg-primary/5" : ""}`}
                    onClick={() => setSelected(ppa)}
                  >
                    <td className="p-3 font-medium">{ppa.organisationName ?? ppa.name ?? "—"}</td>
                    <td className="p-3">{ppa.state ?? ppa.stateOfDeployment ?? "—"}</td>
                    <td className="p-3">{ppa.sector ?? "—"}</td>
                    <td className="p-3">{ppa.applicationsCount ?? ppa._count?.applications ?? "—"}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[ppa.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {ppa.status ?? "active"}
                      </span>
                    </td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        disabled={isExecuting}
                        value={ppa.status ?? "active"}
                        onChange={(e) => updateStatus({ ppaId: ppa.id, status: e.target.value as any })}
                        className="border rounded px-2 py-1 text-xs"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {listings.length === 0 && (
                  <tr><td colSpan={6} className="p-6 text-center text-gray-400">No PPA listings found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-80 border rounded-xl bg-white shadow p-5 overflow-y-auto flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <h2 className="font-bold text-lg leading-tight">{selected.organisationName ?? selected.name}</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
            </div>
            <div className="space-y-2 text-sm">
              {[
                ["State", selected.state ?? selected.stateOfDeployment],
                ["Sector", selected.sector],
                ["Address", selected.address],
                ["Contact", selected.contactEmail ?? selected.email],
                ["Phone", selected.phone],
                ["Description", selected.description],
                ["Capacity", selected.capacity],
                ["Applications", selected.applicationsCount ?? selected._count?.applications],
              ].map(([label, value]) => value ? (
                <div key={label as string}>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
                  <p className="text-gray-800">{value}</p>
                </div>
              ) : null)}
            </div>
            <div className="mt-auto pt-4 border-t">
              <p className="text-xs text-gray-400 mb-2">Update Status</p>
              <div className="flex gap-2">
                {(["active", "inactive", "closed"] as const).map((s) => (
                  <button
                    key={s}
                    disabled={isExecuting || selected.status === s}
                    onClick={() => updateStatus({ ppaId: selected.id, status: s })}
                    className={`flex-1 py-1.5 rounded text-xs font-medium border transition disabled:opacity-40 ${selected.status === s ? "bg-primary text-white border-primary" : "hover:bg-gray-50"}`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
