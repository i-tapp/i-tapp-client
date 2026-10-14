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

// Same value written two ways ("University of Lagos" / "university of  lagos")
// should count as one choice, so compare on a normalised key.
const norm = (v?: string | null) =>
  (v ?? "").trim().replace(/\s+/g, " ").toLowerCase();

const courseOf = (a: Applicant) => a.student?.courseOfStudy;
const schoolOf = (a: Applicant) => a.student?.school || a.university;
const locationOf = (a: Applicant) => a.student?.preferredLocation;

/** Distinct values found in the applicants, as sorted dropdown options. */
function optionsFor(
  applicants: Applicant[],
  pick: (a: Applicant) => string | null | undefined,
) {
  const seen = new Map<string, string>();
  for (const a of applicants) {
    const raw = pick(a);
    const key = norm(raw);
    if (key && !seen.has(key)) seen.set(key, raw!.trim().replace(/\s+/g, " "));
  }
  return [...seen.entries()]
    .map(([value, label]) => ({ value, label }))
    .sort((x, y) => x.label.localeCompare(y.label));
}

function FilterSelect({
  label,
  allLabel,
  value,
  onChange,
  options,
}: {
  label: string;
  allLabel: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1 text-xs text-muted-foreground">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={options.length === 0}
        className="h-10 w-full min-w-0 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary disabled:opacity-50"
      >
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

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
  const [course, setCourse] = useState("");
  const [school, setSchool] = useState("");
  const [location, setLocation] = useState("");

  // Same response shape the dashboard reads: totalApplicants is [list, count].
  const list = data?.data?.totalApplicants?.[0];
  const applicants: Applicant[] = useMemo(
    () => (Array.isArray(list) ? list.filter((a: Applicant) => a?.student) : []),
    [list],
  );

  const courseOptions = useMemo(() => optionsFor(applicants, courseOf), [applicants]);
  const schoolOptions = useMemo(() => optionsFor(applicants, schoolOf), [applicants]);
  const locationOptions = useMemo(() => optionsFor(applicants, locationOf), [applicants]);

  // Everything except the Pending/Accepted buttons, so those buttons show
  // counts that match the other filters.
  const scoped = useMemo(() => {
    const q = search.trim().toLowerCase();
    return applicants.filter((a) => {
      if (course && norm(courseOf(a)) !== course) return false;
      if (school && norm(schoolOf(a)) !== school) return false;
      if (location && norm(locationOf(a)) !== location) return false;
      if (!q) return true;
      const s = a.student;
      return `${s.firstName ?? ""} ${s.lastName ?? ""} ${schoolOf(a) ?? ""} ${courseOf(a) ?? ""}`
        .toLowerCase()
        .includes(q);
    });
  }, [applicants, search, course, school, location]);

  const counts = useMemo(
    () => ({
      all: scoped.length,
      pending: scoped.filter((a) => !a.accepted).length,
      accepted: scoped.filter((a) => a.accepted).length,
    }),
    [scoped],
  );

  const visible = useMemo(
    () =>
      scoped.filter((a) =>
        filter === "pending" ? !a.accepted : filter === "accepted" ? a.accepted : true,
      ),
    [scoped, filter],
  );

  const hasFilters = Boolean(course || school || location || search.trim());
  const clearFilters = () => {
    setCourse("");
    setSchool("");
    setLocation("");
    setSearch("");
  };

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
          placeholder="Search by name, course or institution..."
          className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <FilterSelect
          label="Course of study"
          allLabel="All courses"
          value={course}
          onChange={setCourse}
          options={courseOptions}
        />
        <FilterSelect
          label="Institution"
          allLabel="All institutions"
          value={school}
          onChange={setSchool}
          options={schoolOptions}
        />
        <FilterSelect
          label="Location"
          allLabel="All locations"
          value={location}
          onChange={setLocation}
          options={locationOptions}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
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
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="ml-auto text-xs text-primary underline underline-offset-2"
          >
            Clear filters
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          {applicants.length === 0
            ? "No candidates yet. Applicants will show up here once students apply to your opportunities."
            : "No candidates match these filters."}
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
