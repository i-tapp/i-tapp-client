"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Call, Location, Note1, Sms } from "iconsax-reactjs";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { toast } from "react-toastify";
import moment from "moment";
import {
  acceptApplication,
  createOffer,
  declineApplication,
  deleteOffer,
} from "@/actions/company";
import { GraduationCap } from "lucide-react";
import {
  useFetchApplicationDetails,
  useFetchStudentDetails,
} from "@/hooks/query";
import { useParams, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/spinner";
import OfferModal, { OfferFormData } from "./send-offer";
import { Loader } from "@/components/ui/loader";
import Loading from "@/components/loading";
import Hr from "@/components/ui/hr";
import { cn } from "@/utils/tailwind";

export default function CandidateProfile() {
  const [offerFormOpen, setOfferFormOpen] = useState(false);
  const { studentId } = useParams();
  const opportunityId = useSearchParams().get("opportunityId");

  const { data: studentDetails, isLoading } = useFetchStudentDetails(
    studentId as string
  );

  const { data: applicationDetails } = useFetchApplicationDetails(
    opportunityId as string
  );

  const offerId = applicationDetails?.offer?.id;

  const name = studentDetails?.firstName + " " + studentDetails?.lastName;

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
    }
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
    }
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
    }
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
    }
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
          <div>
            <h1 className="font-semibold text-2xl text-foreground">{name}</h1>
            <p className="text-base pt-1 text-muted-foreground">
              {studentDetails?.courseOfStudy || "Not specified"}
            </p>
          </div>
        </div>

        {/* Main Content Grid */}

        <div className="flex flex-row justify-between gap-4">
          <SectionWrapper className="flex flex-col rounded-lg border bg-white px-6 py-6 gap-4 w-full ">
            <div className=" h-80">
              <h1 className="font-semibold"> Bio & Contact</h1>

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
                <p className="text-xs">status:</p>{" "}
                <p className="italic text-xs font-semibold">
                  {applicationDetails?.status
                    ? applicationDetails.status.charAt(0).toUpperCase() +
                      applicationDetails.status.slice(1)
                    : "N/A"}
                </p>
              </div>
              <div className="flex text-sm flex-row justify-between">
                <p className="text-xs">applied date:</p>{" "}
                <p className="italic text-xs font-semibold">
                  {applicationDetails?.appliedAt
                    ? moment(applicationDetails.appliedAt).format("ll")
                    : "N/A"}
                </p>
              </div>

              <div className="flex gap-3">
                {applicationDetails?.status === "in_review" && (
                  <>
                    <Button
                      onClick={() => setOfferFormOpen(true)}
                      size="default"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      {"Send Offer"}
                    </Button>

                    <Button
                      onClick={() =>
                        declineAction({ id: opportunityId as string })
                      }
                      size="default"
                      disabled={isDeclining}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      {isDeclining ? "Processing..." : "Decline"}
                    </Button>
                  </>
                )}

                {applicationDetails?.status === "accepted" && (
                  <Button
                    disabled
                    size="default"
                    variant={"outline"}
                    className="flex-1 w-full text-center py-2 rounded bg-green-100 text-green-700 font-medium"
                  >
                    Accepted
                  </Button>
                )}

                {applicationDetails?.status === "declined" && (
                  // <div className="w-full text-center py-2 rounded bg-red-100 text-red-700 font-medium">
                  //   Declined
                  // </div>

                  <Button
                    disabled
                    size="default"
                    variant={"outline"}
                    className="flex-1 w-full text-center py-2 rounded bg-red-100 text-red-700 font-medium"
                  >
                    Declined
                  </Button>
                )}

                {applicationDetails?.status === "rejected" && (
                  <Button
                    disabled
                    size="default"
                    variant={"outline"}
                    className="flex-1 w-full text-center py-2 rounded bg-red-100 text-red-700 font-medium"
                  >
                    Student Rejected Offer
                  </Button>
                )}

                {applicationDetails?.status === "offered" && (
                  <div className="flex flex-row justify-center gap-2">
                    <p className="flex w-full text-center px-2 py-2 rounded bg-yellow-100 text-yellow-700 font-medium">
                      Waiting for student response
                    </p>

                    <Button
                      disabled={isWithdrawing}
                      size="default"
                      variant={"outline"}
                      onClick={() => withdrawOffer({ id: offerId as string })}
                      className="flex-1 w-full text-center py-2 rounded bg-red-100 text-red-700 font-medium"
                    >
                      {isWithdrawing ? (
                        <>
                          <Loader /> <Loading />
                        </>
                      ) : (
                        "Withdraw Offer"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </SectionWrapper>

            <SectionWrapper className="">
              <HeaderLabel title="Student Info" />

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
            </SectionWrapper>

            <SectionWrapper className="h-30">
              <HeaderLabel title="Documents" />

              <p className="text-xs mt-3"> No documents uploaded</p>
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
