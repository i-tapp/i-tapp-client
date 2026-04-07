import FilterCompanies from "./filter-content";

export default function FilterPanel(props: {
  filter: any;
  setFilter: (f: any) => void;
  setFilterActive: (active: boolean) => void;
  onBack?: () => void;
}) {
  return (
    <aside className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 ">
      <div className="overflow-y-auto h-full min-h-0 pb-12">
        <FilterCompanies {...props} />
      </div>
    </aside>
  );
}
