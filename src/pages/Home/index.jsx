import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import hero from "../../assets/images/hero_section.jpg";
import news from "../../assets/images/news-letter.jpg";
import CardCourse from "../../components/CardCourse";


export default function Home() {
  const [activeCategory, setActiveCategory] = useState("semua-kelas");
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, usersRes, categoriesRes] = await Promise.all([
          fetch("/data/courses.json"),
          fetch("/data/users.json"),
          fetch("/data/categories.json"),
        ]);
        const [coursesData, usersData, categoriesData] = await Promise.all([
          coursesRes.json(),
          usersRes.json(),
          categoriesRes.json(),
        ]);

        // Gabungin instructor ke course berdasarkan instructor_id
        const mergedData = coursesData.map((course) => {
          const instructor =
            usersData.find((u) => u.id === course.instructor_id) ?? null;
          return { ...course, instructor };
        });

        setCourses(mergedData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    fetchData();
  }, []);

  // Filter by category
  const filteredCourses =
    activeCategory === "semua-kelas"
      ? courses
      : courses.filter((course) => {
          const category = categories.find(
            (cat) => cat.slug === activeCategory
          );
          return category ? course.category_id === category.id : false;
        });

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-[400px] rounded-[10px] overflow-hidden">
        <img src={hero} alt="Belajar" className="w-full h-full object-cover" />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/80"></div>

        {/* Content */}
        <div className="absolute inset-0 w-full flex flex-col justify-center items-center gap-2.5 md:gap-6 text-white text-center px-5 md:px-20! xl:px-[140px]!">
          <h1 className="font-pop font-bold text-2xl md:text-3xl! lg:text-5xl! leading-[1.1] tracking-[0px]">
            Revolusi Pembelajaran: Temukan Ilmu Baru melalui Platform Video
            Interaktif!
          </h1>
          <p className="font-dm font-medium text-sm md:text-base! leading-[1.4] tracking-[0.2px]">
            Temukan ilmu baru yang menarik dan mendalam melalui koleksi video
            pembelajaran berkualitas tinggi. Tidak hanya itu, Anda juga dapat
            berpartisipasi dalam latihan interaktif yang akan meningkatkan
            pemahaman Anda.
          </p>
          <Link
            to="/products"
            className="inline-block bg-main-primary hover:bg-transparent text-white hover:text-primary border border-main-primary rounded-lg font-dm font-normal md:font-bold! text-sm md:text-base! leading-[1.4] tracking-[0.2px] px-3.5 py-2 md:px-[26px]! md:py-2.5! transition-colors duration-300"
          >
            Temukan Video Course untuk Dipelajari!
          </Link>
        </div>
        {/* End Content */}
      </section>
      {/* End Hero Section */}

      {/* Section Card */}
      <section className="relative w-full flex flex-col gap-6 md:gap-8!">
        {/* Title */}
        <div className="w-fit flex flex-col gap-2.5">
          <h3 className="font-pop font-semibold text-2xl md:text-[32px]! leading-[1.1] tracking-[0] text-text-dark-primary">
            Koleksi Video Pembelajaran Unggulan
          </h3>
          <p className="font-dm font-medium text-sm md:text-base! leading-[1.4] tracking-[0.2px] text-text-dark-secondary">
            Jelajahi Dunia Pengetahuan Melalui Pilihan Kami!
          </p>
        </div>
        {/* End Title */}

        {/* Filter Card Selection */}
        <div className="w-full overflow-x-auto overflow-y-hidden no-scrollbar">
          <AnimatePresence>
            <motion.div layout className="flex items-center gap-4 md:gap-6!">
              {[
                { id: "all", name: "Semua Kelas", slug: "semua-kelas" },
                ...categories,
              ].map((cat, index) => {
                const isActive = activeCategory === cat.slug;
                const isFirst = index === 0;
                const isLast = index === categories.length - 1;

                return (
                  <div key={cat.slug} className="h-8 md:h-9 flex items-center">
                    <motion.button
                      onClick={() => setActiveCategory(cat.slug)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        transformOrigin: isFirst
                          ? "left center"
                          : isLast
                          ? "right center"
                          : "center center",
                      }}
                      className={`relative pb-2 whitespace-nowrap font-dm font-medium text-sm md:text-base! cursor-pointer
                        ${
                          isActive
                            ? "text-main-tertiary"
                            : "text-text-dark-secondary hover:text-main-tertiary transition-colors"
                        }`}
                    >
                      {cat.name}

                      {isActive && (
                        <motion.div
                          layoutId="categoryUnderline"
                          className="absolute left-0 bottom-0 h-1 w-1/2 rounded-full bg-main-tertiary"
                          transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 25,
                          }}
                        />
                      )}
                    </motion.button>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
        {/* End Filter Card Selection */}

        {/* Menu Card */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:gap-6">
            <AnimatePresence>
              {filteredCourses.map((course) => (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <CardCourse key={course.id} course={course} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <p className="font-dm font-medium text-lg leading-[1.4] tracking-normal text-center text-text-dark-secondary animate-pulse">
            Memuat data...
          </p>
        )}
        {/* End Menu Card */}
      </section>
      {/* End Section Card */}

      {/* News Letter Section */}
      <section className="relative w-full h-[400px] rounded-[10px] overflow-hidden">
        {/* Background */}
        <img src={news} alt="Belajar" className="w-full h-full object-cover" />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="w-full max-w-[525px] flex flex-col items-center justify-center gap-10">
            <div className="flex flex-col items-center gap-1">
              <span className="font-dm font-medium text-base md:text-lg! leading-[1.4] tracking-[0.2px] text-text-light-secondary">
                NEWSLETTER
              </span>
              <h3 className="font-pop font-semibold text-2xl md:text-[32px]! leading-[1.1] tracking-[0] text-text-light-primary">
                Mau Belajar Lebih Banyak?
              </h3>
              <span className="font-dm font-normal text-sm md:text-base! leading-[1.4] tracking-[0.2px] text-other-basebg">
                Daftarkan dirimu untuk mendapatkan informasi terbaru dan
                penawaran spesial dari program-program terbaik hariesok.id
              </span>
            </div>

            {/* Form */}
            <form
              action="#"
              method="post"
              className="w-[280px] md:w-full relative flex flex-col md:flex-row items-center bg-transparent md:bg-white rounded-[10px] p-0 md:py-2.5! md:px-3.5! gap-4"
            >
              {/* Input */}
              <input
                type="email"
                placeholder="Masukkan Emailmu"
                className="w-full bg-white md:bg-transparent text-text-dark-secondary text-sm md:text-base! font-normal text-center md:text-left! rounded-[10px] p-2.5 md:p-2 focus:outline-none focus:ring-2 focus:ring-main-secondary border-none"
              />

              {/* Tombol (Desktop & Mobile) */}
              <button
                type="submit"
                className="w-full md:w-auto bg-main-secondary hover:bg-transparent text-white hover:text-main-secondary border hover:border border-main-secondary hover:border-main-secondary text-sm md:text-base! font-bold rounded-[10px] py-2.5 px-[26px] focus:outline-none focus:ring-2 focus:ring-main-secondary transition cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        {/* End Content */}
      </section>
      {/* End News Letter Section */}
    </>
  );
}
