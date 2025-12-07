"use client";

import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function CompanyDetailPage() {
  const { companyId } = useParams();
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = ["Overview", "Placements", "Reviews"];

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="border rounded-lg w-14 h-14 bg-gray-100"></div>
          <div>
            <h1 className="text-2xl font-bold">Company Name</h1>
            <p className="text-gray-500 text-sm">Company ID: {companyId}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">Edit Company</Button>
          <Button variant="default">Message Company</Button>
          <Button variant="destructive" className="bg-orange-500">
            Suspend Company
          </Button>
        </div>
      </div>

      {/* MAIN BODY */}
      <div className="flex flex-row gap-6">
        {/* LEFT SIDEBAR */}
        <div className="flex flex-col gap-6 w-1/3">
          {/* COMPANY DETAILS */}
          <div className="border rounded-lg p-4 bg-white shadow">
            <h2 className="text-lg font-semibold mb-3">Company Details</h2>

            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-medium">Address:</span> 123 Main St, City
              </p>
              <p>
                <span className="font-medium">Email:</span> example@company.com
              </p>
              <p>
                <span className="font-medium">Industry:</span> Technology
              </p>
              <p>
                <span className="font-medium">Registration Date:</span>{" "}
                2024-06-10
              </p>
            </div>
          </div>

          {/* ADMIN ROLES */}
          <div className="border rounded-lg p-4 bg-white shadow">
            <h2 className="text-lg font-semibold mb-3">Admin Roles</h2>

            <p className="text-gray-600 text-sm">
              List of company admins will appear here.
            </p>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex-1 border rounded-lg bg-white shadow flex flex-col">
          {/* TABS */}
          <div className="border-b  flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 p-4 text-sm font-medium ${
                  activeTab === tab
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div className="p-4">
            {activeTab === "Overview" && (
              <p className="text-gray-700">
                Basic company overview will go here.
              </p>
            )}

            {activeTab === "Placements" && (
              <p className="text-gray-700">
                List of placements/opportunities will go here.
              </p>
            )}

            {activeTab === "Reviews" && (
              <p className="text-gray-700">
                Company reviews and ratings will appear here.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
