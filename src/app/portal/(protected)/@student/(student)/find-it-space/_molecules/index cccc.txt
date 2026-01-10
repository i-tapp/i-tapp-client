"use client";

import React, { useState } from "react";
import FilterCompanies from "./filter";
import { Wrapper } from "@/components/wrapper";
import Results from "./results";
import { filters } from "@/config/student";
import { Filter } from "iconsax-reactjs";
import AvailableCompanyDetails from "./opportunity-details";
import { cn } from "@/utils/tailwind";
import Modal from "@/components/ui/modal";
import ApplicationForm from "./form";
import { useFetchJobs } from "@/hooks/query";

export default function FindITSpace({ searchParams }) {
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [filter, setFilter] = useState(filters);
  const [filterActive, setFilterActive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mobileView, setMobileView] = useState<"centered" | "left" | "right">(
    "centered"
  );

  // ✅ fetch jobs via TanStack Query
  const { data: jobs, isLoading, error } = useFetchJobs();

  // Flatten + normalize the jobs list
  const companyList = jobs?.data?.flat() || [];
  const companyDetail = companyList.find((company) => company.id === companyId);

  if (isLoading) {
    return <p className="text-center">Loading jobs...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Failed to load jobs.</p>;
  }

  return (
    <div className="bg-[#F0F0F5] pt-[80px] w-full min-h-screen">
      <div className="flex flex-col md:flex-row justify-center md:justify-between px-4 md:px-6 gap-6 max-w-[1800px] mx-auto relative">
        {/* Mobile Filter Toggle - Only show when no company selected */}
        {companyId === null && (
          <div className="md:hidden text-center mb-4">
            <div
              className="bg-white inline-block p-1 rounded border border-black cursor-pointer"
              onClick={() => setFilterActive(true)}
            >
              <Filter className="inline mr-2" />
              <span>filter</span>
            </div>
          </div>
        )}

        {/* LEFT PANEL - Filters */}
        <FilterCompanies
          filter={filter}
          setFilter={setFilter}
          setCompanyList={() => {}}
          mobileView={mobileView}
          companyList={companyList}
          filterActive={filterActive}
          setFilterActive={setFilterActive}
        />

        <Results
          filter={filter}
          setCompanyId={setCompanyId}
          companyPost={companyList}
          searchParams={searchParams}
          filterActive={filterActive}
          selectedCompanyId={companyId}
        />

        {/* RIGHT PANEL - Company Details (slides in when selected) */}
        {companyId && (
          <div
            className={cn(
              "w-full md:w-2/5 lg:w-[40%] transition-all duration-300 animate-in slide-in-from-right"
            )}
          >
            <AvailableCompanyDetails
              details={companyDetail}
              setCompanyId={setCompanyId}
              setShowModal={setShowModal}
            />
          </div>
        )}
      </div>
    </div>
  );
}
