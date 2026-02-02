"use client";

import { updateStudentStatus } from "@/actions";
import { Button } from "@/components/ui/button";
import { useFetchStudentDetails } from "@/hooks/query";
import { useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function StudentDetailsPage() {
  const { studentId } = useParams();

  const { data, isLoading } = useFetchStudentDetails(studentId as string);
  const [activeTab, setActiveTab] = useState("Personal Information");

  const queryClient = useQueryClient();

  const { execute, isExecuting } = useAction(updateStudentStatus, {
    onSuccess: () => {
      console.log("Student status updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["student-details", studentId],
      });
    },
    onError: (err) => {
      console.error("Error updating student status:", err);
    },
  });

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

  if (isLoading) {
    return <div className="p-4">Loading student details...</div>;
  }

  const name = data?.firstName + " " + data?.lastName;

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Header */}
      <div className="flex flex-row justify-between items-center">
        <div>
          <div className="flex flex-row items-center gap-3">
            {" "}
            <h1 className="text-2xl font-bold">{name}</h1> -{" "}
            <p>{data?.status}</p>
          </div>
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
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-gray-500">
              Matric No: {data?.matriculationNumber}
            </p>
            <p
              className={`text-sm font-medium ${
                data?.user?.isVerified ? "text-green-600" : "text-red-500"
              }`}
            >
              {data?.user?.isVerified ? "Verified" : "Not Verified"}
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full">
            {/* <Button>Verify Student</Button> */}

            {data?.status !== "suspended" && (
              <Button
                variant="destructive"
                onClick={() =>
                  execute({
                    studentId: studentId as string,
                    status: "suspended",
                  })
                }
              >
                Deactivate / Suspend Account
              </Button>
            )}

            {data?.status === "suspended" && (
              <Button
                variant="default"
                onClick={() =>
                  execute({
                    studentId: studentId as string,
                    status: "active",
                  })
                }
              >
                Reactivate Account
              </Button>
            )}

            {/* <Button variant="outline">More Options</Button> */}
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
