// opportunity-details-panel.tsx
"use client";

import { cn } from "@/utils/tailwind";
import { Opportunity } from "@/types";
import OpportunityDetailsContent from "./opportunity-details-content";

export function OpportunityDetailsPanel(props: {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  selectedOpportunity: Opportunity | null;
}) {
  const visible = Boolean(props.selectedId);
  return (
    <aside
      className={cn(
        "hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 self-start overflow-scroll h-fit",
        "transition-[opacity,transform] duration-200 ease-out",
        visible
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-2 pointer-events-none",
      )}
    >
      <OpportunityDetailsContent {...props} />
    </aside>
  );
}
