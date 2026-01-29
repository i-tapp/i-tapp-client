import FilterCompanies from "./filter-content";

export default function FilterPanel(props: {
  filter: any;
  setFilter: (f: any) => void;
  setFilterActive: (active: boolean) => void;
  onBack?: () => void;
}) {
  return (
    <aside className="hidden lg:block bg-white p-2 rounded-lg shadow-sm border border-gray-200">
      <FilterCompanies {...props} />
    </aside>
  );
}
