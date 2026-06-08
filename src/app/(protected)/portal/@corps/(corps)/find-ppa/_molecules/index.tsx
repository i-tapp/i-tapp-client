"use client";

import { useState } from "react";
import { useFetchCorpsPPA } from "@/queries/corps";
import { Spinner } from "@/components/spinner";
import { Wrapper } from "@/components/wrapper";
import { SitePagination } from "@/components/ui/site-pagination";
import PPACard from "./ppa-card";
import PPADetailPanel from "./ppa-detail-panel";
import { Search, SlidersHorizontal } from "lucide-react";
import { NIGERIAN_STATES } from "@/constants";

export default function FindPPA() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState({ state: "", industry: "", search: "" });
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useFetchCorpsPPA(filter, currentPage, 10);
  const listings: any[] = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="pt-14 min-h-screen">
      <Wrapper>
        {/* Search + Filter bar */}
        <div className="py-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search PPA listings..."
              value={filter.search}
              onChange={(e) => setFilter((f) => ({ ...f, search: e.target.value }))}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:border-primary/40 hover:text-primary transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mb-4 flex flex-wrap gap-3 p-4 rounded-xl bg-white border border-gray-100">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">State</label>
              <select
                value={filter.state}
                onChange={(e) => setFilter((f) => ({ ...f, state: e.target.value }))}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All States</option>
                {NIGERIAN_STATES.map((s) => (
                  <option key={s.value} value={s.label}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Industry</label>
              <input
                type="text"
                placeholder="e.g. Technology"
                value={filter.industry}
                onChange={(e) => setFilter((f) => ({ ...f, industry: e.target.value }))}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilter({ state: "", industry: "", search: "" })}
                className="px-4 py-2 rounded-lg text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-4 h-[calc(100vh-200px)]">
          {/* List */}
          <div className={`flex flex-col gap-3 overflow-y-auto flex-1 ${selectedId ? "hidden lg:flex" : "flex"}`}>
            {isLoading ? (
              <div className="flex justify-center py-12"><Spinner /></div>
            ) : listings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <p className="text-lg font-medium">No PPA listings found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              listings.map((ppa) => (
                <PPACard
                  key={ppa.id}
                  ppa={ppa}
                  selected={selectedId === ppa.id}
                  onSelect={() => setSelectedId(ppa.id)}
                />
              ))
            )}
            {pagination && (
              <SitePagination
                totalPosts={pagination.totalItems}
                postsPerPage={pagination.itemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            )}
          </div>

          {/* Detail panel */}
          {selectedId && (
            <div className="flex-1 overflow-y-auto bg-white rounded-xl border border-gray-200">
              <PPADetailPanel id={selectedId} onClose={() => setSelectedId(null)} />
            </div>
          )}
        </div>
      </Wrapper>
    </div>
  );
}
