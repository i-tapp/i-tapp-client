import Input from "@/components/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Hr from "@/components/ui/hr";
// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/utils/tailwind";
import { ArrowLeft2 } from "iconsax-reactjs";

export default function FilterCompanies({
  filter,
  setFilter,
  mobileView,
  setFilterActive,
  onBack,
}: {
  filter: any;
  setFilter: (f: any) => void;
  mobileView?: "left" | "centered" | "right";
  setFilterActive: (active: boolean) => void;
  onBack?: () => void;
}) {
  // Generic checkbox handler works for any key
  const handleCheck = (key: string, id: number) => {
    setFilter({
      ...filter,
      [key]: filter[key].map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      ),
    });
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
          <Button
            variant="ghost"
            className="text-sm text-primary cursor-pointer hover:underline"
            onClick={() =>
              setFilter({
                ...filter,
                duration: filter.duration.map((d: any) => ({
                  ...d,
                  checked: false,
                })),
                industry: filter.industry.map((i: any) => ({
                  ...i,
                  checked: false,
                })),
                status: filter.status.map((s: any) => ({
                  ...s,
                  checked: false,
                })),
                location: "",
              })
            }
          >
            Reset All
          </Button>
        </div>

        {/* <Hr /> */}

        {/* Sort */}
        <section>
          <h6 className="mb-3 font-medium text-sm text-gray-700">Sort by</h6>
          <RadioGroup
            value={filter.sort}
            onValueChange={(value) => setFilter({ ...filter, sort: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="most-recent" id="most-recent" />
              <Label htmlFor="most-recent">Most Recent</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="oldest" id="oldest" />
              <Label htmlFor="oldest">Oldest</Label>
            </div>
          </RadioGroup>
        </section>

        {/* <Hr /> */}

        {/* Status */}
        <section>
          <h6 className="mb-3 font-medium text-sm text-gray-700">Status</h6>
          <div className="flex flex-wrap gap-3">
            {filter.status.map((s: any) => (
              <Label
                key={s.id}
                htmlFor={`status-${s.id}`}
                className="flex items-center text-sm space-x-2 cursor-pointer"
              >
                <Checkbox
                  id={`status-${s.id}`}
                  checked={s.checked}
                  onCheckedChange={() => handleCheck("status", s.id)}
                  className="w-4 h-4 text-white"
                />
                <span>{s.status}</span>
              </Label>
            ))}
          </div>
        </section>

        <Hr />

        {/* Duration */}
        <section>
          <h6 className="mb-3 font-medium text-sm text-gray-700">Duration</h6>
          <div className="flex flex-wrap gap-3">
            {filter.duration.map((d: any) => (
              <Label
                key={d.id}
                htmlFor={`duration-${d.id}`}
                className="flex items-center text-sm space-x-2 cursor-pointer"
              >
                <Checkbox
                  id={`duration-${d.id}`}
                  checked={d.checked}
                  onCheckedChange={() => handleCheck("duration", d.id)}
                  className="w-4 h-4 text-white"
                />
                <span>{d.time} months</span>
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
            // className="mb-2 shadow-none ring-0 outline-none border border-gray-200 focus:ring-neutral-50 focus:outline-none focus:border-primary/30 focus:ring-1"
          />
        </section>

        <Hr />

        {/* Industry */}
        <section>
          <h6 className="mb-3 font-medium text-sm text-gray-700">Industry</h6>
          <div className="flex flex-wrap gap-3">
            {filter.industry.map((i) => (
              <Label
                key={i.id}
                htmlFor={`industry-${i.id}`}
                className="flex items-center text-sm space-x-2 cursor-pointer"
              >
                <Checkbox
                  id={`industry-${i.id}`}
                  checked={i.checked}
                  onCheckedChange={() => handleCheck("industry", i.id)}
                  className="w-4 h-4 text-white"
                />
                <span>{i.industry}</span>
              </Label>
            ))}
          </div>
        </section>

        {onBack && (
          <div className="pt-4 md:hidden">
            <Button
              variant="outline"
              onClick={onBack}
              className="w-full border border-gray-300"
            >
              Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
