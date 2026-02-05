"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Call, Location, Note1, Sms } from "iconsax-reactjs";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { toast } from "react-toastify";
import moment from "moment";
import { GraduationCap } from "lucide-react";
import {
  useFetchApplicationDetails,
  useFetchStudentDetails,
} from "@/hooks/query";
import { useParams, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/spinner";
import OfferModal from "./send-offer";
import Hr from "@/components/ui/hr";
import { cn } from "@/utils/tailwind";
import {
  acceptApplication,
  createOffer,
  declineApplication,
  deleteOffer,
} from "@/actions";
import Link from "next/link";
import { ApplicationStatus } from "@/types/enums";
import { OfferFormData } from "@/schemas";

export default function CandidateProfile() {
  const [offerFormOpen, setOfferFormOpen] = useState(false);
  const { studentId } = useParams();
  const opportunityId = useSearchParams().get("opportunityId");

  const { data: studentDetails, isLoading } = useFetchStudentDetails(
    studentId as string,
  );

  const { data: applicationDetails, isLoading: applicationLoading } =
    useFetchApplicationDetails(opportunityId as string);

  const offerId = applicationDetails?.offer?.id;

  const name = studentDetails?.firstName + " " + studentDetails?.lastName;

  console.log("studentDetails", studentDetails);

  const { execute: createAction, isExecuting: isCreating } = useAction(
    createOffer,
    {
      onSuccess: () => {
        toast.success("Application accepted successfully!");
      },
      onError: (error) => {
        const { serverError } = error?.error;
        const errorMessage = serverError || "An error occurred.";
        toast.error(errorMessage);
      },
    },
  );

  const { execute: acceptAction, isExecuting: isAccepting } = useAction(
    acceptApplication,
    {
      onSuccess: () => {
        toast.success("Application accepted successfully!");
      },
      onError: (error) => {
        const { serverError } = error?.error;
        const errorMessage = serverError || "An error occurred.";
        toast.error(errorMessage);
      },
    },
  );

  const { execute: declineAction, isExecuting: isDeclining } = useAction(
    declineApplication,
    {
      onSuccess: () => {
        toast.success("Application declined successfully!");
      },
      onError: (error) => {
        const { serverError } = error?.error;
        const errorMessage = serverError || "An error occurred.";
        toast.error(errorMessage);
      },
    },
  );

  const { execute: withdrawOffer, isExecuting: isWithdrawing } = useAction(
    deleteOffer,
    {
      onSuccess: () => {
        toast.success("Offer withdrawn successfully!");
      },
      onError: (error) => {
        const { serverError } = error?.error;
        const errorMessage = serverError || "An error occurred.";
        toast.error(errorMessage);
      },
    },
  );

  const handleCreate = (things: OfferFormData) => {
    if (opportunityId) {
      createAction({ ...things, id: opportunityId });
    }
  };

  if (isLoading) {
    return <Spinner placeholder="Loading student details..." />;
  }

  console.log("applicationDetails", applicationDetails);

  return (
    <div className="min-h-screen bg-gray-50/60 ">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex gap-6 items-center mb-8">
          <div className="rounded-full border-2 border-white h-20 w-20 overflow-hidden">
            <Image
              src={studentDetails?.profileImageUrl || "/applicant.png"}
              alt={name}
              width={100}
              height={100}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="grid grid-cols-1">
            <h1 className="font-semibold text-2xl text-foreground">{name}</h1>
            <p className="text-base text-muted-foreground">
              {studentDetails?.courseOfStudy || "Not specified"}
            </p>
            <p className="text-base text-semibold text-muted-foreground">
              {studentDetails?.school || "Not specified"}
            </p>
          </div>
        </div>

        {/* Main Content Grid */}

        <div className="flex flex-row justify-between gap-4">
          <SectionWrapper className="flex flex-col rounded-lg border bg-white px-6 py-6 gap-4 w-full ">
            <div className=" flex flex-col gap-2">
              <h1 className="font-semibold">Candidate Profile</h1>
              <div className="mt-4">
                <h1 className="uppercase text-muted-foreground text-sm font-semibold">
                  about
                </h1>
                <p className="text-sm text-muted-foreground">
                  {studentDetails?.bio || "No bio available."}
                </p>
              </div>
            </div>

            <Hr />
            <div className=" flex flex-col gap-2">
              <HeaderLabel title="Education" />
              <InfoCard
                icon={GraduationCap}
                label="School"
                value={studentDetails?.school || "Not provided"}
              />

              <InfoCard
                icon={Note1}
                label="Course of Study"
                value={studentDetails?.courseOfStudy || "Not provided"}
              />
            </div>

            <Hr />
            <div className="flex flex-col gap-2">
              <HeaderLabel title="Contact Information" />
              <InfoCard
                icon={Sms}
                label="Email"
                value={studentDetails?.user?.email || "Not provided"}
              />
              <InfoCard
                icon={Call}
                label="Phone"
                value={studentDetails?.user?.phoneNumber || "Not provided"}
              />

              <InfoCard
                icon={Location}
                label="Address"
                value={studentDetails?.user?.address || "Not provided"}
              />
            </div>
          </SectionWrapper>
          <div className="flex flex-col gap-6 w-full">
            <SectionWrapper className="flex flex-col gap-2">
              <HeaderLabel title="Application Info" />
              <div className="flex flex-row justify-between">
                <p className="text-xs">Current status:</p>{" "}
                <p className="italic text-xs font-semibold">
                  {applicationDetails?.status
                    ? applicationDetails.status.charAt(0).toUpperCase() +
                      applicationDetails.status.slice(1)
                    : "N/A"}
                </p>
              </div>
              <div className="flex text-sm flex-row justify-between">
                <p className="text-xs">Applied date:</p>{" "}
                <p className="italic text-xs font-semibold">
                  {applicationDetails?.appliedAt
                    ? moment(applicationDetails.appliedAt).format("ll")
                    : "N/A"}
                </p>
              </div>

              <div className="flex gap-3">
                {renderApplicationActions({
                  application: applicationDetails,
                  offer: applicationDetails?.offer,
                  setOfferFormOpen,
                  declineAction,
                  withdrawOffer,
                  isDeclining,
                  isWithdrawing,
                })}
              </div>
            </SectionWrapper>

            {/* <SectionWrapper className="">
              <HeaderLabel title="Student Info" />

             
            </SectionWrapper> */}

            <SectionWrapper className="h-30">
              <HeaderLabel title="Documents" />

              {studentDetails?.itLetter || studentDetails?.cv ? (
                <div className="grid grid-cols-1 gap-2">
                  {studentDetails?.itLetter && (
                    <Link
                      href={studentDetails?.itLetter}
                      target="_blank"
                      className="text-left text-sm text-primary underline"
                    >
                      View IT Letter
                    </Link>
                  )}
                  {studentDetails?.cv && (
                    <Link
                      href={studentDetails?.cv}
                      target="_blank"
                      className="text-left text-sm text-primary underline"
                    >
                      View CV
                    </Link>
                  )}
                </div>
              ) : (
                <p className="text-xs mt-3"> No documents uploaded</p>
              )}
            </SectionWrapper>
          </div>
        </div>

        <OfferModal
          offerFormOpen={offerFormOpen}
          onClose={() => setOfferFormOpen(false)}
          onCreate={(things: OfferFormData) => handleCreate(things)}
        />
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-4 ">
      <div className="p-2 bg-gray-100 rounded-lg">
        <Icon className="text-gray-600 size-4" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className=" text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function HeaderLabel({ title }: { title: string }) {
  return <h1 className="font-semibold text-sm">{title}</h1>;
}

function SectionWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(`bg-white p-4 border rounded-lg`, className)}>
      {children}
    </div>
  );
}

