"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";

const meta = [
  { label: "Opportunity Status", value: "Pending" },
  { label: "Department / Category", value: "Engineering" },
  { label: "Location", value: "Abuja, Nigeria" },
  { label: "Start / End Date", value: "June 1, 2024 - August 31, 2024" },
];

const summaryItem = [
  { label: "Total", value: "45" },
  { label: "Accepted", value: "30" },
  { label: "Pending", value: "10" },
  { label: "Rejected", value: "5" },
];

export default function OpportunityDetailPage() {
  const { opportunityId } = useParams();

  return (
    <div className="p-8 max-w-6xl mx-auto flex flex-col gap-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Software Engineering Intern
          </h1>
          <p className="text-sm text-gray-600">
            at{" "}
            <Link
              className="text-primary font-medium hover:underline"
              href="/admin/company/1"
            >
              Tech Solutions Inc.
            </Link>
          </p>
        </div>

        <div className="flex gap-2">
          <Button className="bg-green-600 hover:bg-green-700">Promote</Button>
          <Button variant="outline">Flag</Button>
          <Button variant="destructive" disabled>
            Decline
          </Button>
        </div>
      </div>

      {/* META INFO ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {meta.map((item, index) => (
          <div
            key={index}
            className="bg-gray-50 border rounded-lg p-4 shadow-sm flex flex-col gap-1"
          >
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className="font-medium text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT MAIN CONTENT */}
        <div className="flex-1 flex flex-col gap-6">
          {/* OVERVIEW */}
          <div className="bg-gray-50 rounded-lg shadow-sm border p-6 flex flex-col gap-4">
            <h2 className="text-lg font-medium text-gray-800">
              Opportunity Overview
            </h2>

            <p className="text-gray-700 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              faucibus, urna vel efficitur suscipit, neque lorem interdum nunc,
              at dignissim lorem justo sed augue.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-400">Duration</p>
                <p className="font-semibold text-gray-800">3 months</p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Stipend</p>
                <p className="font-semibold text-gray-800">₦80,000 / month</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-full lg:w-[300px] flex flex-col gap-6">
          {/* APPLICATION SUMMARY */}
          <div className="bg-gray-50 rounded-lg shadow-sm border">
            <div className="border-b p-4">
              <h3 className="text-sm font-semibold text-gray-700">
                Application Summary
              </h3>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4 justify-center items-center text-center">
              {summaryItem.map((item, index) => (
                <div
                  key={index}
                  className="justify-center items-center bg-white p-3 rounded-lg shadow-xs"
                >
                  <p className="font-medium text-lg text-gray-800">
                    {item.value}
                  </p>
                  <p className="text-sm text-gray-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* APPLICANTS */}
          <div className="bg-gray-50 rounded-lg shadow-sm border">
            <div className="border-b p-4">
              <h3 className="text-sm font-semibold text-gray-700">
                Applicants
              </h3>
            </div>
            <div className="p-4 text-gray-700">List coming soon...</div>
          </div>
        </div>
      </div>
    </div>
  );
}
