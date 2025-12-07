"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Dummy company data
const companiesData = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Company ${i + 1}`,
  status: ["Active", "Pending", "Suspended"][i % 3],
  industry: ["Tech", "Finance", "Manufacturing", "Healthcare"][i % 4],
  registrationDate: `2025-0${(i % 9) + 1}-0${(i % 28) + 1}`,
  cacDocument: `CAC_DOC_${i + 1}.pdf`,
  opportunities: Math.floor(Math.random() * 10),
}));

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Suspended: "bg-red-100 text-red-800",
};

export default function CompanyTable({
  onView,
}: {
  onView: (company: (typeof companiesData)[0]) => void;
}) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filteredCompanies = companiesData.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="border rounded-xl overflow-x-auto bg-white shadow">
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search companies..."
          className="border px-3 py-2 rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Add Company
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Company Name</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Industry</th>
            <th className="px-4 py-2">Registration Date</th>
            <th className="px-4 py-2">CAC Document</th>
            <th className="px-4 py-2">Placements / Opportunities</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredCompanies.map((c, index) => (
            <tr
              key={c.id}
              className="border-b hover:bg-gray-50"
              // Uncomment if you want row click navigation
              onClick={() => router.push(`/admin/company/${c.id}`)}
            >
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2 font-medium">{c.name}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    statusColors[c.status]
                  }`}
                >
                  {c.status}
                </span>
              </td>
              <td className="px-4 py-2">{c.industry}</td>
              <td className="px-4 py-2">{c.registrationDate}</td>
              <td className="px-4 py-2">{c.cacDocument}</td>
              <td className="px-4 py-2">{c.opportunities}</td>
              <td className="px-4 py-2 flex gap-2">
                <button
                  onClick={() => onView(c)}
                  className="text-indigo-600 hover:underline"
                >
                  View
                </button>
                <button className="text-red-600 hover:underline">
                  Deactivate
                </button>
              </td>
            </tr>
          ))}

          {filteredCompanies.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center p-4 text-gray-500">
                No companies found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
