import { cn } from "@/utils/tailwind";
import Search from "./search";
import { Opportunity } from "@/types";
import AvailableOpportunity from "./available-opportunity";
import { Inbox } from "lucide-react";
import { Spinner } from "@/components/spinner";

export default function Results({
  selectedId,
  setSelectedId,
  opportunities,
  setSelectedOpportunity,
  setFilter,
  isLoading,
}: {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  setSelectedOpportunity: (name: Opportunity | null) => void;
  opportunities: Opportunity[];
  setFilter: (filter: any) => void;
  isLoading: boolean;
}) {
  const isDetailsOpen = !!selectedId;
  // console.log("Opportunities in Results:", opportunities);
  return (
    <main className="p-2 min-w-0 flex flex-col h-screen overflow-y-scroll pb-30">
      <div className="hidden md:block">
        <Search setFilter={setFilter} />
      </div>

      <div className="text-center md:flex justify-between my-2 shrink-0">
        <h6 className="hidden md:block text-md sm:text-md lg:text-h6 font-bold">
          Search Results
        </h6>
        <p className="text-primary md:text-[#8C8CB0] text-sm self-center">
          {opportunities.length ? opportunities.length : 0} results found
          {/* showing result for lagos  */}
        </p>
      </div>

      <div className="flex-1 pr-1 ">
        <div
          className={cn(
            "grid gap-3",
            "grid-cols-1",
            "sm:grid-cols-2", // tablets / large phones
            isDetailsOpen ? "lg:grid-cols-2" : "lg:grid-cols-3", // ✅ key change
            "2xl:grid-cols-3",
          )}
        >
          {opportunities.length ? (
            opportunities.map((item, index) => (
              <AvailableOpportunity
                details={item}
                key={index}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                setSelectedOpportunity={setSelectedOpportunity}
                // isSelected={selectedCompanyId === company.id}
              />
            ))
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center col-span-full mt-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary mb-4" />
              <p className="text-gray-600 text-center text-sm">
                Fetching opportunities... Hang tight!
              </p>
            </div>
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 space-y-3">
              <Inbox className="w-12 h-12" />
              <span className="text-lg font-medium">
                No opportunities found.
              </span>
              <span className="text-sm text-gray-500">
                Try adjusting your filters or check back later.
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 pt-2">pagination</div>
    </main>
  );
}

//  <Button onClick={() => setCompanyId(1)}>Select Company</Button>

//         {/* Mobile-only: show Left panel */}
//         <div className="mt-4 md:hidden">
//           <Button variant="outline" onClick={onShowLeft}>
//             Show Left Panel
//           </Button>
