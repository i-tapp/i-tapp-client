"use client";

import Link from "next/link";
import {
  ArrowRight,
  ProfileTick,
  TickCircle,
  Profile2User,
} from "iconsax-reactjs";
import { OverviewBox } from "@/components/overview-box";

import { Applicant, Opportunity } from "@/types";
import {
  useFetchAllCompanyApplications,
  useFetchCompanyOpportunities,
  useFetchCompanyProfile,
} from "@/hooks/query";
import OpportunityCard from "./opportunity-card";
import { ApplicantCard } from "@/components/applicant-card";
import { useFetchApplicationsCount } from "@/queries/company";
import { Spinner } from "@/components/spinner";

export function Dashboard() {
  const { data, isLoading } = useFetchAllCompanyApplications();
  const { data: applicationsCount } = useFetchApplicationsCount();
  const { data: opportunities } = useFetchCompanyOpportunities();
  const { data: companyProfile } = useFetchCompanyProfile();

  if (isLoading) {
    return <Spinner />;
  }

  console.log("applications count", applicationsCount);

  const totalApplicants = data?.data?.totalApplicants || [[], 0];
  const totalApplicantsList = totalApplicants[0];

  console.log("opportunities", opportunities);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h5 className="text-lg font-black">
          Hello <span className="uppercase">{companyProfile?.name} 👋</span>
        </h5>
        <p className=" text-grey-3 text-sm">
          This is the overview of your activities
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full">
        <OverviewBox
          title="Total"
          number={applicationsCount?.total}
          icon={<Profile2User />}
          link={"/portal/overview/applicants"}
        />
        <OverviewBox
          title="Shortlisted"
          number={applicationsCount?.counts?.shortlisted ?? 0}
          icon={<ProfileTick />}
          link={"/portal/candidates/shortlisted"}
        />
        <OverviewBox
          title="Accepted"
          number={applicationsCount?.counts?.hired ?? 0}
          icon={<TickCircle />}
          link={"/portal/candidates/accepted"}
        />
      </div>

      <div>
        <div className="flex justify-between my-5">
          <span className="font-semibold">Recent Opportunities</span>
          <Link href="#" className="flex mr-14 gap-2">
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
        <div className="flex flex-col mt-5 border border-gray-100 bg-white rounded-xl">
          {opportunities?.map((opportunity: Opportunity, index: number) => (
            <OpportunityCard
              key={index}
              id={opportunity.id}
              title={opportunity.title}
              applicants={opportunity.totalApplications}
              status={opportunity.status}
              actionLabel="View Applicants"
              onAction={() => console.log("Viewing opportunity")}
              variant="list"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
