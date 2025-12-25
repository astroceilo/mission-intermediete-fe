import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { AsYouType } from "libphonenumber-js";

interface Country {
  name: string;
  code: string; // e.g., +62
  flag: string;
  cca2: string; // ISO code: ID, US, etc.
}

interface PhoneInputProps {
  value: string;
  onChange: (v: string) => void;
  errors?: string;
}

export default function PhoneInputCustom({
  value,
  onChange,
  errors = "",
}: PhoneInputProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [filtered, setFiltered] = useState<Country[]>([]);
  const [selected, setSelected] = useState<Country | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const [searchTerm, setSearchTerm] = useState("");

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Sync nilai dari props ke state lokal
  useLayoutEffect(() => {
    if (value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);

  // Default negara saat pertama load
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,idd,flags,cca2"
        );
        const data = await res.json();

        const mapped = data
          .filter((c: any) => c.idd?.root && c.idd?.suffixes)
          .map((c: any) => ({
            name: c.name.common,
            code: c.idd.root + c.idd.suffixes[0],
            flag: c.flags.svg,
            cca2: c.cca2,
          }))
          .sort((a: any, b: any) => a.name.localeCompare(b.name));

        setCountries(mapped);
        setFiltered(mapped);

        const preset = mapped.find((c: any) => c.cca2 === "ID");
        if (preset) {
          setSelected(preset);
          setInputValue(preset.code + " "); // auto +62
        }
      } catch (err) {
        console.error("API Error:", err);

        const fallback: Country = {
          name: "Indonesia",
          code: "+62",
          flag: "https://flagcdn.com/w320/id.png",
          cca2: "ID",
        };

        setCountries([fallback]);
        setFiltered([fallback]);
        setSelected(fallback);
      }
    };
    fetchCountries();
  }, []);

  // click outside closes dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // filter countries
  useEffect(() => {
    const newList = !searchTerm.trim()
      ? countries
      : countries.filter((c) => {
          const lower = searchTerm.toLowerCase();
          return (
            c.name.toLowerCase().includes(lower) ||
            c.code.includes(searchTerm.replace("+", ""))
          );
        });

    // Hanya update kalau berbeda—React 19 suka ini
    setFiltered((prev) =>
      JSON.stringify(prev) === JSON.stringify(newList) ? prev : newList
    );
  }, [searchTerm, countries]);

  // change input number
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, "");

    if (raw.length > 15) return;

    if (!selected) {
      setInputValue(raw);
      onChange?.(raw);
      return;
    }

    // merge selected + raw
    const fullNumber = selected.code + raw;
    // format number by countries choice
    const formatted = new AsYouType(selected.cca2 as any).input(fullNumber);

    // update: ui still raw, but onChange send formatted number
    setInputValue(formatted);
    onChange?.(formatted);
  };

  // choice countries
  const handleSelect = (country: Country) => {
    setSelected(country);
    setIsOpen(false);

    const numberWithoutPrefix = inputValue.replace(/^\+\d+/, "").trim();
    const fullNumber =
      country.code + (numberWithoutPrefix ? numberWithoutPrefix : "");
    const formatted = new AsYouType(country.cca2 as any).input(fullNumber);
    setInputValue(formatted);
    onChange?.(formatted);
  };

  // display number without prefix
  const getDisplayNumber = () => {
    // inputValue;
    // inputValue.replace(selected?.code || "", "").trim();
    return selected ? inputValue.replace(selected.code, "").trim() : inputValue;
  };

  return (
    <div ref={wrapperRef} className="relative w-full flex flex-col gap-1">
      {/* hidden input for native validation */}
      <input
        type="hidden"
        name="phone"
        value={inputValue || ""}
        required
        onInvalid={(e: React.FormEvent<HTMLInputElement>) =>
          e.currentTarget.setCustomValidity("Silakan isi nomor HP yang valid.")
        }
        onInput={(e: React.FormEvent<HTMLInputElement>) =>
          e.currentTarget.setCustomValidity("")
        }
      />

      <div className="flex items-center gap-2">
        {/* Tombol Flag + Kode Negara */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="shrink-0 inline-flex items-center text-sm md:text-base! font-normal text-center border border-gray-300 rounded-md px-3 py-2 bg-white cursor-pointer"
        >
          {selected ? (
            <>
              <img
                src={selected.flag}
                alt={selected.name}
                className="w-5 h-5 me-2 rounded-sm"
              />
              {selected.code}
            </>
          ) : (
            <span className="text-gray-500">+62</span>
          )}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center ml-2 w-5 h-5"
          >
            <ChevronDown className="w-5 h-5 text-gray-500" />
          </motion.div>
        </button>

        {/* Input nomor */}
        <input
          type="tel"
          inputMode="numeric"
          placeholder="812 3456 7890"
          value={getDisplayNumber()}
          required
          onChange={handleInputChange}
          onInvalid={(e) =>
            (e.currentTarget as HTMLInputElement).setCustomValidity("")
          }
          onInput={(e) =>
            (e.currentTarget as HTMLInputElement).setCustomValidity("")
          }
          className={`w-full text-sm md:text-base! border rounded-md px-3 py-2 focus:ring-2 focus:outline-none transition ${
            errors
              ? "border-red-500 focus:ring-red-400"
              : "border-other-border focus:ring-primary-400"
          }
          ${
            value === ""
              ? "placeholder:text-text-dark-disabled text-text-dark-disabled"
              : "text-text-dark-primary"
          }
          `}
        />
      </div>

      {/* Dropdown daftar negara */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-sm z-10 w-full overflow-hidden"
          >
            <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200">
              <div className="flex items-center gap-2 w-full bg-gray-100 px-3 py-1 rounded-md">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Cari negara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-sm border-none bg-transparent outline-none focus:ring-0"
                />
              </div>
            </div>

            <ul className="py-2 text-sm text-gray-700 max-h-60 overflow-y-auto">
              {filtered.length > 0 ? (
                filtered.map((c) => (
                  <li key={c.cca2}>
                    <button
                      ref={selected?.cca2 === c.cca2 ? activeRef : undefined}
                      type="button"
                      onClick={() => handleSelect(c)}
                      className={`inline-flex items-center w-full px-4 py-2 text-sm gap-2 hover:bg-gray-100 ${
                        selected?.cca2 === c.cca2 ? "bg-gray-100" : ""
                      }`}
                    >
                      <img
                        src={c.flag}
                        alt={c.name}
                        className="w-5 h-5 rounded-sm"
                      />
                      <span className="flex-1 text-left">{c.name}</span>
                      <span className="text-gray-500">{c.code}</span>
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-400 text-sm">
                  Tidak ditemukan
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Error message */}
      {errors && <span className="text-red-500 text-sm">{errors}</span>}
    </div>
  );
}
