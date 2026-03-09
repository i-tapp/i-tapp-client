import React, { ReactNode } from "react";
import Image from "next/image";
import dp from "@/assets/images/dp.png";
import moment from "moment";
import { cn } from "@/utils/tailwind";
import { Opportunity } from "@/types";
import { Clock, Profile2User, Location, Wifi } from "iconsax-reactjs";
import { useRouter } from "next/navigation";
import useIsResponsive from "@/utils/responsive";
import { BadgeCheck } from "lucide-react";
// import { useRouter } from "next/router";

// UI-only improvements: hierarchy, spacing, chips row, company + work-mode + location
export default function AvailableOpportunity({
  details,
  setSelectedId,
  selectedId,
  setSelectedOpportunity,
}: {
  details: Opportunity;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  setSelectedOpportunity: (name: Opportunity | null) => void;
}) {
  const { id, title, location, duration, createdAt, mode, totalApplications } =
    details;

  // ✅ best-effort company name (adapt to your actual field when available)
  const companyName =
    details?.company?.name ||
    // @ts-expect-error
    details?.companyName ||
    details?.company ||
    "Company";

  const isSelected = selectedId === id;
  const isVerified = details?.company?.status === "approved";

  const router = useRouter();
  const { isMobile } = useIsResponsive();

  return (
    <button
      type="button"
      className={cn(
        "w-full text-left bg-white rounded-2xl p-4 sm:p-5",
        "border transition-all",
        "hover:shadow-sm hover:border-gray-200",
        isSelected
          ? "border-primary/40 ring-2 ring-primary/10 shadow-sm"
          : "border-gray-100",
      )}
      onClick={() => {
        if (isMobile) {
          return router.push(`find-it-space/o/${id}`);
        }
        setSelectedId(id);
        setSelectedOpportunity(details);
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <Image
          src={details?.company?.logo ?? dp}
          alt="company logo"
          width={44}
          height={44}
          className="h-11 w-11 bg-gray-100 rounded-xl shrink-0"
        />

        <div className="min-w-0 flex-1">
          {/* Title */}
          <h6 className="text-[15px] sm:text-[16px] font-semibold leading-tight text-primary capitalize truncate">
            {title ?? "title"}
          </h6>

          {/* Company */}
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center gap-1">
              <p className="text-[13px] sm:text-sm font-medium text-gray-500  truncate">
                {companyName}
              </p>

              {isVerified && (
                <div className="relative group inline-block">
                  <BadgeCheck className="w-3 h-3 text-blue-500 cursor-pointer" />

                  <div className="absolute z-0 bottom-full mb-1 w-48 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded shadow">
                    This company is verified. Companies without this badge have
                    not been verified yet.
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-0.5 text-gray-400">
              <Location size="14" />
              <p className="text-sm capitalize">{location}</p>
            </div>
          </div>

          {/* Meta line: location + work mode */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {/* <MetaPill icon={<Location size="16" />} text={location ?? "N/A"} /> */}
            <MetaPill icon={<Wifi size="16" />} text={mode} />
            <MetaPill text={`${duration ? duration : 0} Months`} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <InfoText
          icon={<Clock size="16" />}
          value={moment(createdAt).startOf("day").fromNow()}
        />
        <InfoText
          icon={<Profile2User size="16" />}
          value={`${totalApplications} Applicants`}
        />
      </div>
    </button>
  );
}

const InfoText = ({
  value,
  icon,
}: {
  value: React.ReactNode;
  icon: React.ReactNode;
}) => {
  return (
    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
      <span className="opacity-80">{icon}</span>
      <span className="truncate">{value}</span>
    </div>
  );
};

const MetaPill = ({
  text,
  icon,
}: {
  text: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0F0F5] px-3 py-1 text-[12px] sm:text-[13px] font-semibold text-gray-700">
      {icon ? <span className="text-gray-500">{icon}</span> : null}
      <span className="leading-none">{text}</span>
    </span>
  );
};
