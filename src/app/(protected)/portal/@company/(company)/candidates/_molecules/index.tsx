"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ApplicantCard } from "@/components/applicant-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchAllCompanyApplications } from "@/hooks/query";
import { Applicant } from "@/types";
import { cn } from "@/utils/tailwind";

type Filter = "all" | "pending" | "accepted";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
];

function CandidatesSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3">
          <Skeleton className="w-10 h-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CandidatesPage() {
  const { data, isLoading } = useFetchAllCompanyApplications();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  // Same response shape the dashboard reads: totalApplicants is [list, count].
  const list = data?.data?.totalApplicants?.[0];
  const applicants: Applicant[] = useMemo(
    () => (Array.isArray(list) ? list.filter((a: Applicant) => a?.student) : []),
    [list],
  );

  const counts = useMemo(
    () => ({
      all: applicants.length,
      pending: applicants.filter((a) => !a.accepted).length,
      accepted: applicants.filter((a) => a.accepted).length,
    }),
    [applicants],
  );

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return applicants.filter((a) => {
      if (filter === "pending" && a.accepted) return false;
      if (filter === "accepted" && !a.accepted) return false;
      if (!q) return true;
      const s = a.student;
      return `${s.firstName ?? ""} ${s.lastName ?? ""} ${s.school ?? ""}`
        .toLowerCase()
        .includes(q);
    });
  }, [applicants, filter, search]);

  if (isLoading) return <CandidatesSkeleton />;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h5 className="text-lg font-black">Candidates</h5>
        <p className="text-grey-3 text-sm">
          Everyone who has applied to your opportunities
        </p>
      </div>

      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or school..."
          className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Status:</span>
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs transition-colors",
              filter === key
                ? "border-primary bg-primary text-white"
                : "border-border text-muted-foreground",
            )}
          >
            {label} ({counts[key]})
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          {applicants.length === 0
            ? "No candidates yet. Applicants will show up here once students apply to your opportunities."
            : "No candidates match your search."}
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-background px-3">
          {visible.map((applicant) => (
            <ApplicantCard key={applicant.id} applicant={applicant} />
          ))}
        </div>
      )}
    </div>
  );
}
