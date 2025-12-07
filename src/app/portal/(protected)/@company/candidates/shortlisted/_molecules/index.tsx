"use client";

import usePaginator from "@/hooks/use-paginator";
import { SitePagination } from "@/components/ui/site-pagination";
import { ApplicantCard } from "@/components/applicant-card";

import { Applicant } from "@/types";

export function ShortlistedApplicants() {
  const applicants: {}[] = Array.from({ length: 10 });

  const { setCurrentPage, postPerPage, currentPage, paginate } = usePaginator(
    6,
    applicants
  );

  return (
    <div>
      <p className="mb-4">Shortlisted Applicants</p>
      {applicants?.slice(0, 5).map((applicant: Applicant, index: number) => (
        <ApplicantCard key={index} applicant={applicant} />
      ))}
      <SitePagination
        totalPosts={applicants.length}
        postsPerPage={postPerPage}
        paginate={paginate}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
