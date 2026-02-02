import { apply, save, withdraw } from "@/actions";
import { Button } from "@/components/ui/button";
import Hr from "@/components/ui/hr";
import { query } from "@/lib/api";
import { useStudentStore } from "@/lib/store";
import { Opportunity } from "@/types";
import { cn } from "@/utils/tailwind";
import { useQueryClient } from "@tanstack/react-query";
import { Bank, Calendar, Heart, Share } from "iconsax-reactjs";
import {
  Banknote,
  ClockIcon,
  CreditCard,
  DollarSign,
  Globe,
} from "lucide-react";
// import { Link } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import Link from "next/link";
import { todo } from "node:test";
import { toast } from "react-toastify";

// todo: improve application status handling
// If you want to simplify frontend logic even further, your backend can include a field like:
// const hasApplied = applications.some(
//   (app) => app.student.id === currentStudentId
// );
// const hasWithdrawn = applications.some(
//   (app) => app.student.id === currentStudentId && app.status === "withdrawn"
// );

export default function OpportunityDetailsContent({
  selectedId,
  setSelectedId,
  selectedOpportunity,
}: {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  selectedOpportunity: Opportunity | null;
}) {
  const currentStudentId = useStudentStore((state) => state.student?.id);
  console.log("currentStudentId", currentStudentId);

  const app = selectedOpportunity?.applications?.find(
    (a) => a.student.id === currentStudentId,
  );

  console.log("app", app);
  const applicationId = app?.id;
  const appStatus = app?.status;

  const queryClient = useQueryClient();

  const {
    execute: applyAction,
    isExecuting,
    hasErrored,
    result,
  } = useAction(apply, {
    onSuccess(data) {
      toast.success(data?.data?.message || "Applied successfully!");
      console.log("applyResult", data);
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
    },
    onError(error) {
      console.error(error);
      toast.error(
        error?.error?.serverError || "Failed to apply. Please try again.",
      );
    },
  });

  const { execute: saveAction, result: saveResult } = useAction(save, {
    onSuccess(data) {
      // toast.success(data.message);
      console.log("saveResult", data);
    },
    onError(error) {
      console.error(error);
      toast.error(
        error?.error?.serverError || "Failed to save job. Please try again.",
      );
    },
  });

  const { execute: withdrawAction, isExecuting: isWithdrawing } = useAction(
    withdraw,
    {
      onSuccess(data) {
        toast.success(data?.data?.message || "Withdrawn successfully!");
        console.log("withdrawResult", data);
        queryClient.invalidateQueries({ queryKey: ["opportunities"] });
      },
      onError(error) {
        console.error(error);
        toast.error(
          error?.error?.serverError || "Failed to withdraw. Please try again.",
        );
      },
    },
  );

  const handleApply = () => applyAction({ id: selectedId! });
  const handleWithdraw = () => {
    withdrawAction({ id: applicationId! });
  }; // Implement withdraw logic if needed
  const handleSave = () => saveAction({ id: selectedId! });

  console.log("status", appStatus);

  let actionButton = null;

  if (!app) {
    actionButton = (
      <Button
        onClick={handleApply}
        size="default"
        className="w-full text-white"
        disabled={isExecuting}
      >
        {isExecuting ? "Applying..." : "Apply Now"}
      </Button>
    );
  } else if (appStatus === "withdrawn") {
    actionButton = (
      <Button
        size="default"
        className="w-full bg-gray-200 text-gray-500 cursor-not-allowed"
        disabled
      >
        Withdrawn
      </Button>
      // or if you want to allow reapply:
      // <Button onClick={handleApply} className="w-full">Reapply</Button>
    );
  } else {
    actionButton = (
      <Button
        onClick={handleWithdraw}
        size="default"
        className="w-full text-white"
        variant="destructive"
        disabled={isWithdrawing}
      >
        {isWithdrawing ? "Withdrawing..." : "Withdraw"}
      </Button>
    );
  }

  const visible = Boolean(selectedId);
  return (
    <div className="flex flex-col gap-5 p-4">
      {/* Header */}
      <div className="flex items-center justify-between ">
        <Image
          src="/logo.png"
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
          {selectedOpportunity?.title ?? "Opportunity Title"}
        </p>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          <Link
            href={`/portal/company/${selectedOpportunity?.company?.id}`}
            className="font-semibold text-gray-900 hover:underline"
          >
            {selectedOpportunity?.company?.name ?? "Company name"}
          </Link>

          <span className="text-gray-300">•</span>

          <p className="text-gray-500">
            {selectedOpportunity?.company?.address ?? "Location not available"},{" "}
            Nigeria
          </p>
        </div>
      </section>
      {/* Highlights */}
      <section className="grid grid-cols-2 gap-3">
        <StatCard label="Applicants" value={10} />
        <StatCard label="Duration" value="6 Months" />
      </section>
      {/* Job info */}
      <section className="space-y-3">
        <SectionTitle title="Job Information" />

        <div className="grid grid-cols-2 gap-3">
          <InfoItem
            label="Duration"
            value="6 Months"
            icon={<ClockIcon size={18} />}
          />
          <InfoItem
            label="Stipend"
            value="$50k - $70k"
            icon={<Banknote size={18} />}
          />
          <InfoItem label="Status" value="Remote" icon={<Globe size={18} />} />
          <InfoItem
            label="Posted"
            value="Oct 24, 2023"
            icon={<Calendar size={18} />}
          />
          <InfoItem
            label="Industry"
            value="Technology"
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
      {/* Actions */}
      <div className="mt-1 flex flex-col gap-2">
        {actionButton}

        <Button
          variant="ghost"
          onClick={() => setSelectedId(null)}
          className="w-full rounded-xl border border-gray-200 bg-white text-gray-800  hover:bg-gray-50"
        >
          Deselect
        </Button>
      </div>{" "}
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
        <p className="text-xs font-semibold text-gray-900">{value}</p>
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
