import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";

import useClickOutsideMulti from "../../hooks/useClickOutsideMulti";

export default function SortDropdown({ sortOption, setSortOption }) {
  const [isOpen, setIsOpen] = useState(false);
  const isRef = useRef(null);

  const toggleOpen = () => setIsOpen(!isOpen);

  useClickOutsideMulti([isRef], () => setIsOpen(false));

  const options = [
    { value: "low", label: "Harga Rendah" },
    { value: "high", label: "Harga Tinggi" },
    { value: "az", label: "A to Z" },
    { value: "za", label: "Z to A" },
    { value: "rating-high", label: "Rating Tertinggi" },
    { value: "rating-low", label: "Rating Terendah" },
  ];

  return (
    <div
      ref={isRef}
      className="relative inline-block text-left w-full md:w-auto"
    >
      {/* Tombol utama */}
      <button
        onClick={toggleOpen}
        className="flex items-center justify-between gap-2 w-full border border-other-border bg-white text-text-dark-secondary rounded-[10px] p-3 text-base font-medium hover:bg-other-secondarybg cursor-pointer"
      >
        {options.find((opt) => opt.value === sortOption)?.label || "Urutkan"}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="sort-content"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute right-0 mt-2 w-44 bg-white rounded-[10px] shadow-md border border-other-border z-10"
          >
            {/* <div className="absolute right-0 mt-2 w-44 bg-white rounded-[10px] shadow-md border border-other-border z-10 animate-fadeIn"> */}
            <ul className="py-2 text-sm text-text-dark-secondary">
              {options.map((opt) => (
                <li key={opt.value}>
                  <button
                    onClick={() => {
                      setSortOption(opt.value);
                      setIsOpen(false);
                    }}
                    className={`block w-full text-left px-2.5 py-3 hover:bg-other-secondarybg font-medium text-sm cursor-pointer ${
                      sortOption === opt.value
                        ? "text-text-dark-primary"
                        : "text-text-dark-secondary"
                    }`}
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
            {/* </div> */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
