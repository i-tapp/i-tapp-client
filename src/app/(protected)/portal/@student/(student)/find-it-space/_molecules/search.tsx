"use client";

import { Input } from "@/components/ui/input";
import { MapPin, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NIGERIAN_STATES } from "@/constants";

export default function Search({
  setFilter,
}: {
  setFilter: (filter: any) => void;
}) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full max-w-2xl ">
      {/* Search Container */}
      <div className="flex flex-row items-center bg-white rounded-lg shadow-sm  w-full px-3 py-1 focus-within:ring-2 focus-within:ring-primary/30 transition-all">
        <SearchIcon className="text-gray-600 shrink-0" size={18} />

        {/* Search Input */}
        <Input
          placeholder="Search by company name or position"
          className="border-0 shadow-none focus-visible:ring-0 focus-visible:outline-none text-sm placeholder:text-gray-400 px-2 flex-1"
        />

        {/* Divider */}
        <span className="text-gray-300 mx-2">|</span>

        {/* Location Selector */}
        <button
          type="button"
          className="flex flex-row items-center gap-1.5 text-gray-700 hover:text-primary transition-colors text-sm"
        >
          <MapPin size={18} />
          <select
            onChange={(e) =>
              setFilter((prev: any) => ({ ...prev, location: e.target.value }))
            }
            className="bg-transparent focus:outline-none text-sm"
          >
            <option value="">All Locations</option>
            {NIGERIAN_STATES.map((state) => (
              <option key={state.value} value={state.value} className="text-sm">
                {state.label}
              </option>
            ))}
          </select>

          {/* <ChevronDown size={18} /> */}
        </button>
      </div>

      {/* Search Button */}
      <Button className="bg-primary text-white px-5 py-5 rounded shadow-sm hover:bg-primary/90 transition-all w-full md:w-auto">
        Search
      </Button>
    </div>
  );
}
