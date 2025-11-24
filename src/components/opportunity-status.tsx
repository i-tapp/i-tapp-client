import React from "react";
import { OpportunityStatus } from "@/types/enums";
import { CloseCircle, DocumentText, TickCircle } from "iconsax-reactjs";

export function OpportunityStatusBadge({
  status,
  variant = "default",
}: {
  status: OpportunityStatus;
  variant?: "dashboard" | "default";
}) {
  const baseClass =
    variant === "dashboard"
      ? "px-3 py-1 text-xs font-semibold rounded-xl capitalize"
      : "flex items-center justify-center gap-1 text-sm font-medium capitalize";

  const statusConfig: Record<
    OpportunityStatus,
    {
      label: string;
      dashboardColor: string;
      textColor: string;
      icon: React.ReactNode;
    }
  > = {
    [OpportunityStatus.OPEN]: {
      label: "Open",
      dashboardColor: "bg-green-700 text-white",
      textColor: "text-green-600",
      icon: <TickCircle size={16} variant="Bold" />,
    },
    [OpportunityStatus.CLOSED]: {
      label: "Closed",
      dashboardColor: "bg-red-100 text-red-700",
      textColor: "text-red-600",
      icon: <CloseCircle size={16} variant="Bold" />,
    },
    [OpportunityStatus.DRAFT]: {
      label: "Draft",
      dashboardColor: "bg-gray-100 text-gray-700",
      textColor: "text-gray-500",
      icon: <DocumentText size={16} variant="Bold" />,
    },
  };

  const current = statusConfig[status];

  // Dashboard view: pill with background color
  if (variant === "dashboard") {
    return (
      <span className={`${baseClass} ${current.dashboardColor}`}>
        {current.label}
      </span>
    );
  }

  // Default view: icon + text with simple text color
  return (
    <div className={`${baseClass} ${current.textColor}`}>
      {current.icon}
      <span>{current.label}</span>
    </div>
  );
}
