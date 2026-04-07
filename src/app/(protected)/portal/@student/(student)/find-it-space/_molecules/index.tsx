"use client";

import { useState } from "react";
import { filters } from "@/config/student";
import { Opportunity } from "@/types";
import { useFetchOpportunities } from "@/hooks/query";
import Results from "./results";
import { OpportunityDetailsPanel } from "./opportunity-details-panel";
import GridContainer from "./grid-container";
import { FilterToggleButton } from "./filter-toggle-button";
import { OpportunityDetailsMobile } from "./opportunity-details-mobile";
import FilterPanel from "./filter-panel";
import FilterMobile from "./filter-mobile";
import { SitePagination } from "@/components/ui/site-pagination";

export default function FindITSpace() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);
  const [filterActive, setFilterActive] = useState(false);
  const [filter, setFilter] = useState(filters);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: opportunities = [],
    isLoading,
    error,
  } = useFetchOpportunities(filter, currentPage, 10);

  if (error) return <div>Error loading opportunities.</div>;

  return (
    <div className="pt-13 min-h-0 h-full">
      <FilterToggleButton onToggle={() => setFilterActive((prev) => !prev)} />
      {/* <div className="bg-[#F0F0F5] pt-16 min-h-screen overflow-y-auto lg:h-screen lg:overflow-hidden"></div> */}
      <GridContainer selectedId={selectedId}>
        <FilterPanel
          filter={filter}
          setFilter={setFilter}
          // filterActive={filterActive}
          setFilterActive={setFilterActive}
        />
        <Results
          selectedId={selectedId}
          setSelectedId={(id) => {
            setSelectedId(id);
          }}
          isLoading={isLoading}
          opportunities={opportunities}
          setSelectedOpportunity={setSelectedOpportunity}
          setFilter={setFilter}
        />
        <OpportunityDetailsPanel
          selectedId={selectedId}
          selectedOpportunity={selectedOpportunity}
          setSelectedId={setSelectedId}
        />
      </GridContainer>
      {filterActive && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setFilterActive(false)}
          />

          <FilterMobile
            filter={filter}
            setFilter={setFilter}
            filterActive={filterActive}
            setFilterActive={setFilterActive}
          />
        </>
      )}
      <OpportunityDetailsMobile
        selectedId={selectedId}
        selectedOpportunity={selectedOpportunity}
        setSelectedId={setSelectedId}
      />

      <div className=" p-1 w-full">
        <SitePagination
          totalPosts={50}
          postsPerPage={10}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          // className="mt-0 pt-0 self-center mx-0 m-0"
        />
      </div>
    </div>
  );
}
