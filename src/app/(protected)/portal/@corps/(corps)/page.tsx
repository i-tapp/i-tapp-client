"use client";

import { useFetchMyProfile } from "@/hooks/query";

export default function CorpsDashboardPage() {
  const { data, isLoading } = useFetchMyProfile();

  if (isLoading) return <div className="p-8 text-gray-400">Loading...</div>;

  const corps = data?.corps;
  const name = corps ? `${corps.firstName ?? ""} ${corps.lastName ?? ""}`.trim() : "Corps Member";

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {name} 👋</h1>
        <p className="text-sm text-gray-500 mt-1">Your PPA dashboard — opportunities matching your deployment state and skills will appear here.</p>
      </div>

      {corps?.stateOfDeployment && (
        <div className="rounded-xl border bg-white p-5 shadow-sm space-y-1">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Deployment Details</p>
          <p className="font-semibold">{corps.stateOfDeployment}{corps.stream ? ` · Stream ${corps.stream}` : ""}</p>
          {corps.nyscRegNumber && <p className="text-sm text-gray-500">Reg: {corps.nyscRegNumber}</p>}
          {corps.batchYear && <p className="text-sm text-gray-500">Batch {corps.batchYear}</p>}
        </div>
      )}

      <div className="rounded-xl border bg-amber-50 border-amber-200 p-5 text-sm text-amber-800">
        Your profile is pending admin approval. Once approved, you'll be matched with PPA opportunities in your deployment state.
      </div>
    </div>
  );
}
