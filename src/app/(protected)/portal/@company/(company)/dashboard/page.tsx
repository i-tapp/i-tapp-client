import React from "react";
import { Dashboard } from "./_molecules";
import { PendingListingClaim } from "@/components/pending-listing-claim";

export default function DashboardPage() {
  return (
    <>
      <PendingListingClaim />
      <Dashboard />
    </>
  );
}
