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
    // <aside
    //   className={cn(
    //     "fixed left-0 top-0  bg-white border-r border-gray-200 z-50 lg:hidden ",
    //     "transition-all duration-300 ease-in-out",
    //     props.filterActive ? " w-72" : "w-0",
    //   )}
    // >
    //   <div className="h-screen overflow-y-scroll pb-16">
    //     <FilterCompanies {...props} />
    //   </div>
    // </aside>

    <aside
      className={cn(
        "fixed left-0 top-0 bg-white border-r border-gray-200 z-50 lg:hidden",
        "transition-all duration-300 ease-in-out overflow-hidden", // ✅ important
        props.filterActive
          ? "w-72 opacity-100"
          : "w-0 opacity-0 pointer-events-none",
      )}
    >
      <div className="h-screen overflow-y-auto pb-16 w-72">
        <FilterCompanies {...props} />
      </div>
    </aside>
  );
}
