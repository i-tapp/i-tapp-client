"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function StudentDetailsPage() {
  const { studentId } = useParams();
  const [activeTab, setActiveTab] = useState("Personal Information");

  // Placeholder data (replace with API fetch later)
  const student = {
    name: "Sam Adebayo",
    matricNo: "1234567890",
    verified: true,
    avatar: "",
  };

  const tabs = [
    "Personal Information",
    "Applications",
    "Activities",
    "Messages",
  ];

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Header */}
      <div className="flex flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{student.name}</h1>
          <p className="text-gray-500 text-sm">
            Student profile (ID: {studentId})
          </p>
        </div>

        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Assign Placement
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-row gap-6">
        {/* Sidebar / Info */}
        <div className="min-w-[230px] flex flex-col items-center py-6 gap-4">
          <div className="rounded-full border w-[150px] h-[150px] bg-gray-100 flex items-center justify-center">
            {/* Avatar Placeholder */}
            {student.avatar ? (
              <img
                src={student.avatar}
                alt={student.name}
                className="rounded-full"
              />
            ) : (
              <span className="text-gray-400">No Avatar</span>
            )}
          </div>

          <div className="text-center space-y-1">
            <p className="font-semibold">{student.name}</p>
            <p className="text-sm text-gray-500">
              Matric No: {student.matricNo}
            </p>
            <p
              className={`text-sm font-medium ${
                student.verified ? "text-green-600" : "text-red-500"
              }`}
            >
              {student.verified ? "Verified" : "Not Verified"}
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Button>Verify Student</Button>
            <Button>Deactivate / Suspend Account</Button>
            <Button variant="outline">More Options</Button>
          </div>
        </div>

        {/* Tabs / Content */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="flex border-b mb-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 -mb-px border-b-2 font-medium ${
                  activeTab === tab
                    ? "border-amber-600 text-amber-600"
                    : "border-transparent text-gray-600 hover:border-amber-600 hover:text-amber-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-2">
            {activeTab === "Personal Information" && (
              <div>
                <p>Here is the personal information of {student.name}.</p>
                {/* Add more info later */}
              </div>
            )}
            {activeTab === "Applications" && <p>Applications content...</p>}
            {activeTab === "Activities" && <p>Activities content...</p>}
            {activeTab === "Messages" && <p>Messages content...</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
