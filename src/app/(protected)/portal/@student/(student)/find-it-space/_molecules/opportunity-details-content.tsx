import { apply, save, withdraw } from "@/actions";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { useFetchOpportunityPublicDetails } from "@/hooks/query";
import { useFetchMyApplicationStatus } from "@/queries/student";
import { ApplicationStatus } from "@/types/enums";
import { formatDate } from "@/utils/format-date";
import { useQueryClient } from "@tanstack/react-query";
import { Bank, Calendar, Heart } from "iconsax-reactjs";
import { BadgeCheck, Banknote, ClockIcon, Globe } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import dp from "@/assets/images/dp.png";
import { useEffect, useState } from "react";

export default function OpportunityDetailsContent({
  selectedId,
  setSelectedId,
  selectedOpportunity: propOpportunity,
}: {
  selectedId?: string | null;
  setSelectedId?: (id: string | null) => void;
  selectedOpportunity?: any;
}) {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const isPage = pathname.startsWith("/portal/find-it-space/o/");
  const router = useRouter();
  const params = useParams();
  const id = params.opportunityId;

  const opportunityId = isPage ? String(id) : selectedId;

  const { data: fetchedOpportunity, isLoading } =
    useFetchOpportunityPublicDetails(opportunityId ?? undefined);

  console.log("Fetched Opportunity:", fetchedOpportunity);

  // Fallback to propOpportunity for any fields the backend detail endpoint misses (like preferredFields)
  const selectedOpportunity =
    fetchedOpportunity || propOpportunity
      ? {
          ...propOpportunity,
          ...fetchedOpportunity,
          preferredFields:
            fetchedOpportunity?.preferredFields?.length > 0
              ? fetchedOpportunity?.preferredFields
              : propOpportunity?.preferredFields,
        }
      : null;

  const { data: myApplicationStatus } = useFetchMyApplicationStatus(
    opportunityId ?? undefined,
  );

  const exists = myApplicationStatus?.exists ?? false;
  const status = myApplicationStatus?.status ?? null;
  const applicationId = myApplicationStatus?.applicationId ?? null;
  const logo = selectedOpportunity?.company?.logo ?? null;

  const isWithdrawn = status === ApplicationStatus.WITHDRAWN;
  const canWithdraw =
    exists && status === ApplicationStatus.APPLIED && Boolean(applicationId);

  const address = selectedOpportunity?.company?.addresses?.[0] ?? null;

  const formatAddress = (address?: any) => {
    if (!address) return "No address available";

    return [address.line1, address.city, address.state, address.country]
      .filter((val) => val && val !== "N/A")
      .join(", ");
  };

  const invalidateDetails = () => {
    queryClient.invalidateQueries({
      queryKey: ["my-application-status", opportunityId],
    });
    queryClient.invalidateQueries({
      queryKey: ["opportunity-public-details", opportunityId],
    });
  };

  const {
    execute: applyAction,
    isExecuting: isApplying,
    result: applyResult,
    hasErrored,
  } = useAction(apply, {
    onSuccess: (data) => {
      toast.success(data?.data?.data?.message || "Applied successfully!");
      invalidateDetails();
    },
    onError: (err) => {
      console.error("Apply action error:", err);
      toast.error(
        err?.error?.serverError || "Failed to apply. Please try again.",
      );
    },
  });

  const { execute: saveAction } = useAction(save, {
    onSuccess(data) {
      toast.success("Saved successfully!");
    },
    onError(err) {
      // console.error(err);
      toast.error(
        err?.error?.serverError || "Failed to save job. Please try again.",
      );
    },
  });

  const { execute: withdrawAction, isExecuting: isWithdrawing } = useAction(
    withdraw,
    {
      onSuccess(data) {
        toast.success(data?.data?.message || "Withdrawn successfully!");
        invalidateDetails();
      },
      onError(err) {
        // console.error(err);
        toast.error(
          err?.error?.serverError || "Failed to withdraw. Please try again.",
        );
      },
    },
  );

  const handleApply = () => {
    if (!opportunityId) return;
    applyAction({ id: opportunityId });
  };

  const handleWithdraw = () => {
    if (!applicationId) return;
    withdrawAction({ id: applicationId });
  };

  const handleSave = () => {
    if (!opportunityId) return;
    saveAction({ id: opportunityId });
  };

  let actionButton = null;

  if (!exists || isWithdrawn) {
    actionButton = (
      <Button onClick={handleApply} className="w-full" disabled={isApplying}>
        {isWithdrawn ? "Re-apply" : isApplying ? "Applying..." : "Apply Now"}
      </Button>
    );
  } else if (canWithdraw) {
    actionButton = (
      <Button
        onClick={handleWithdraw}
        className="w-full"
        variant="destructive"
        disabled={isWithdrawing}
      >
        {isWithdrawing ? "Withdrawing..." : "Withdraw"}
      </Button>
    );
  } else {
    actionButton = (
      <Button disabled className="w-full bg-gray-200 text-gray-500 capitalize">
        {status}
      </Button>
    );
  }

  const visible = Boolean(opportunityId);
  if (!visible) return null;

  if (isLoading) return <Spinner />;
  return (
    <div className="flex flex-col gap-5 p-4">
      {/* Header */}
      <div className="flex items-center justify-between ">
        <Image
          src={logo ?? dp}
          alt="Company Logo"
          width={44}
          height={44}
          className="h-11 w-11 rounded-xl border border-gray-200 bg-white shadow-sm"
        />

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-[0.98]"
          aria-label="Save / Like"
          onClick={handleSave}
        >
          <Heart size={18} />
        </button>
      </div>

      {/* Title & Company */}
      <section className="space-y-1">
        <p className="text-xl font-semibold tracking-tight text-gray-900">
          {selectedOpportunity?.title}
        </p>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          <div className="flex flex-row items-center gap-1">
            <Link
              href={`/portal/company/${selectedOpportunity?.company?.id}`}
              className="font-semibold text-primary hover:underline"
            >
              {selectedOpportunity?.company?.name}
            </Link>

            {selectedOpportunity?.company?.status === "approved" && (
              <div className="relative group inline-block">
                <BadgeCheck className="w-3 h-3 text-blue-500 cursor-pointer" />

                <div className="absolute bottom-full mb-1 w-48 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded shadow">
                  This company is verified. Companies without this badge have
                  not been verified yet.
                </div>
              </div>
            )}
          </div>

          <span className="text-gray-300">•</span>

          <p className="text-gray-500">
            {address ? formatAddress(address) : "Location not available"},
          </p>

          {/* <p>{opportunityId}</p> */}
        </div>
      </section>

      {/* Highlights */}
      <section className="grid grid-cols-2 gap-3">
        <StatCard
          label="Applicants"
          value={selectedOpportunity?.totalApplications ?? 0}
        />
        <StatCard
          label="Duration"
          value={`${selectedOpportunity?.duration || "N/A"} Months`}
        />
      </section>

      {/* Job info */}
      <section className="space-y-3">
        <SectionTitle title="Job Information" />

        <div className="grid grid-cols-2 gap-3">
          <InfoItem
            label="Duration"
            value={`${selectedOpportunity?.duration || "N/A"} Months`}
            icon={<ClockIcon size={18} />}
          />
          <InfoItem
            label="Stipend"
            value={selectedOpportunity?.stipend ?? "N/A"}
            icon={<Banknote size={18} />}
          />
          <InfoItem
            label="Mode"
            value={selectedOpportunity?.mode ?? "N/A"}
            icon={<Globe size={18} />}
          />
          <InfoItem
            label="Posted"
            // value="Oct 24, 2023"
            value={formatDate(selectedOpportunity?.createdAt ?? "")}
            icon={<Calendar size={18} />}
          />
          <InfoItem
            label="Department"
            value={selectedOpportunity?.department ?? "Not specified"}
            icon={<Bank size={18} />}
          />
        </div>
      </section>

      {/* Description */}
      <section className="space-y-2">
        <SectionTitle title="Description" />
        <p className="text-sm leading-relaxed text-gray-600">
          {selectedOpportunity?.description ?? "No description provided."}
        </p>
      </section>

      <section className="space-y-2">
        <SectionTitle title="Preferred Fields of Study" />

        {selectedOpportunity?.preferredFields?.length > 0 ? (
          <div className="text-sm leading-relaxed text-gray-600">
            {selectedOpportunity?.preferredFields?.map(
              (field: any, index: number) => (
                <p
                  key={field?.id || index}
                  className="capitalize bg-secondary/30 px-2 py-1 rounded mb-1"
                >
                  {typeof field === "string" ? field : field?.field}
                </p>
              ),
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-600">No fields specified.</p>
        )}
      </section>

      {/* Actions */}
      <div className="mt-1 flex flex-col gap-2">
        {actionButton}

        <Button
          variant="ghost"
          onClick={() => {
            if (isPage) {
              router.back();
              return;
            }
            setSelectedId?.(null);
          }}
          className="w-full rounded-xl border border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
        >
          Back to Listings
        </Button>
      </div>
    </div>
  );
}

const SectionTitle = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <span className="h-px flex-1 bg-gray-200 ml-3" />
    </div>
  );
};

const InfoItem = ({
  label = "Label",
  value = "Value",
  icon,
}: {
  label?: string;
  value?: string | number;
  icon?: React.ReactNode;
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 text-blue-400">
        {icon}
      </div>

      <div className="leading-tight">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-xs font-semibold text-gray-900 capitalize">
          {value}
        </p>
      </div>
    </div>
  );
};

const StatCard = ({
  label,
  value = 10,
}: {
  label: string;
  value: string | number;
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-linear-to-b from-white to-gray-50 px-4 py-3 ">
      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
        {value}
      </p>
    </div>
  );
};
