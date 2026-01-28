import { Filter } from "iconsax-reactjs";

type FilterToggleButtonProps = {
  onToggle: () => void;
};

export function FilterToggleButton({ onToggle }: FilterToggleButtonProps) {
  return (
    <div className="md:hidden w-full flex justify-center my-4">
      <button
        onClick={onToggle}
        className="bg-white inline-flex items-center p-1.5 px-3 rounded border border-gray-300 cursor-pointer"
      >
        <Filter className="mr-2 w-4 h-4" />
        <span className="text-sm font-medium">Filters</span>
      </button>
    </div>
  );
}
