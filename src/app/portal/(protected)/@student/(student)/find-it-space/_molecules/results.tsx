import { Button } from "@/components/ui/button";
import { cn } from "@/utils/tailwind";
import Search from "../_molecules/search";
import { companyListings } from "@/constants";
import AvailableCompany from "./available-opportunity";
import { Opportunity } from "@/types";
import AvailableOpportunity from "./available-opportunity";
import { Inbox } from "lucide-react";
// import Featured from "../_molecules/featured";

export default function Results({
  selectedId,
  setSelectedId,
  onShowLeft,
  opportunities,
  mobileView,
  setSelectedOpportunity,
}: {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  onShowLeft?: () => void;
  mobileView: "centered" | "left" | "right";
  setSelectedOpportunity: (name: Opportunity | null) => void;
  opportunities: Opportunity[];
}) {
  return (
    <div
      className={cn(
        "md:flex flex-col flex-1  transition-all",
        mobileView === "centered" ? "flex" : "hidden"
      )}
    >
      <div className="hidden md:block">
        <Search />
      </div>

      {/* Featured */}
      {/* <Featured
        setCompanyId={setCompanyId}
        setSelectedCompany={setSelectedCompany}
      /> */}

      <div className="text-center md:flex justify-between my-2">
        <h6 className="hidden md:block text-md sm:text-md lg:text-h6 font-bold">
          Search Results
        </h6>
        <p className="text-primary md:text-[#8C8CB0] text-sm lg:text-base self-center">
          {opportunities.length ? opportunities.length : 0} results found
        </p>
      </div>

      <div className="flex gap-6 flex-wrap md:max-h-[700px] md:overflow-y-scroll pr-1.5  ">
        {" "}
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
        ) : (
          <div className="flex flex-col items-center justify-center w-full py-20 text-gray-400 space-y-3">
            <Inbox className="w-12 h-12" />
            <span className="text-lg font-medium">No opportunities found.</span>
            <span className="text-sm text-gray-500">
              Try adjusting your filters or check back later.
            </span>
          </div>
        )}
      </div>

      <div> pagination</div>
    </div>
  );
}

//  <Button onClick={() => setCompanyId(1)}>Select Company</Button>

//         {/* Mobile-only: show Left panel */}
//         <div className="mt-4 md:hidden">
//           <Button variant="outline" onClick={onShowLeft}>
//             Show Left Panel
//           </Button>
