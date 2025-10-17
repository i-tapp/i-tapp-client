"use client";

import React from "react";
import Link from "next/link";
import { ProfileAdd, ArrowRight } from "iconsax-reactjs";
import { OverviewBox } from "@/components/overview-box";
import { ApplicantCard } from "../../../../../../../components/applicant-card";

import { Applicant, Opportunity } from "@/types";
import {
  useFetchAllCompanyApplications,
  useFetchCompanyOpportunities,
} from "@/hooks/query";
import { useCompanyStore } from "@/lib/store/company";
import OpportunityCard from "./opportunity-card";

export function Dashboard() {
  const company = useCompanyStore((s) => s.company);

  const { data, isLoading } = useFetchAllCompanyApplications();

  const { data: opportunities } = useFetchCompanyOpportunities();

  // if (isLoading) {
  //   return <p>Loading...</p>;
  // }

  // ✅ Safe destructuring from API response
  const totalApplicants = data?.data?.totalApplicants || [[], 0];
  const acceptedApplicants = data?.data?.acceptedApplicants || [[], 0];
  const shortlistedApplicants = data?.data?.shortListedApplicants || [[], 0];

  const totalApplicantsList = totalApplicants[0];
  const totalApplicantsCount = totalApplicants[1];

  const acceptedApplicantsCount = acceptedApplicants[1];
  const shortlistedApplicantsCount = shortlistedApplicants[1];

  console.log("opportunities", opportunities);

  return (
    <div className="flex flex-col gap-4">
      <h5 className="text-h6">
        Hello <span className="uppercase">{company?.name}</span>
      </h5>
      <p className=" text-grey-3">This is the overview of your activities</p>

      <div className="flex flex-col md:flex-row gap-4 w-full">
        <OverviewBox
          title="Total"
          number={totalApplicantsCount}
          icon={<ProfileAdd />}
          link={"/portal/overview/applicants"}
        />
        <OverviewBox
          title="Shortlisted"
          number={shortlistedApplicantsCount}
          icon={<ProfileAdd />}
          link={"/portal/candidates/shortlisted"}
        />
        <OverviewBox
          title="Accepted"
          number={acceptedApplicantsCount}
          icon={<ProfileAdd />}
          link={"/portal/candidates/accepted"}
        />
      </div>

      <div>
        <div className="flex justify-between my-5">
          <span>Recent Applicants</span>
          <Link href="/portal/overview/applicants" className="flex mr-14 gap-2">
            <span>See all</span>
            <ArrowRight size={24} color="#292D32" />
          </Link>
        </div>
        <div>
          {totalApplicantsList
            ?.slice(0, 5)
            .map((applicant: Applicant, index: number) => (
              <ApplicantCard key={index} applicant={applicant} />
            ))}
        </div>
        <div className="flex flex-col mt-5 gap-2">
          {opportunities?.map((opportunity: Opportunity, index: number) => (
            <OpportunityCard
              key={index}
              id={opportunity.id}
              title={opportunity.title}
              applicants={opportunity.totalApplications}
              status={opportunity.status}
              actionLabel="View Applicants"
              onAction={() => console.log("Viewing opportunity")}
            />
          ))}
          {/* <OpportunityCard
            title="Frontend Developer"
            applicants={5}
            status="open"
            actionLabel="View Applicants"
            onAction={() => console.log("Viewing opportunity")}
          /> */}
        </div>
      </div>
    </div>
  );
}