type ApplicationActionProps = {
  application: any;
  offer: any;
  setOfferFormOpen: (open: boolean) => void;
  declineAction: (data: { id: string }) => void;
  withdrawOffer: (data: { id: string }) => void;
  isDeclining: boolean;
  isWithdrawing: boolean;
};

function renderApplicationActions({
  application,
  offer,
  setOfferFormOpen,
  declineAction,
  withdrawOffer,
  isDeclining,
  isWithdrawing,
}: ApplicationActionProps) {
  const status = application?.status;
  const offerStatus = offer?.status;

  if (
    status === ApplicationStatus.IN_REVIEW ||
    status === ApplicationStatus.SHORTLISTED
  ) {
    return (
      <>
        <Button
          onClick={() => setOfferFormOpen(true)}
          className="flex-1 bg-green-600 text-white"
        >
          Send Offer
        </Button>
        <Button
          disabled={isDeclining}
          onClick={() => declineAction({ id: application.opportunityId })}
          className="flex-1 bg-red-600 text-white"
        >
          Decline
        </Button>
      </>
    );
  }

  if (status === ApplicationStatus.OFFERED) {
    if (offerStatus === "sent") {
      return (
        <>
          <p className="flex-1 bg-yellow-100 text-yellow-700 text-center py-2 rounded">
            Waiting for student response
          </p>

          <Button
            disabled={isWithdrawing}
            onClick={() => withdrawOffer({ id: offer.id })}
          >
            Withdraw Offer
          </Button>
        </>
      );
    }

    if (offerStatus === "accepted") {
      return <StatusBadge color="green">Hired</StatusBadge>;
    }

    if (offerStatus === "declined") {
      return <StatusBadge color="red">Student Declined Offer</StatusBadge>;
    }
  }

  if (status === "rejected") {
    return <StatusBadge color="red">Rejected</StatusBadge>;
  }

  if (status === "hired") {
    return <StatusBadge color="green">Hired</StatusBadge>;
  }

  return null;
}

function StatusBadge({
  children,
  color,
}: {
  children: React.ReactNode;
  color: "green" | "red";
}) {
  return (
    <div
      className={`px-4 py-2 rounded ${
        color === "green"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {children}
    </div>
  );
}
