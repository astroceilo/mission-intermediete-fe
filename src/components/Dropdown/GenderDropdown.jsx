import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";


export default function GenderDropdown({
  value,
  onChange,
  errors = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Pilih jenis kelamin
  const handleSelect = (v) => {
    onChange(v);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Input hidden agar ikut ke form submission */}
      <input
        type="hidden"
        name="gender"
        value={value}
        required
        onInvalid={(e) =>
          e.currentTarget.setCustomValidity(
            "Silakan pilih jenis kelamin terlebih dahulu."
          )
        }
        onInput={(e) =>
          e.currentTarget.setCustomValidity("")
        }
      />

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between text-sm md:text-base! ${
          value ? "text-text-dark-primary" : "text-text-dark-secondary"
        } border border-other-border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-400 focus:outline-none focus:border-transparent transition cursor-pointer`}
      >
        {value || "Pilih Jenis Kelamin"}
        <ChevronDown
          className={`w-5 h-5 ml-2 text-text-dark-disabled transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="absolute left-0 right-0 mt-2 bg-white border border-other-border rounded-md shadow-md z-10"
          >
            <ul className="py-2 text-sm text-text-dark-primary">
              <li>
                <button
                  type="button"
                  onClick={() => handleSelect("Pria")}
                  className="block w-full text-left text-sm md:text-base! font-normal px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Pria
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleSelect("Wanita")}
                  className="block w-full text-left text-sm md:text-base! font-normal px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Wanita
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Error Message */}
      {errors && <span className="text-red-500 text-sm">{errors}</span>}
    </div>
  );
}
