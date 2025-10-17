"use client";

import React from "react";
import ApplicationTable from "./application-table";
import { Wrapper } from "@/components/wrapper";
import ApplicationSearch from "./application-search";
import { SitePagination } from "@/components/ui/site-pagination";
import usePaginator from "@/hooks/use-paginator";
import { useFetchApplication } from "@/hooks/query";

export default function MyApplication({
  searchParams,
}: {
  searchParams?: { query?: string };
}) {
  const query = searchParams?.query || "";

  // Fetch applications with react-query
  const { data, isLoading, isError, error } = useFetchApplication();

  const applications = data?.data?.applications ?? [];

  const { setCurrentPage, postPerPage, currentPage, paginate } = usePaginator(
    6,
    applications
  );

  console.log("ftehced", applications);

  return (
    <div>
      <Wrapper className="sm:pb-10">
        <ApplicationSearch />

        {isLoading ? (
          <p>Loading applications...</p>
        ) : isError ? (
          <p className="text-red-500">
            Failed to load: {error?.message || "Something went wrong"}
          </p>
        ) : applications.length > 0 ? (
          <>
            <ApplicationTable query={query} applications={applications} />
            <SitePagination
              totalPosts={applications.length}
              postsPerPage={postPerPage}
              paginate={paginate}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </>
        ) : (
          <p>No Application</p>
        )}
      </Wrapper>
    </div>
  );
}
