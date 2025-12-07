"use client";

import React from "react";
import { ApplicantCard } from "../../../../../../../components/applicant-card";
import { SitePagination } from "@/components/ui/site-pagination";
import usePaginator from "@/hooks/use-paginator";

import { Applicant } from "@/types";

export function Applicants() {
  // ✅ Extract correctly: [list, count]
  const applicantsList: Applicant[] = totalApplicants?.[0] || [];
  const applicantsCount: number = totalApplicants?.[1] || 0;

  // ✅ Pass only list to paginator
  const { applications, setCurrentPage, postPerPage, currentPage, paginate } =
    usePaginator(6, applicantsList);

  return (
    <div>
      <p className="my-2">All Applicants</p>
      <div>
        {applications?.map((applicant: Applicant, index: number) => (
          <ApplicantCard
            key={index}
            applicant={{
              ...applicant,
              name: `${applicant.student.firstName} ${applicant.student.lastName}`,
              university: applicant.student.school || "Not specified",
            }}
          />
        ))}
      </div>
      <SitePagination
        totalPosts={applicantsCount}
        postsPerPage={postPerPage}
        paginate={paginate}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
