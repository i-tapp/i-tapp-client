"use client";

import { useFetchOpportunities } from "@/hooks/query";
import OpportunityTable from "./_molecules/opportunity-table";

export default function OpportunitiesPage() {
  const { data, isLoading, error } = useFetchOpportunities();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.log("Error fetching opportunities:", error);
    return <div>Error loading opportunities.</div>;
  }

  // console.log("Opportunities data:", data);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Opportunities</h1>
      <OpportunityTable data={data} isLoading={isLoading} />
    </div>
  );
}
