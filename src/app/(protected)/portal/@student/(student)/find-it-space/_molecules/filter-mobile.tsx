import { cn } from "@/utils/tailwind";
import FilterCompanies from "./filter-content";

export default function FilterMobile(props: {
  filter: any;
  setFilter: (f: any) => void;
  setFilterActive: (active: boolean) => void;
  onBack?: () => void;
  filterActive: boolean;
}) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-72 bg-white border z-50 p-2 lg:hidden",
        "transition-transform duration-200 ease-out",
        props.filterActive ? "translate-x-0" : "translate-x-full",
      )}
    >
      <FilterCompanies {...props} />
    </aside>
  );
}
