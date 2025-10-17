"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import OpportunityForm from "./edit-opportunity";
import OpportunityTable from "./oppportunity-table";
import { useParams } from "next/navigation";
import { useFetchOpportunityDetails } from "@/hooks/query";
import { Opportunity } from "@/types";

export default function OpportunityDetailsPage() {
  const { id } = useParams();

  console.log("Opportunity ID:", id);
  const { data, isLoading, error } = useFetchOpportunityDetails(id as string);

  console.log("Opportunity Details Data:", data);

  const [editing, setEditing] = useState(false);

  const opportunity = data as Opportunity;

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (editing) {
    return <OpportunityForm />;
  }
  return (
    <div className="p-6 w-full mx-auto">
      {/* Header Info */}
      <div className="text-sm text-gray-600 mb-4">
        {opportunity?.type} • {opportunity?.location} •{" "}
      </div>

      {/* Card Container */}
      <div className=" rounded-md shadow-sm p-6 w-full">
        {/* Opportunity Section */}
        <div className="flex flex-flow justify-between">
          <h1 className="text-2xl font-semibold mb-4">Opportunity Details</h1>
          {/* <p className="text-xs"> {id}</p> */}
          <div className="flex flex-row justify-center gap-2">
            <Button variant={"default"} onClick={() => setEditing(true)}>
              Edit
            </Button>
            <Button variant={"secondary"}>Close</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 text-sm text-gray-700 mb-4">
          <div>
            <span className="font-medium">Department:</span>{" "}
            <span>{opportunity.department || "N/A"}</span>
          </div>
          <div>
            <span className="font-medium">Status:</span>{" "}
            <span className="text-green-600">{opportunity.status}</span>
          </div>
          <div>
            <span className="font-medium">Posted On:</span>{" "}
            <span>{opportunity.createdAt}</span>
          </div>
        </div>

        <p className="text-gray-600 mb-6">
          {opportunity.description ||
            "No description provided for this opportunity."}
        </p>

        <hr className="-mx-6 border-gray-200 mb-6" />

        {/* Applicants Section */}
        <h2 className="text-xl font-semibold mb-4">Applicants</h2>
        {/* <div className="space-y-3">Map over applicants here later</div> */}

        {/* Tbale  */}

        <OpportunityTable data={opportunity?.applications} />
      </div>
    </div>
  );
}
