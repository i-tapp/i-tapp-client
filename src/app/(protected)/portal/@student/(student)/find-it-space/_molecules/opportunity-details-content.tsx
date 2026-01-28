import { apply, save, withdraw } from "@/actions/student";
import { Button } from "@/components/ui/button";
import Hr from "@/components/ui/hr";
import { query } from "@/lib/api";
import { useStudentStore } from "@/lib/store";
import { Opportunity } from "@/types";
import { cn } from "@/utils/tailwind";
import { useQueryClient } from "@tanstack/react-query";
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
      <div className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="Company Logo"
          width={40}
          height={40}
          className="w-10 h-10 rounded-md border border-gray-200"
        />
        <div>
          <p className="font-semibold text-gray-800">
            {selectedOpportunity?.title ?? "Opportunity Title"}
            {/* <span className="text-sm text-gray-500">
                  {" "}
                  {selectedId ?? "ID"}{" "}
                </span> */}
          </p>
          <Link href={`/portal/company/${selectedOpportunity?.company?.id}`}>
            <h5 className="text-primary font-semibold">
              {selectedOpportunity?.company?.name ?? "Company name"}
            </h5>
          </Link>
        </div>
      </div>
      {/* Applicants */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-light text-gray-800">
        {selectedOpportunity?.totalApplications ?? 0} Applicant
        {selectedOpportunity && selectedOpportunity.totalApplications !== 1
          ? "s"
          : ""}
      </div>
      {/* Job Details */}
      <div className="space-y-3 text-sm text-gray-700 border border-gray-100 bg-gray-50 rounded-lg p-3">
        <div className="space-y-1">
          <p>
            <span className="font-semibold text-gray-800">Duration:</span>
            {selectedOpportunity?.duration ?? 0}
            {/* months */}
          </p>
          <p>
            <span className="font-semibold text-gray-800">Industry:</span>
            {selectedOpportunity?.company?.industry ?? "N/A"}
          </p>
          <p>
            <span className="font-semibold text-gray-800">Date Posted:</span>{" "}
            {selectedOpportunity?.createdAt ?? "N/A"}
          </p>
        </div>

        <Hr />

        <div className="space-y-2">
          <h2 className="font-semibold text-gray-800">Description</h2>
          <p className="text-gray-600 leading-relaxed">
            {selectedOpportunity?.description ?? "No description provided."}
          </p>
        </div>
      </div>
      {/* Actions */}
      <div className="flex flex-col gap-2 mt-2">
        {actionButton}
        {/* {selectedOpportunity?.hasApplied ? (
              <Button
                onClick={handleWithdraw}
                size="default"
                className="w-full text-white"
                variant={"destructive"}
                disabled={isWithdrawing}
              >
                {isWithdrawing ? "Withdrawing..." : "Withdraw"}
              </Button>
            ) : (
              <Button
                onClick={handleApply}
                size="default"
                className="w-full text-white"
                disabled={isExecuting}
              >
                {isExecuting ? "Applying..." : "Apply Now"}
              </Button>
            )} */}
        {/* <Button
              onClick={handleApply}
              size="default"
              className="w-full text-white"
              disabled={isExecuting}
            >
              {isExecuting ? "Applying..." : "Apply Now"}
            </Button> */}
        <Button
          variant="ghost"
          onClick={() => setSelectedId(null)}
          className="w-full"
        >
          Deselect
        </Button>
      </div>{" "}
      {/* Save Job */}
      {/* Save Job */}
      {/* <div className="flex justify-center">
        <Button
          onClick={handleSave}
          variant="ghost"
          className="text-primary border border-primary/30 rounded-2xl font-medium shadow-sm w-auto"
        >
          Save Job
        </Button>
      </div> */}
    </div>
  );
}
