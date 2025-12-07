"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

const dummyApplications = [
  {
    id: "1",
    student: "Alice Johnson",
    department: "Computer Science",
    company: "Flutterwave",
    status: "Pending",
    date: "2025-11-01",
  },
  {
    id: "2",
    student: "Michael Adams",
    department: "Engineering",
    company: "Interswitch",
    status: "Approved",
    date: "2025-11-03",
  },
];

export default function PlacementList({ onSelect, selectedId }: any) {
  const [search, setSearch] = useState("");

  const filtered = dummyApplications.filter((item) =>
    item.student.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 flex flex-col gap-4">
      <Input
        placeholder="Search student..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex flex-col gap-2">
        {filtered.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`p-3 rounded-lg border text-left transition 
              ${
                selectedId === item.id
                  ? "bg-primary text-white border-primary"
                  : "hover:bg-gray-100"
              }
            `}
          >
            <div className="font-medium">{item.student}</div>
            <div className="text-sm text-gray-500">{item.company}</div>

            <span
              className={`text-xs px-2 py-1 rounded mt-1 inline-block
                ${
                  item.status === "Pending"
                    ? "bg-yellow-200 text-yellow-700"
                    : item.status === "Approved"
                    ? "bg-green-200 text-green-700"
                    : "bg-red-200 text-red-700"
                }
              `}
            >
              {item.status}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
