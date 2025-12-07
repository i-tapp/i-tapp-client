"use client";

import OpportunityTable from "./_molecules/application-table";

export default function OpportunitiesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Opportunities</h1>
      <OpportunityTable />
    </div>
  );
}
