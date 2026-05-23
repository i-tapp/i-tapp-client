"use client";

import SummaryCard from "../_molecules/summary-card";
import CorpsTable from "./_molecules/corps-table";
import { useFetchAllCorps } from "@/queries/admin";

export default function AdminCorpsPage() {
  const { data, isLoading } = useFetchAllCorps();

  const corps: any[] = data ?? [];
  const pending = corps.filter((c) => c.status === "pending").length;
  const approved = corps.filter((c) => c.status === "approved").length;

  const summaryItems = [
    { title: "Total Corps Members", number: corps.length, component: "" },
    { title: "Approved", number: approved, component: "" },
    { title: "Pending Approval", number: pending, component: "" },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold">Corps Members</h1>

      <div className="flex flex-wrap gap-6">
        {summaryItems.map((item) => (
          <SummaryCard
            key={item.title}
            title={item.title}
            number={item.number}
            component={item.component}
          />
        ))}
      </div>

      <CorpsTable data={corps} isLoading={isLoading} />
    </div>
  );
}
