import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Notebook } from "lucide-react";

export default function FilterCategory({
  isOpen,
  toggleOpen,
  activeFilters,
  setActiveFilters,
  categories = [],
}) {
  return (
    <div className="flex flex-col gap-2 md:gap-[18px]! bg-other-primarybg rounded-[10px] border border-other-border px-3 py-3">
      <div className="flex items-center justify-between gap-2 px-1">
        <Notebook className="text-primary" size={18} />
        <button
          onClick={toggleOpen}
          className="flex items-center justify-between w-full text-left font-medium text-base text-primary cursor-pointer"
        >
          <span>Bidang Studi</span>
          <ChevronDown
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
            size={18}
          />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="category-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden flex flex-col gap-2 px-1"
          >
            {categories.map((cat) => (
              <motion.label
                key={cat.slug}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * cat.slug }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={activeFilters.category.includes(cat.slug)}
                  onChange={() => {
                    setActiveFilters((prev) => {
                      const isActive = prev.category.includes(cat.slug);
                      return {
                        ...prev,
                        category: isActive
                          ? prev.category.filter((slug) => slug !== cat.slug)
                          : [...prev.category, cat.slug],
                      };
                    });
                  }}
                  className="rounded-sm bg-primary-100 border border-primary text-primary focus:ring-primary-400 transition-colors duration-150 cursor-pointer"
                />
                <span className="font-normal text-base text-text-dark-secondary">
                  {cat.name}
                </span>
              </motion.label>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
