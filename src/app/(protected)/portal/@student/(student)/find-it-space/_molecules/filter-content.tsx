"use client";

import Input from "@/components/input";
import { Button } from "@/components/ui/button";
import Hr from "@/components/ui/hr";
import { cn } from "@/utils/tailwind";
import { ArrowLeft2 } from "iconsax-reactjs";
import React from "react";

/**
 * FULL FILTER UI (Pills instead of Checkbox/Radio)
 * - Status: single-select (Open OR Closed) + allows "unset" by tapping active pill again
 * - Duration: single-select (3/6/12) + allows unset
 * - Industry: multi-select (toggle)
 * - Sort: single-select stored as string
 * - Location: text
 *
 * Expected filter shape:
 * {
 *   sortBy: "most recent" | "oldest"
 *   status:   Array<{ id: number; status: string; checked: boolean }>
 *   duration: Array<{ id: number; time: string; checked: boolean }>
 *   industry: Array<{ id: number; industry: string; checked: boolean }>
 *   location: string
 * }
 */

type CheckedItem = { id: number; checked: boolean; [key: string]: any };

type FilterState = {
  sortBy?: "most recent" | "oldest";
  status: CheckedItem[];
  duration: CheckedItem[];
  industry: CheckedItem[];
  location: string;
};

export default function FilterCompanies({
  filter,
  setFilter,
  setFilterActive,
  onBack,
}: {
  filter: FilterState;
  setFilter: (f: FilterState) => void;
  setFilterActive: (active: boolean) => void;
  onBack?: () => void;
}) {
  // Multi-select toggle (like checkbox)
  const toggleMulti = (key: keyof FilterState, id: number) => {
    const list = filter[key] as CheckedItem[];
    setFilter({
      ...filter,
      [key]: list.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    });
  };

  /**
   * Single-select (like radio) but with "unset" behavior:
   * - tap a different pill => selects it, clears others
   * - tap the active pill => clears all (unset)
   */
  const setSingle = (key: keyof FilterState, id: number) => {
    const list = filter[key] as CheckedItem[];
    const clicked = list.find((x) => x.id === id);
    const willUnset = Boolean(clicked?.checked);

    setFilter({
      ...filter,
      [key]: list.map((item) => ({
        ...item,
        checked: willUnset ? false : item.id === id,
      })),
    });
  };

  const resetAll = () => {
    setFilter({
      ...filter,
      sortBy: "most recent",
      duration: filter.duration.map((d) => ({ ...d, checked: false })),
      industry: filter.industry.map((i) => ({ ...i, checked: false })),
      status: filter.status.map((s) => ({ ...s, checked: false })),
      location: "",
    });
  };

  return (
    <div className="w-full space-y-4 px-4 py-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <ArrowLeft2
          onClick={() => setFilterActive(false)}
          className="sm:hidden cursor-pointer"
        />
        <h1 className="hidden sm:block text-lg font-semibold">Filters</h1>

        <Button
          type="button"
          variant="ghost"
          className="cursor-pointer text-sm text-primary hover:underline"
          onClick={resetAll}
        >
          Reset All
        </Button>
      </div>

      {/* Sort */}
      <section>
        <SectionTitle title="Sort By" />
        <div className="flex flex-wrap gap-2">
          {(["most recent", "oldest"] as const).map((s) => (
            <Pill
              key={s}
              active={(filter.sortBy ?? "most recent") === s}
              onClick={() => setFilter({ ...filter, sortBy: s })}
            >
              {s}
            </Pill>
          ))}
        </div>
      </section>

      {/* Status */}
      <section>
        <SectionTitle title="Status" />
        <div className="flex flex-wrap gap-2">
          {filter.status.map((s: any) => (
            <Pill
              key={s.id}
              active={Boolean(s.checked)}
              onClick={() => setSingle("status", s.id)}
            >
              {s.status}
            </Pill>
          ))}
        </div>
      </section>

      <Hr />

      {/* Duration */}
      <section>
        <SectionTitle title="Duration" />
        <div className="flex flex-wrap gap-2">
          {filter.duration.map((d: any) => (
            <Pill
              key={d.id}
              active={Boolean(d.checked)}
              onClick={() => setSingle("duration", d.id)}
            >
              {d.time} months
            </Pill>
          ))}
        </div>
      </section>

      <Hr />

      {/* Location */}
      <section>
        <SectionTitle title="Location" />
        <Input
          value={filter.location}
          onChange={(e) => setFilter({ ...filter, location: e.target.value })}
          placeholder="e.g Lagos"
        />
      </section>

      <Hr />

      {/* Industry */}
      <section>
        <SectionTitle title="Industry" />
        <div className="flex flex-wrap gap-2">
          {filter.industry.map((i: any) => (
            <Pill
              key={i.id}
              active={Boolean(i.checked)}
              onClick={() => toggleMulti("industry", i.id)}
            >
              {i.industry}
            </Pill>
          ))}
        </div>
      </section>

      {onBack && (
        <div className="pt-4 md:hidden">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="w-full border border-gray-300"
          >
            Back
          </Button>
        </div>
      )}
    </div>
  );
}

const SectionTitle = ({ title }: { title: string }) => {
  return (
    <h6 className="mb-3 text-sm font-semibold uppercase text-gray-400">
      {title}
    </h6>
  );
};

const Pill = ({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex select-none items-center rounded-full border px-4 py-1.5 text-sm capitalize transition",
        "hover:bg-gray-100",
        active
          ? "border-primary bg-primary text-white hover:bg-primary/90"
          : "border-gray-300 bg-white text-gray-700",
      )}
    >
      {children}
    </button>
  );
};
