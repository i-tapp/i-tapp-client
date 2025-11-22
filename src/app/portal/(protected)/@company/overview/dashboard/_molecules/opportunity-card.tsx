import { Button } from "@/components/ui/button";
import {
  Briefcase,
  TickCircle,
  CloseCircle,
  DocumentText,
} from "iconsax-reactjs";
import Link from "next/link";

type OpportunityCardProps = {
  id: string;
  title: string;
  applicants: number;
  status: "open" | "closed" | "draft";
  department?: string;
  location?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  variant?: "dashboard" | "list"; // layout variant
};

export default function OpportunityCard({
  id,
  title,
  applicants,
  status,
  department,
  location,
  icon = <Briefcase className="w-5 h-5 text-blue-600" />,
  actionLabel = "View",
  onAction,
  variant = "dashboard",
}: OpportunityCardProps) {
  // Render status consistently
  const renderStatus = () => {
    const baseClass =
      variant === "dashboard"
        ? "px-3 py-1 text-xs font-semibold rounded-xl"
        : "flex items-center justify-center gap-1 text-sm font-medium";

    switch (status) {
      case "open":
        return variant === "dashboard" ? (
          <span className={`${baseClass} bg-green-700 text-white`}>
            {status}
          </span>
        ) : (
          <div className={`${baseClass} text-green-600`}>
            <TickCircle size={16} variant="Bold" />
            <span>Active</span>
          </div>
        );
      case "closed":
        return variant === "dashboard" ? (
          <span className={`${baseClass} bg-red-100 text-red-700`}>
            {status}
          </span>
        ) : (
          <div className={`${baseClass} text-red-600`}>
            <CloseCircle size={16} variant="Bold" />
            <span>Closed</span>
          </div>
        );
      case "draft":
        return variant === "dashboard" ? (
          <span className={`${baseClass} bg-gray-100 text-gray-700`}>
            {status}
          </span>
        ) : (
          <div className={`${baseClass} text-gray-500`}>
            <DocumentText size={16} variant="Bold" />
            <span>Draft</span>
          </div>
        );
      default:
        return null;
    }
  };

  if (variant === "dashboard") {
    // Card-style layout
    return (
      <div className="flex items-center justify-between rounded-md w-full px-3 py-4 shadow-md bg-[#fcfcfd] border-l-4 border-l-primary">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f5]">
            {icon}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-800">{title}</div>
            {department && location && (
              <div className="text-xs text-gray-500">
                {department} &#8226; {location}
              </div>
            )}
            <div className="text-xs text-gray-500">
              Applicant{applicants !== 1 && "s"}: {applicants}
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {renderStatus()}
          <Button
            onClick={onAction}
            className="flex items-center gap-1 shadow-sm text-white"
          >
            <Link href={`/portal/overview/opportunities/${id}`}>
              {actionLabel}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // List-style layout
  return (
    <div className="flex items-center justify-between px-4 py-4 border-b border-[#f5f5f5] hover:bg-gray-50 transition">
      {/* Left: icon + title */}
      <div className="flex items-center gap-3 flex-1">
        <div className="h-10 w-10 rounded-full bg-[#f5f5f5] flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h1 className="text-sm font-semibold">{title}</h1>
          {department && location && (
            <p className="text-xs text-gray-500">
              {department} &#8226; {location}
            </p>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="w-28 text-center">{renderStatus()}</div>

      {/* Applicants */}
      <div className="w-28 text-center text-sm text-gray-700">
        {applicants} Applicant{applicants !== 1 && "s"}
      </div>

      {/* Action */}
      <div className="w-28 text-right">
        <Button
          onClick={onAction}
          className="flex items-center gap-2"
          variant="secondary"
        >
          <Link href={`/portal/overview/opportunities/${id}`}>
            {actionLabel}
          </Link>
        </Button>
      </div>
    </div>
  );
}
