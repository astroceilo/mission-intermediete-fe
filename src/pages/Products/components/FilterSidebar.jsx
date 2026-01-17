import { useState } from "react";
import FilterCategory from "./FilterCategory";
import FilterPrice from "./FilterPrice";
import FilterDuration from "./FilterDuration";

export default function FilterSidebar({
  categories,
  activeFilters,
  setActiveFilters,
}) {
  const [isOpen, setIsOpen] = useState({
    category: false,
    price: false,
    duration: false,
  });

  const toggleSection = (key) =>
    setIsOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="bg-other-primarybg border border-other-border rounded-[10px] p-5 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h6 className="text-text-dark-secondary">Filter</h6>
        <button
          onClick={() =>
            setActiveFilters({ category: [], duration: [], price: [] })
          }
          className="font-medium text-base text-error-default cursor-pointer"
        >
          Reset
        </button>
      </div>

      <FilterCategory
        isOpen={isOpen.category}
        toggleOpen={() => toggleSection("category")}
        categories={categories}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
      />

      <FilterPrice
        isOpen={isOpen.price}
        toggleOpen={() => toggleSection("price")}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
      />

      <FilterDuration
        isOpen={isOpen.duration}
        toggleOpen={() => toggleSection("duration")}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
      />
    </div>
  );
}
