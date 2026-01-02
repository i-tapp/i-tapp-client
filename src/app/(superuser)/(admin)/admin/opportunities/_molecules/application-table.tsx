"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const dummy = [
  {
    id: "1",
    title: "Backend Intern",
    company: "Flutterwave",
    department: "Computer Science",
    location: "Lagos",
    slots: 5,
    status: "Active",
    createdAt: "2025-11-02",
  },
  {
    id: "2",
    title: "Accounting Intern",
    company: "GTBank",
    department: "Accounting",
    location: "Abuja",
    slots: 10,
    status: "Inactive",
    createdAt: "2025-11-05",
  },
];

export default function OpportunityTable({ data, isLoading }) {
  const [search, setSearch] = useState("");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const filtered = data.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.company.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    return status === "open"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* TOP BAR */}
      <div className="flex justify-between items-center p-4 border-b bg-gray-50">
        <Input
          placeholder="Search opportunities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />

        <Button>Add Opportunity</Button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3 font-medium">Title</th>
              <th className="text-left p-3 font-medium">Company</th>
              <th className="text-left p-3 font-medium">Department</th>
              <th className="text-left p-3 font-medium">Location</th>
              <th className="text-left p-3 font-medium">Slots</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-right p-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center text-gray-500 py-6 italic"
                >
                  No matching opportunities
                </td>
              </tr>
            )}

            {filtered.map((item) => (
              <tr
                key={item.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-3">{item.title}</td>
                <td className="p-3">{item.company.name}</td>
                <td className="p-3">{item.department}</td>
                <td className="p-3">{item.location}</td>
                <td className="p-3">{item.company.studentCapacity ?? "N/A"}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/opportunities/${item.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                    {/* <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm">
                      Deactivate
                    </Button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
