"use client";

import React, { useState } from "react";
import { filters } from "@/config/student";
import { Filter } from "lucide-react";
import FilterCompanies from "./filter";
import Results from "./results";
import AvailableCompanyDetails from "./opportunity-details";
import { useFetchOpportunities } from "@/hooks/query";
import OpportunityDetails from "./opportunity-details";
import { Opportunity } from "@/types";
import Modal from "@/components/modal";
// import Modal from "@/components/ui/modal";
// import { useFetchJobs } from "@/hooks/query";

export default function FindITSpace() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);
  const [mobileView, setMobileView] = useState<"centered" | "left" | "right">(
    "centered"
  );
  const [filter, setFilter] = useState(filters);
  const [filterActive, setFilterActive] = useState(false);

  const {
    data: opportunities,
    isLoading,
    error,
  } = useFetchOpportunities(filter);

  console.log("opportunities", opportunities);

  if (error) {
    return <div>Error loading opportunities.</div>;
  }

  return (
    <div className="bg-[#F0F0F5] pt-20 w-full min-h-screen">
      <div className="md:hidden w-full flex justify-center mb-4">
        <div
          className="bg-white inline-flex items-center p-1.5 px-3 rounded border border-gray-300 cursor-pointer"
          onClick={() =>
            setMobileView((prev) => (prev === "left" ? "centered" : "left"))
          }
        >
          <Filter className="inline mr-2 w-4 h-4" />
          <span className="text-sm font-medium">Filters</span>
        </div>
      </div>

      <div className="flex items-start flex-col md:flex-row justify-center md:justify-between px-4 md:px-6 gap-6 max-w-[1800px] mx-auto relative">
        {/* LEFT */}
        <FilterCompanies
          filter={filter}
          setFilter={setFilter}
          mobileView={mobileView}
          onBack={() => setMobileView("centered")}
          // filterActive={filterActive}
          setFilterActive={setFilterActive}
        />
        {/* CENTERED */}
        <Results
          selectedId={selectedId}
          mobileView={mobileView}
          setSelectedId={(id) => {
            setSelectedId(id);
            if (id) setMobileView("right");
          }}
          opportunities={opportunities || []}
          setSelectedOpportunity={setSelectedOpportunity}
          onShowLeft={() => setMobileView("left")}
        />
        {/* RIGHT OpportunityDetails */}
        <OpportunityDetails
          selectedId={selectedId}
          mobileView={mobileView}
          // setSelectedOpportunity={setSelectedOpportunity}
          selectedOpportunity={selectedOpportunity}
          setSelectedId={(id) => {
            setSelectedId(id);
            if (!id) setMobileView("centered");
          }}
        />
      </div>
    </div>
  );
}
