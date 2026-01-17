import { motion, AnimatePresence } from "framer-motion";
import { LoaderCircle, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { normalizeProductForView } from "../../utils/normalizeProduct/normalizeProductForView";
import SortDropdown from "../../components/Dropdown/SortDropdown";
import FilterSidebar from "./components/FilterSidebar";
import Pagination from "../../components/Pagination";
import CardCourse from "../../components/CardCourse";
import { getFinalPrice } from "../../utils/price";
import { api } from "../../services/api";

export default function Products() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    category: [],
    duration: [],
    price: [],
  });

  const [sortOption, setSortOption] = useState("");
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [productsRes, usersRes] = await Promise.all([
          api.get("/products"),
          api.get("/users"),
        ]);

        const products = productsRes.data;
        const users = usersRes.data;

        // mapping instructor
        const mergedData = products.map((p) =>
          normalizeProductForView(p, users)
        );

        setCourses(mergedData);

        // kategori bisa hardcode dulu (MockAPI limit)
        setCategories([
          { id: 1, name: "Programming", slug: "programming" },
          { id: 2, name: "Design", slug: "design" },
          { id: 3, name: "Backend", slug: "backend" },
          { id: 4, name: "Career", slug: "career" },
        ]);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // filter data
  const filterCourses = (courses, { search, activeFilters }) => {
    return courses.filter((course) => {
      if (!course) return false;

      const query = search.toLowerCase();
      const { final } = getFinalPrice(course.price || {});

      const matchSearch =
        (course.title || "").toLowerCase().includes(query) ||
        (course.instructor?.name || "").toLowerCase().includes(query) ||
        (course.category || "").toLowerCase().includes(query) ||
        (course.description || "").toLowerCase().includes(query);

      const matchCategory =
        activeFilters.category.length === 0 ||
        activeFilters.category.includes(course.category.toLowerCase());

      const matchPrice =
        activeFilters.price.length === 0 ||
        activeFilters.price.some((opt) => {
          if (opt === "under-100") return final < 100000;
          if (opt === "100-300") return final >= 100000 && final <= 300000;
          if (opt === "over-300") return final > 300000;
          return true;
        });

      // const matchDuration =
      //   activeFilters.duration.length === 0 ||
      //   activeFilters.duration.some((range) => {
      //     const dur = course.duration_total || 0;
      //     if (range === "short") return dur < 4;
      //     if (range === "medium") return dur >= 4 && dur <= 8;
      //     if (range === "long") return dur > 8;
      //     return true;
      //   });

      // return matchSearch && matchCategory && matchPrice && matchDuration;
      return matchSearch && matchCategory && matchPrice;
    });
  };

  const sortCourses = (courses, sortOption) => {
    return [...courses].sort((a, b) => {
      const aFinal = getFinalPrice(a.price || {}).final || 0;
      const bFinal = getFinalPrice(b.price || {}).final || 0;
      const aStars = a.rating?.stars || 0;
      const bStars = b.rating?.stars || 0;

      switch (sortOption) {
        case "low":
          return aFinal - bFinal;
        case "high":
          return bFinal - aFinal;
        case "az":
          return (a.title || "").localeCompare(b.title || "");
        case "za":
          return (b.title || "").localeCompare(a.title || "");
        case "rating-high":
          return bStars - aStars;
        case "rating-low":
          return aStars - bStars;
        default:
          return 0;
      }
    });
  };

  const filteredCourses = sortCourses(
    filterCourses(courses, { search, activeFilters }),
    sortOption
  );

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeFilters, sortOption]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    setLoading(true);
    const delay = setTimeout(() => {
      setLoading(false);
    }, 400); // 400ms biar smooth tapi responsif

    return () => clearTimeout(delay);
  }, [search, activeFilters, sortOption]);

  return (
    <div className="flex flex-col justify-center gap-6 md:gap-9!">
      {/* Section Title */}
      <section className="max-w-7xl mx-auto w-full">
        <div className="max-w-full relative flex flex-col gap-4">
          <h3 className="text-2xl! md:text-[32px]! font-semibold leading-tight">
            Koleksi Video Pembelajaran Unggulan
          </h3>
          <p className="text-sm md:text-base font-medium text-text-dark-secondary leading-tight tracking-[0.2px]">
            Jelajahi Dunia Pengetahuan Melalui Pilihan Kami!
          </p>
        </div>
      </section>
      {/* End Section Title */}

      <section className="max-w-7xl mx-auto w-full">
        <div className=" flex flex-col md:flex-row gap-6 md:gap-[42px]">
          {/* Filter Sidebar */}
          <aside className="md:w-64 xl:w-[366px] shrink-0">
            <FilterSidebar
              categories={categories}
              activeFilters={activeFilters}
              setActiveFilters={setActiveFilters}
            />
          </aside>

          <main className="flex-1 min-w-0 flex flex-col gap-6 min-h-[700px]">
            {/* Header Filter + Search */}
            <div className="w-full">
              <div className="flex items-center justify-center md:justify-end! gap-4 w-full">
                <SortDropdown
                  sortOption={sortOption}
                  setSortOption={setSortOption}
                />

                <div className="relative w-full md:w-auto">
                  <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                    <Search className="text-text-dark-secondary" size={18} />
                  </div>
                  <input
                    type="search"
                    id="default-search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full p-3.5 pe-10 text-sm text-gray-900 border border-other-border rounded-[10px] bg-white focus:ring-main-primary focus:border-main-primary"
                    placeholder="Cari Kelas..."
                  />
                </div>
              </div>
            </div>

            {/* Course Card */}
            <div className="w-full min-h-[600px]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 w-full min-h-[600px]">
                {loading && (
                  <div className="col-span-full flex justify-center items-center">
                    <LoaderCircle className="w-6 h-6 animate-spin text-secondary" />
                    <span className="ml-2 text-text-dark-disabled">
                      Load data...
                    </span>
                  </div>
                )}

                {!loading && paginatedCourses.length === 0 && (
                  <div className="col-span-full flex justify-center items-center text-text-dark-disabled">
                    Data tidak ditemukan
                  </div>
                )}

                {!loading &&
                  paginatedCourses.length > 0 &&
                  paginatedCourses.map((course) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <CardCourse course={course} />
                    </motion.div>
                  ))}
              </div>
            </div>

            {/* End Course Card */}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </main>
        </div>
      </section>
    </div>
  );
}
