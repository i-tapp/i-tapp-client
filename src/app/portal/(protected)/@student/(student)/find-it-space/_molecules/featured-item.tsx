import React from "react";
import { cn } from "@/lib/utils";

export default function FeaturedItem({
  details,
  setCompanyId,
  companyId,
  setSelectedCompany,
}) {
  const { id, name, icon, postedAgo, opportunity, industry } = details;

  return (
    <div
      className={cn(
        // Adjust width responsively
        "w-[160px] sm:w-[180px] md:w-[200px] h-28 flex-shrink-0 bg-gradient-to-br from-white to-gray-50 rounded-xl p-3 border border-gray-200 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 flex flex-col justify-between",
        companyId === id && "border-primary bg-primary/5 shadow-md"
      )}
      onClick={() => {
        setCompanyId(id);
        setSelectedCompany(details);
      }}
    >
      <div>
        <h5 className="text-xs font-bold text-gray-900 line-clamp-2 leading-tight">
          {opportunity || name}
        </h5>
        <p className="text-[11px] text-gray-600 line-clamp-1 mt-1">
          {industry}
        </p>
      </div>
      <p className="text-[10px] text-primary font-medium">{postedAgo}</p>
    </div>
  );
}
