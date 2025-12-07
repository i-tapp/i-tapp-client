"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

const dummyApplications = [
  {
    id: "1",
    student: "Alice Johnson",
    program: "Computer Science",
    company: "Flutterwave",
    opportunity: "Backend Intern",
    status: "Pending",
    date: "2025-11-01",
  },
  {
    id: "2",
    student: "Samuel Obi",
    program: "Engineering",
    company: "Interswitch",
    opportunity: "Hardware Intern",
    status: "Approved",
    date: "2025-11-03",
  },
];

export default function ApplicationList({ onSelect, selectedId }: any) {
  const [search, setSearch] = useState("");

  const filtered = dummyApplications.filter(
    (a) =>
      a.student.toLowerCase().includes(search.toLowerCase()) ||
      a.company.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (status: string) => {
    return status === "Pending"
      ? "bg-yellow-200 text-yellow-700"
      : status === "Approved"
      ? "bg-green-200 text-green-700"
      : "bg-red-200 text-red-700";
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <Input
        placeholder="Search applications..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex flex-col gap-2">
        {filtered.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`p-3 rounded-lg border text-left transition ${
              selectedId === item.id
                ? "bg-primary text-white border-primary"
                : "hover:bg-gray-100"
            }`}
          >
            <div className="font-medium">{item.student}</div>
            <div className="text-sm text-gray-500">
              {item.opportunity} • {item.company}
            </div>

            <span
              className={`text-xs px-2 py-1 rounded mt-2 inline-block ${statusColor(
                item.status
              )}`}
            >
              {item.status}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
