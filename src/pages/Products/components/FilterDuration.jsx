import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Clock } from "lucide-react";

export default function FilterDuration({
  isOpen,
  toggleOpen,
  activeFilters,
  setActiveFilters,
}) {
  const durations = [
    { label: "Kurang dari 4 Jam", value: "short" },
    { label: "4 - 8 Jam", value: "medium" },
    { label: "Lebih dari 8 Jam", value: "long" },
  ];

  const handleChange = (value) => {
    setActiveFilters((prev) => ({
      ...prev,
      duration: [value],
    }));
  };

  return (
    <div className="flex flex-col gap-2 md:gap-[18px]! bg-other-primarybg rounded-[10px] border border-other-border px-3 py-3">
      <div className="flex items-center justify-between gap-2">
        <Clock className="text-primary" size={18} />
        <button
          onClick={toggleOpen}
          className="flex items-center justify-between w-full text-left font-medium text-base text-primary cursor-pointer"
        >
          <span>Durasi</span>
          <ChevronDown
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
            size={18}
          />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="duration-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden flex flex-col gap-2 px-1"
          >
            {durations.map((drt, idx) => (
              <motion.label
                key={idx}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * idx }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="duration-filter"
                  checked={activeFilters.duration.includes(drt.value)}
                  onChange={() => handleChange(drt.value)}
                  className="bg-primary-100 border border-primary text-primary focus:ring-primary-400 cursor-pointer"
                />
                <span className="font-normal text-base text-text-dark-secondary">
                  {drt.label}
                </span>
              </motion.label>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
