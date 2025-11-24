"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import OpportunityTable from "./oppportunity-table";
import { useParams } from "next/navigation";
import { useFetchOpportunityDetails } from "@/hooks/query";
import { Opportunity } from "@/types";
import {
  TickCircle,
  CloseCircle,
  DocumentText,
  Edit2,
  Lock,
} from "iconsax-reactjs";
import { Calendar, MapPin, Briefcase } from "lucide-react";
import OpportunityForm from "../../_molecules/opportunity-form";

export default function OpportunityDetailsPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useFetchOpportunityDetails(id as string);
  const [editing, setEditing] = useState(false);

  const opportunity = data as Opportunity;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading opportunity details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold mb-2">
            Error loading opportunity
          </p>
          <p className="text-sm">{error.message || "Please try again later"}</p>
        </div>
      </div>
    );
  }

  if (editing) {
    return (
      <OpportunityForm
        initialData={opportunity}
        onClose={() => setEditing(false)}
        onSubmit={(data) => {
          console.log("Form submitted with data:", data);
          setEditing(false);
        }}
      />
    );
  }

  // Status configuration
  const statusConfig = {
    Active: {
      icon: <TickCircle size={18} variant="Bold" />,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    Closed: {
      icon: <CloseCircle size={18} variant="Bold" />,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    Draft: {
      icon: <DocumentText size={18} variant="Bold" />,
      color: "text-gray-600",
      bg: "bg-gray-50",
    },
  };

  const currentStatus = statusConfig[opportunity?.status] || statusConfig.Draft;

  return (
    <div className="p-4 md:p-6 w-full mx-auto max-w-7xl">
      {/* Breadcrumb/Meta Info */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 flex-wrap">
        <Briefcase size={16} />
        <span>{opportunity?.type || "N/A"}</span>
        <span>•</span>
        <MapPin size={16} />
        <span>{opportunity?.location || "N/A"}</span>
        <span>•</span>
        <Calendar size={16} />
        <span>
          Posted {new Date(opportunity?.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Main Card Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {opportunity?.title || "Untitled Opportunity"}
            </h1>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${currentStatus.bg} ${currentStatus.color}`}
            >
              {currentStatus.icon}
              <span className="font-medium text-sm">{opportunity?.status}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row gap-2">
            <Button
              variant="default"
              onClick={() => setEditing(true)}
              className="flex items-center text-white gap-2"
            >
              <Edit2 size={16} />
              Edit
            </Button>
            <Button variant="secondary" className="flex items-center gap-2">
              <Lock size={16} />
              Close
            </Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              Department
            </span>
            <span className="text-sm text-gray-900 font-semibold mt-1">
              {opportunity?.department || "N/A"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              Status
            </span>
            <span
              className={`text-sm font-semibold mt-1 ${currentStatus.color}`}
            >
              {opportunity?.status}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              Posted On
            </span>
            <span className="text-sm text-gray-900 font-semibold mt-1">
              {new Date(opportunity?.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Description
          </h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {opportunity?.description ||
              "No description provided for this opportunity."}
          </p>
        </div>

        <hr className="-mx-4 md:-mx-6 border-gray-200 mb-6" />

        {/* Applicants Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>Applicants</span>
            <span className="text-sm font-normal text-gray-500">
              ({opportunity?.applications?.length || 0} total)
            </span>
          </h2>

          <OpportunityTable data={opportunity?.applications || []} />
        </div>
      </div>
    </div>
  );
}
