"use client";

import React from "react";
import Image from "next/image";
import { ArrowLeft, Call, Location, Note1, Sms } from "iconsax-reactjs";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { toast } from "react-toastify";
import Link from "next/link";
import moment from "moment";
import {
  acceptApplication,
  createOffer,
  declineApplication,
} from "@/actions/company";
import { GraduationCap } from "lucide-react";
import {
  useFetchApplicationDetails,
  useFetchStudentDetails,
} from "@/hooks/query";
import { useParams, useSearchParams } from "next/navigation";
import path from "path";
import { Spinner } from "@/components/spinner";

export default function CandidateProfile() {
  const { studentId } = useParams();
  const opportunityId = useSearchParams().get("opportunityId");

  const { data: studentDetails, isLoading } = useFetchStudentDetails(
    studentId as string
  );

  const { data: applicationDetails } = useFetchApplicationDetails(
    opportunityId as string
  );

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

  const handleCreate = () => {
    if (opportunityId) {
      createAction({ id: opportunityId });
    }
  };

  if (isLoading) {
    return <Spinner placeholder="Loading student details..." />;
  }

  return (
    <div className="min-h-screen bg-background py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex gap-6 items-center mb-8">
          {/* <Link href={`/portal/candidates/accepted`}>
            <ArrowLeft
              className="text-foreground cursor-pointer hover:text-primary transition-colors"
              size={24}
            />
          </Link> */}
          <div className="rounded-full border-2 border-primary/20 h-[100px] w-[100px] overflow-hidden">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bio & Contact Info Card */}
          <div className="border-2 border-primary/20 rounded-lg bg-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Bio & Contact
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">ABOUT</p>
                <p className="text-sm text-foreground leading-relaxed">
                  {studentDetails?.profileBio || "No bio provided."}
                </p>
              </div>

              <hr className="border-primary/20" />

              <div>
                <div className="flex items-start gap-3 mb-3">
                  <Sms className="text-primary mt-1" size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <a
                      href={
                        studentDetails?.user?.email
                          ? `mailto:${studentDetails?.user?.email}`
                          : undefined
                      }
                      className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      {studentDetails?.user?.email || "Not specified"}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <Call className="text-primary mt-1" size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <p className="text-sm font-semibold text-foreground">
                      {studentDetails?.user?.phoneNumber || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Location className="text-primary mt-1" size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">
                      Address
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {studentDetails?.user?.address || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Application Status & Student Info Card */}
          <div className="border-2 border-primary/20 rounded-lg bg-card">
            {/* Application Status Section */}
            <div className="p-6 border-b border-primary/20">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Application Status
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Status:</p>
                  <span className="text-sm font-semibold text-foreground">
                    {applicationDetails?.status
                      ? applicationDetails.status.charAt(0).toUpperCase() +
                        applicationDetails.status.slice(1)
                      : "N/A"}
                    {/* . ? "Accepted" : "Pending Review" */}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Applied Date:</p>
                  <span className="text-sm font-semibold text-foreground">
                    {applicationDetails?.appliedAt
                      ? moment(applicationDetails.appliedAt).format("ll")
                      : "N/A"}
                  </span>
                </div>
              </div>

              {/* {applicationDetails?.status?.accepted ? (
                <div className="space-y-3">
                  <div className="bg-primary/5 rounded-md p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        Start Date:
                      </p>
                      <span className="text-sm font-bold text-foreground">
                        {applicationDetails?.startDate
                          ? moment(applicationDetails.startDate).format("ll")
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">End Date:</p>
                      <span className="text-sm font-bold text-foreground">
                        {applicationDetails?.endDate
                          ? moment(applicationDetails.endDate).format("ll")
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    disabled
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    Accepted
                  </Button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button
                    onClick={handleAccept}
                    size="default"
                    disabled={isAccepting}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isAccepting ? "Processing..." : "Accept"}
                  </Button>
                  <Button
                    onClick={() =>
                      declineAction({ id: opportunityId as string })
                    }
                    disabled={isDeclining}
                    size="default"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isDeclining ? "Processing..." : "Decline"}
                  </Button>
                </div>
              )} */}

              <div className="flex gap-3">
                {applicationDetails?.status === "accepted" ? (
                  // <div className="w-full text-center py-2 rounded bg-green-100 text-green-700 font-medium">
                  //   Accepted
                  // </div>

                  <Button
                    disabled
                    size="default"
                    variant={"outline"}
                    className="flex-1 w-full text-center py-2 rounded bg-green-100 text-green-700 font-medium"
                  >
                    Accepted
                  </Button>
                ) : applicationDetails?.status === "rejected" ? (
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
                ) : (
                  <>
                    <Button
                      onClick={handleCreate}
                      size="default"
                      disabled={isCreating}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isCreating ? "Processing..." : "Send Offer"}
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
              </div>
            </div>

            {/* Student Information Section */}
            <div className="p-6 border-b border-primary/20">
              <h2 className="text-lg font-bold text-foreground mb-4">
                Student Information
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <GraduationCap className="text-primary mt-1" size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">School</p>
                    <p className="text-sm font-semibold text-foreground">
                      {studentDetails?.school || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Note1 className="text-primary mt-1" size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">
                      Course of Study
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {studentDetails?.courseOfStudy || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Documents Section */}
            <div className="p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">
                Documents
              </h2>

              {studentDetails?.documentUrls &&
              studentDetails.documentUrls.length > 0 ? (
                <Button
                  size="lg"
                  onClick={() =>
                    window.open(
                      studentDetails.documentUrls,
                      "_blank",
                      "noopener noreferrer"
                    )
                  }
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  View Documents
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No documents uploaded.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
