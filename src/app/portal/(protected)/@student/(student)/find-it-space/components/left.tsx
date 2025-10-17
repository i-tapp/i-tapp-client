import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Hr from "@/components/ui/hr";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/utils/tailwind";
import { ArrowLeft2 } from "iconsax-reactjs";

export default function Left({
  onBack,
  mobileView,
  filter,
  setFilter,
  filterActive,
  setFilterActive,
}: {
  onBack?: () => void;
  mobileView?: string;
  filter: any;
  setFilter: (filter: any) => void;
  filterActive: boolean;
  setFilterActive: (active: boolean) => void;
}) {
  const industries = [
    "Software Development",
    "Data Science",
    // "Cybersecurity",
    // "Cloud Computing",
    // "Artificial Intelligence",
  ];

  const durations = [3, 6, 12];

  const handleMonthChange = (id, checked) => {
    const duration = filter.duration.map((month) => {
      if (month.id === id) {
        return { ...month, checked: checked };
      } else {
        return month;
      }
    });

    setFilter({ ...filter, duration: duration });
  };

  const handleFieldChange = (id, checked) => {
    const field = filter.field.map((field) => {
      if (field.id === id) {
        return { ...field, checked: checked };
      } else {
        return field;
      }
    });
    setFilter({ ...filter, field: field });
  };

  return (
    <div
      className={cn(
        "md:flex rounded-lg bg-white shadow-sm transition-all",
        "w-full md:w-[280px] md:max-w-[35%] lg:w-[300px] xl:w-[310px]",
        mobileView === "left" ? "flex" : "hidden",
        "flex-1 md:flex-none"
      )}
    >
      <div className="px-4 py-3 w-full space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <ArrowLeft2
            onClick={() => setFilterActive(false)}
            className="sm:hidden"
          />
          <h1 className="font-semibold text-lg hidden sm:block">Filters</h1>

          {/* <Button variant="outline" onClick={onShowLeft}>
            // Show Left Panel //{" "}
          </Button> */}
          <Button
            variant={"ghost"}
            className="text-sm text-primary cursor-pointer hover:underline"
            onClick={() => setFilter(filter)}
          >
            Reset All
          </Button>
        </div>

        <Hr />

        {/* Sort By */}
        <section>
          <h6 className="mb-3 font-medium text-sm text-gray-700">Sort by</h6>
          <RadioGroup defaultValue="most-recent">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="most-recent" id="most-recent" />
              <Label htmlFor="most-recent">Most Recent</Label>
            </div>
          </RadioGroup>
        </section>

        <Hr />

        {/* Duration */}
        <section>
          <h6 className="mb-3 font-medium text-sm text-gray-700">Duration</h6>
          <div className="flex flex-wrap gap-3">
            {filter.duration.map((month, index) => (
              <Label
                key={index}
                htmlFor={`month-${month.id}`}
                className="flex items-center space-x-2 text-sm cursor-pointer"
              >
                <Checkbox
                  value={month.time}
                  id={month.id}
                  checked={month.checked}
                  onCheckedChange={() =>
                    handleMonthChange(month.id, !month.checked)
                  }
                  className="w-4 h-4 text-white"
                />
                <span>{month.time} months</span>
              </Label>
            ))}
          </div>
        </section>

        <Hr />

        {/* Location */}
        <section>
          <h6 className="mb-3 font-medium text-sm text-gray-700">Location</h6>
          <Input
            value={filter.location}
            onChange={(e) => setFilter({ ...filter, location: e.target.value })}
            placeholder="e.g Lagos"
            className="mb-2 shadow-none ring-0 outline-none border border-gray-200 focus:ring-neutral-50 focus:outline-none focus:border-primary/30 focus:ring-1"
          />
        </section>

        <Hr />

        {/* Industry */}
        <section>
          <h6 className="mb-3 font-medium text-sm text-gray-700">Industry</h6>
          <div className="flex flex-wrap gap-3">
            {filter.field.map((field) => (
              <Label
                key={field.id}
                htmlFor={`field-${field.id}`}
                className="flex items-center text-sm space-x-2 cursor-pointer"
              >
                <Checkbox
                  value={field.industry}
                  id={`field-${field.id}`}
                  checked={field.checked}
                  onCheckedChange={() =>
                    handleFieldChange(field.id, !field.checked)
                  }
                  className="w-4 h-4 text-white"
                />
                <span>{field.industry}</span>
              </Label>
            ))}
          </div>
        </section>

        {/* Back button (mobile only) */}
        {onBack && (
          <div className="pt-4 md:hidden">
            <Button
              variant="outline"
              onClick={onBack}
              className="w-full shadow-none border border-gray-300"
            >
              Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export const handleFilter = (companyData, filter) => {
  let filteredCompanies = companyData;
  // -------------handling filter when a month duration is chosen-------------

  // to get the months that have been checked by the user
  const filteredDuration = filter.duration
    .filter((month) => month.checked === true)
    .map((month) => month.time);

  if (filteredDuration.length) {
    // to return an array of months with the range of months checked by the user
    const monthCount = filteredDuration
      .map((duration) => {
        if (duration === "0-3") return [0, 1, 2, 3];
        else if (duration === "3-6") return [3, 4, 5, 6];
        else if (duration === "6-12") return [6, 7, 8, 9, 10, 11, 12];
      })
      .flat();

    // filter companies that have months selected by the user
    filteredCompanies = filteredCompanies.filter((company) =>
      monthCount.includes(company.duration)
    );
  }

  // ---------filter by location------------//
  if (filter.location) {
    filteredCompanies = filteredCompanies.filter((company) =>
      company.state.toLowerCase().includes(filter.location.toLowerCase())
    );
  }

  // ------filter by field-------------
  // to get the fields that have been checked by the user

  const filteredField = filter.field
    .filter((field) => field.checked === true)
    .map((field) => field.industry);

  if (filteredField.length) {
    filteredCompanies = filteredCompanies.filter((company) =>
      filteredField.includes(company.industry.trim())
    );
  }

  return filteredCompanies;
};
