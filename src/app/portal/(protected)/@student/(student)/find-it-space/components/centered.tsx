import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Search from "../_molecules/search";
import { companyListings } from "@/constants";
import AvailableCompany from "../_molecules/available-opportunity";
// import Featured from "../_molecules/featured";

export default function Centered({
  companyId,
  setCompanyId,
  onShowLeft,
  mobileView,
  setSelectedCompany,
}: {
  companyId: number | null;
  setCompanyId: (id: number | null) => void;
  onShowLeft?: () => void;
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
          {200} results found
        </p>
      </div>

      <div className="flex gap-6 flex-wrap md:max-h-[700px] md:overflow-y-scroll pr-1.5  ">
        {" "}
        {companyListings.map((company, index) => (
          <AvailableCompany
            details={company}
            key={index}
            companyId={companyId}
            setCompanyId={setCompanyId}
            setSelectedCompany={setSelectedCompany}
            // isSelected={selectedCompanyId === company.id}
          />
        ))}
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
