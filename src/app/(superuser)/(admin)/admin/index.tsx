"use client";

import SummaryCard from "./_molecules/summary-card";
import Activity from "./_molecules/activity";
import RecentOpportunities from "./_molecules/recent-opportunities";
import TopCompanies from "./_molecules/top-companies";
import { useFetchAdminStats, useFetchPendingApprovals } from "@/queries/admin";
import Link from "next/link";
import { AlertTriangle, Users, BadgeCheck, Building2, Briefcase, ClipboardList } from "lucide-react";

export default function Admin() {
  const { data: stats, isLoading } = useFetchAdminStats();
  const { data: pending } = useFetchPendingApprovals();

  const pendingCount =
    (pending?.students?.length ?? 0) + (pending?.corps?.length ?? 0);

  const summaryItems = [
    {
      title: "Total Students",
      number: stats?.students?.total ?? 0,
      component: stats?.students?.newThisWeek ? `+${stats.students.newThisWeek} this week` : "",
      data: stats?.students?.trend,
      icon: <Users className="w-5 h-5 text-primary" />,
    },
    {
      title: "Corps Members",
      number: stats?.corps?.total ?? 0,
      component: stats?.corps?.newThisWeek ? `+${stats.corps.newThisWeek} this week` : "",
      data: stats?.corps?.trend,
      icon: <BadgeCheck className="w-5 h-5 text-violet-600" />,
    },
    {
      title: "Companies",
      number: stats?.companies?.total ?? 0,
      component: stats?.companies?.newThisWeek ? `+${stats.companies.newThisWeek} this week` : "",
      data: stats?.companies?.trend,
      icon: <Building2 className="w-5 h-5 text-emerald-600" />,
    },
    {
      title: "Open Opportunities",
      number: stats?.opportunities?.open ?? 0,
      component: `${stats?.opportunities?.flagged ?? 0} flagged`,
      data: stats?.opportunities?.trend,
      icon: <Briefcase className="w-5 h-5 text-amber-600" />,
    },
    {
      title: "Total Applications",
      number: stats?.applications?.total ?? 0,
      component: stats?.applications?.newThisWeek ? `+${stats.applications.newThisWeek} this week` : "",
      data: stats?.applications?.trend,
      icon: <ClipboardList className="w-5 h-5 text-sky-600" />,
    },
  ];

  return (
    <div className="flex flex-col gap-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        {pendingCount > 0 && (
          <Link
            href="/admin/pending"
            className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-amber-100 transition"
          >
            <AlertTriangle className="w-4 h-4" />
            {pendingCount} pending approval{pendingCount !== 1 ? "s" : ""}
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-1 min-w-[220px] h-[140px] bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {summaryItems.map((item) => (
            <SummaryCard
              key={item.title}
              title={item.title}
              number={item.number}
              component={item.component}
              data={item.data}
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Activity />
        <RecentOpportunities />
        <TopCompanies />
      </div>
    </div>
  );
}
