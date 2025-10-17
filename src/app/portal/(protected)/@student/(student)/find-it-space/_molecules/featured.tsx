import { Button } from "@/components/ui/button";
import { companyListings } from "@/constants";
import FeaturedItem from "./featured-item";

export default function Featured({ setSelectedCompany, setCompanyId }) {
  return (
    <div className="flex flex-col w-full md:w-[550px]">
      <div className="flex justify-between items-center my-3 px-2 md:px-0">
        <h6 className="text-md lg:text-h6 font-bold">Featured Opportunities</h6>

        <Button
          variant="outline"
          size="sm"
          className="mt-0 shadow-sm rounded-2xl text-primary border-primary"
        >
          Filter
        </Button>
      </div>

      {/* Horizontal Scroll Section */}
      <div className="flex gap-3 overflow-x-auto px-2 pb-2 hide-scrollbar">
        {companyListings.map((company, index) => (
          <FeaturedItem
            key={index}
            details={company}
            companyId={index + 1}
            setCompanyId={setCompanyId}
            setSelectedCompany={setSelectedCompany}
          />
        ))}
      </div>
    </div>
  );
}
