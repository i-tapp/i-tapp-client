"use client";

import { useState, useMemo } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TickCircle, // active
  CloseCircle, // closed
  DocumentText,
  ArrowRight2, // draft
} from "iconsax-reactjs";
import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";

const opportunities = [
  {
    id: 1,
    title: "Frontend Intern",
    department: "Engineering",
    location: "Lagos, Nigeria",
    status: "Open",
    applicants: 12,
  },
  {
    id: 2,
    title: "Backend Developer",
    department: "Engineering",
    location: "Remote",
    status: "Closed",
    applicants: 8,
  },
  {
    id: 3,
    title: "UI/UX Designer",
    department: "Design",
    location: "Abuja, Nigeria",
    status: "Draft",
    applicants: 5,
  },
];

export default function OpportunityPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Filtered list
  const filtered = useMemo(() => {
    return opportunities.filter((op) => {
      const matchesSearch = op.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || op.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <div className="space-y-4 mx-5">
      {/* Search bar */}
      <div className="bg-white border border-gray-200 flex items-center px-2 py-2 rounded-md w-full max-w-lg">
        <Search size={18} className="text-gray-400" />
        <Input
          type="search"
          placeholder="Search opportunities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-0 flex outline-none shadow-none focus:ring-0 ml-2"
        />
      </div>

      {/* Status filter */}
      <div className="flex flex-row items-center gap-2">
        <span className="text-sm font-medium">Status:</span>
        {["All", "Open", "Closed", "Draft"].map((filter) => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`
              px-3 py-1 text-sm font-medium border rounded-md transition
              ${
                statusFilter === filter
                  ? "bg-primary text-white border-primary"
                  : "border-gray-200 text-gray-600 hover:bg-gray-100"
              }
            `}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Opportunities table */}
      <div className="border border-[#f5f5f5] rounded-md overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center bg-[#f5f5f5] px-4 py-2 font-semibold text-sm text-gray-600">
          <p className="flex-1">Job Title</p>
          <p className="w-28 text-center">Status</p>
          <p className="w-28 text-center">Applicants</p>
          <p className="w-28 text-right">Action</p>
        </div>

        {/* List */}
        <div>
          {filtered.length > 0 ? (
            filtered.map((op, index) => (
              <CardView key={op.id} index={index} {...op} />
            ))
          ) : (
            <p className="text-center text-sm text-gray-500 py-6">
              No opportunities found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

type CardProps = {
  title: string;
  department: string;
  location: string;
  status: string;
  applicants: number;
  index: number;
};

export function CardView({
  title,
  department,
  location,
  status,
  applicants,
  index,
}: CardProps) {
  const renderStatus = () => {
    switch (status) {
      case "Open":
        return (
          <div className="flex items-center justify-center gap-1 text-green-600">
            <TickCircle size={18} variant="Bold" />
            <span className="text-sm font-medium">Active</span>
          </div>
        );
      case "Closed":
        return (
          <div className="flex items-center justify-center gap-1 text-red-600">
            <CloseCircle size={18} variant="Bold" />
            <span className="text-sm font-medium">Closed</span>
          </div>
        );
      case "Draft":
        return (
          <div className="flex items-center justify-center gap-1 text-gray-500">
            <DocumentText size={18} variant="Bold" />
            <span className="text-sm font-medium">Draft</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex items-center justify-between px-4 py-4 border-1 border-[#F5F5F5] hover:bg-gray-50 transition `}
    >
      {/* Left: logo + details */}
      <div className="flex items-center gap-3 flex-1">
        <div className="h-10 w-10 rounded-full bg-[#f5f5f5] text-white flex items-center justify-center">
          🏢
        </div>
        <div>
          <h1 className="text-sm font-semibold">{title}</h1>
          <p className="text-xs text-gray-500">
            {department} &#8226; {location}
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="w-28 text-center">{renderStatus()}</div>

      {/* Applicants */}
      <div className="w-28 text-center text-sm text-gray-700">
        {applicants} Applicant{applicants > 0 && "s"}
      </div>

      {/* Action */}
      <div className="w-28 text-right">
        <Link
          href={`opportunities/${index}`}
          className={
            buttonVariants({ variant: "secondary" }) +
            " flex items-center gap-2"
          }
        >
          <span>View</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
