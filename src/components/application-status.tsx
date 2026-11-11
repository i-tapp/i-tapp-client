import React from "react";
import { ApplicationStatus } from "@/types/enums";

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const statusConfig: Partial<
    Record<ApplicationStatus, { label: string; color: string }>
  > = {
    // new_applicant: {
    //   label: "New",
    //   color: "bg-blue-100 text-blue-700",
    // },
    [ApplicationStatus.SHORTLISTED]: {
      label: "Shortlisted",
      color: "bg-purple-100 text-purple-700",
    },
    [ApplicationStatus.INTERVIEWING]: {
      label: "Interviewing",
      color: "bg-yellow-100 text-yellow-700",
    },
    [ApplicationStatus.REJECTED]: {
      label: "Rejected",
      color: "bg-red-100 text-red-700",
    },
    [ApplicationStatus.APPROVED]: {
      label: "Approved",
      color: "bg-green-100 text-green-700",
    },
    [ApplicationStatus.ACCEPTED]: {
      label: "Accepted",
      color: "bg-green-100 text-green-700",
    },
    [ApplicationStatus.SENT]: {
      label: "Sent to company",
      color: "bg-sky-100 text-sky-700",
    },
    [ApplicationStatus.DELIVERED]: {
      label: "Delivered",
      color: "bg-green-100 text-green-700",
    },
    [ApplicationStatus.BOUNCED]: {
      label: "Not delivered",
      color: "bg-red-100 text-red-700",
    },
    [ApplicationStatus.FORM_OPENED]: {
      label: "Form opened",
      color: "bg-amber-100 text-amber-700",
    },
    [ApplicationStatus.FORM_SUBMITTED]: {
      label: "Submitted",
      color: "bg-green-100 text-green-700",
    },
  };

  const currentStatus = statusConfig[status] || {
    label: status,
    color: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${currentStatus.color}`}
    >
      {currentStatus.label}
    </span>
  );
}
