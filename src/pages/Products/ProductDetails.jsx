import {
  Book,
  ChevronDown,
  Clock,
  FileBadge,
  FileCheck,
  FilePen,
  Globe,
  PlayCircle,
  Video,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import RatingStars from "../../components/RatingStars";
import CardCourse from "../../components/CardCourse";
import { getFinalPrice } from "../../utils/price";

export default function ProductDetail() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [category, setCategory] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [relatedCourses, setRelatedCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [coursesRes, categoriesRes, usersRes, lessonsRes] =
        await Promise.all([
          fetch("/data/courses.json"),
          fetch("/data/categories.json"),
          fetch("/data/users.json"),
          fetch("/data/lessons.json"),
        ]);
      const [coursesData, categoriesData, usersData, lessonsData] =
        await Promise.all([
          coursesRes.json(),
          categoriesRes.json(),
          usersRes.json(),
          lessonsRes.json(),
        ]);

      // Pilih course berdasarkan slug (title diubah menjadi slug)
      const selected = coursesData.find(
        (item) => item.title.toLowerCase().replace(/\s+/g, "-") === slug
      );
      if (selected) {
        const instructor = usersData.find(
          (u) => u.id === selected.instructor_id
        );
        setCourse({ ...selected, instructor });

        // filter course lain dalam kategori yang sama, tapi exclude yang lagi dibuka
        const related = coursesData
          .filter(
            (c) =>
              c.category_id === selected.category_id && c.id !== selected.id
          )
          .slice(0, 3);
        setRelatedCourses(related);
      }

      // Pilih category berdasarkan id
      const category = categoriesData.find(
        (item) => item.id === selected.category_id
      );
      if (category) {
        setCategory(category);
      }

      // Pilih lessons berdasarkan course_id
      const lessons = lessonsData.filter(
        (item) => item.course_id === selected.id
      );
      if (lessons) {
        setLessons(lessons);
      }
    };

    fetchData();
  }, [slug]);

  useEffect(() => {
    // Scroll to top when the course has been loaded/updated
    if (course) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [course]);

  if (!course) return <p className="text-center py-10">LoadingA...</p>;

  const { hasDiscount, formatted } = getFinalPrice(course.price);

  return (
    <>
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <Link
              to="/"
              className="inline-flex items-center text-sm font-medium text-text-dark-disabled hover:text-text-dark-primary"
            >
              Beranda
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="text-text-dark-disabled">/</span>
              <Link
                to="#"
                className="ms-1 text-sm font-medium text-text-dark-disabled hover:text-text-dark-primary md:ms-2"
              >
                {category?.id}
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <span className="text-text-dark-disabled">/</span>
              <span className="ms-1 text-sm font-medium text-text-dark-primary md:ms-2">
                {course.title}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full h-[400px] rounded-[10px] overflow-hidden mt-8">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/80"></div>

        {/* Content */}
        <div className="absolute inset-0 w-full flex flex-col justify-center items-start gap-2.5 md:gap-6 text-white text-left px-5 md:px-20! xl:px-[140px]!">
          <h1 className="text-2xl! md:text-3xl! lg:text-[48px]! font-bold leading-tight">
            {course.title}
          </h1>
          <p className="w-full text-sm md:text-base! font-medium leading-relaxed truncate">
            {course.description}
          </p>
          <RatingStars
            rating={course.rating?.stars || 0}
            reviews={course.rating?.reviews || 0}
            emptyStarColor="text-text-light-disabled"
            textColor="text-text-light-secondary"
          />
        </div>
        {/* End Content */}
      </section>
      {/* End Hero Section */}

      <section className="mx-auto max-w-7xl mt-8 flex flex-col md:flex-row gap-6 md:gap-9">
        {/* Desc + Price */}
        <div className="w-full md:w-[366px]! h-fit flex flex-col order-1 md:order-2 items-start gap-5 md:gap-6 rounded-[10px] bg-other-primarybg border border-other-border p-5 md:p-6">
          <div className="flex flex-col items-start gap-3 md:gap-4">
            <h6 className="tracking-normal text-text-dark-primary">
              Gapai Karier Impianmu sebagai Seorang UI/UX Designer & Product
              Manager.
            </h6>
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                {hasDiscount ? (
                  <>
                    <span className="text-base md:text-lg! font-semibold text-primary">
                      {formatted.final}
                    </span>
                    <span className="text-sm md:text-base font-medium text-text-dark-disabled line-through">
                      {formatted.original}
                    </span>
                  </>
                ) : (
                  <span className="text-base md:text-lg! font-semibold text-primary">
                    {formatted.final}
                  </span>
                )}
              </div>
              <span className="inline-block bg-secondary text-white font-normal rounded-[10px] text-xs px-1 py-2.5">
                Diskon 50%
              </span>
            </div>
            <span className="text-info-default font-medium text-sm">
              Penawaran spesial tersisa 2 hari lagi!
            </span>
          </div>
          <div className="w-full flex flex-col items-start gap-3 md:gap-4">
            <Link
              to="#"
              className="w-full inline-block bg-primary hover:bg-transparent text-white text-center hover:text-primary border border-primary md:font-bold rounded-[10px] text-sm md:text-base! px-[22px] py-[7px] md:px-[26px]! md:py-2.5! transition-colors duration-300"
            >
              Beli Sekarang
            </Link>
          </div>
          <div className="flex flex-col items-start gap-3 md:gap-4">
            <h4>Kelas Ini Sudah Termasuk</h4>
            <div className="flex gap-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <FileCheck className="text-text-dark-secondary" />
                  <span className="text-text-dark-secondary font-normal text-sm">
                    Ujian Akhir
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Book className="text-text-dark-secondary" />
                  <span className="text-text-dark-secondary font-normal text-sm">
                    7 Dokumen
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FilePen className="text-text-dark-secondary" />
                  <span className="text-text-dark-secondary font-normal text-sm">
                    Pretest
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Video className="text-text-dark-secondary" />
                  <span className="text-text-dark-secondary font-normal text-sm">
                    49 Video
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FileBadge className="text-text-dark-secondary" />
                  <span className="text-text-dark-secondary font-normal text-sm">
                    Sertifikat
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 md:gap-4">
            <h4>Bahasa Pengantar</h4>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Globe className="text-text-dark-secondary" />
                <span className="text-text-dark-secondary font-normal text-sm">
                  Bahasa Indonesia
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col order-2 md:order-1 gap-6 md:gap-9">
          {/* Deskripsi */}
          <div className="w-full h-fit flex flex-col items-start gap-5 md:gap-6 rounded-[10px] bg-other-primarybg border border-other-border p-5 md:p-6">
            <div className="flex flex-col items-start gap-3 md:gap-4">
              <h5 className="text-lg md:text-xl! font-semibold tracking-normal text-text-dark-primary">
                Deskripsi
              </h5>
              <p className="text-sm md:text-base! font-medium text-text-dark-secondary leading-tight tracking-[0.2px]">
                {course.description}
              </p>
            </div>
          </div>

          {/* Intructuor */}
          <div className="w-full h-fit flex flex-col items-start gap-5 md:gap-6 rounded-[10px] bg-other-primarybg border border-other-border p-5 md:p-6">
            <h5 className="text-lg md:text-xl! font-semibold tracking-normal text-text-dark-primary">
              Belajar bersama Tutor Profesional
            </h5>
            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-5">
              {/* Card Instructor */}
              <div className="w-full flex flex-col items-start gap-3 p-4 rounded-[10px] bg-other-primarybg border border-other-border">
                {/* Instructor */}
                <div className="flex items-start gap-2.5">
                  <Link to="#" className="block shrink-0">
                    <img
                      alt={course.instructor.name}
                      src={
                        course.instructor.profile_image ||
                        "https://via.placeholder.com/48?text=?"
                      }
                      className="w-10 h-10 rounded-[10px] object-cover"
                    />
                  </Link>

                  <div className="flex flex-col">
                    <p className="text-sm md:text-base font-medium">
                      <Link to="#">{course.instructor.name}</Link>
                    </p>

                    <p className="text-xs md:text-sm font-normal text-text-dark-secondary">
                      {course.instructor.position}{" "}
                      {course.instructor.company && (
                        <>
                          di{" "}
                          <span className="font-bold!">
                            {course.instructor.company}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <p className="hidden md:block text-text-dark-secondary text-sm md:text-base! lg:text-lg truncate-8">
                  Berkarier di bidang HR selama lebih dari 3 tahun. Saat ini
                  bekerja sebagai Senior Talent Acquisition Specialist di Wings
                  Group Indonesia (Sayap Mas Utama) selama hampir 1 tahun.
                </p>
              </div>
              {/* Card Instructor */}
              <div className="w-full flex flex-col items-start gap-3 p-4 rounded-[10px] bg-other-primarybg border border-other-border">
                {/* Instructor */}
                <div className="flex items-start gap-2.5">
                  <Link to="#" className="block shrink-0">
                    <img
                      alt={course.instructor.name}
                      src={
                        course.instructor.profile_image ||
                        "https://via.placeholder.com/48?text=?"
                      }
                      className="w-10 h-10 rounded-[10px] object-cover"
                    />
                  </Link>

                  <div className="flex flex-col">
                    <p className="text-sm md:text-base font-medium">
                      <Link to="#">{course.instructor.name}</Link>
                    </p>

                    <p className="text-xs md:text-sm font-normal text-text-dark-secondary">
                      {course.instructor.position}{" "}
                      {course.instructor.company && (
                        <>
                          di{" "}
                          <span className="font-bold!">
                            {course.instructor.company}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <p className="hidden md:block text-text-dark-secondary text-sm md:text-base! lg:text-lg truncate-8">
                  Berkarier di bidang HR selama lebih dari 3 tahun. Saat ini
                  bekerja sebagai Senior Talent Acquisition Specialist di Wings
                  Group Indonesia (Sayap Mas Utama) selama hampir 1 tahun.
                </p>
              </div>
            </div>
          </div>

          {/* Accordian */}
          <div className="w-full h-fit flex flex-col items-start gap-5 md:gap-6! rounded-[10px] bg-other-primarybg border border-other-border p-5 md:p-6">
            <h5 className="text-lg md:text-xl! font-semibold tracking-normal text-text-dark-primary">
              Kamu akan Mempelajari
            </h5>
            <div
              id="accordion-collapse"
              className="w-full flex flex-col gap-5 md:gap-6!"
              data-accordion="collapse"
            >
              <div className="flex flex-col gap-2 md:gap-3!">
                <div className="flex justify-between">
                  <h6 className="text-base md:text-lg! text-primary">
                    Introduction to Course 1: Foundations of User Experience
                    Design
                  </h6>
                  <ChevronDown className="text-text-dark-secondary" />
                </div>
                <div
                  id="accordion-collapse-body-1"
                  className="flex justify-between rounded-[10px] p-5 bg-other-primarybg border border-other-border"
                  aria-labelledby="accordion-collapse-heading-1"
                >
                  {/* <div className="flex justify-between rounded-[10px] p-5 bg-other-primarybg border border-other-border"> */}
                  <p className="text-sm md:text-base! font-medium text-text-dark-primary">
                    The basics of user experience design
                  </p>
                  <div className="flex items-center gap-3 md:gap-4!">
                    <div className="flex items-center gap-2">
                      <PlayCircle className="text-text-dark-secondary" />
                      <span className="text-text-dark-secondary font-normal text-sm">
                        Video
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="text-text-dark-secondary" />
                      <span className="text-text-dark-secondary font-normal text-sm">
                        12 Menit
                      </span>
                    </div>
                  </div>
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>

          {/* Rating and Review */}
          <div className="w-full h-fit flex flex-col items-start gap-5 md:gap-6 rounded-[10px] bg-other-primarybg border border-other-border p-5 md:p-6">
            <h5 className="text-lg md:text-xl! font-semibold tracking-normal text-text-dark-primary">
              Rating and Review
            </h5>
            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-5">
              {/* Card Instructor */}
              <div className="w-full flex flex-col items-start gap-3 p-4 rounded-[10px] bg-other-primarybg border border-other-border">
                {/* Instructor */}
                <div className="flex items-start gap-2.5">
                  <Link to="#" className="block shrink-0">
                    <img
                      alt={name}
                      src={
                        course.profile_image ||
                        "https://via.placeholder.com/48?text=?"
                      }
                      className="w-10 h-10 rounded-[10px] object-cover"
                    />
                  </Link>

                  <div className="flex flex-col">
                    <p className="text-sm md:text-base font-medium">
                      <Link to="#">{name}</Link>
                    </p>

                    <p className="text-xs md:text-sm font-normal text-text-dark-secondary">
                      {course.position}{" "}
                      {course.company && (
                        <>
                          di{" "}
                          <span className="font-bold!">{course.company}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <p className="hidden md:block text-text-dark-secondary text-sm md:text-base! lg:text-lg truncate-8">
                  Berkarier di bidang HR selama lebih dari 3 tahun. Saat ini
                  bekerja sebagai Senior Talent Acquisition Specialist di Wings
                  Group Indonesia (Sayap Mas Utama) selama hampir 1 tahun.
                </p>
                {/* <RatingStars rating={stars} reviews={reviews} /> */}
              </div>
              {/* Card Instructor */}
              <div className="w-full flex flex-col items-start gap-3 p-4 rounded-[10px] bg-other-primarybg border border-other-border">
                {/* Instructor */}
                <div className="flex items-start gap-2.5">
                  <Link to="#" className="block shrink-0">
                    <img
                      alt={name}
                      src={
                        course.profile_image ||
                        "https://via.placeholder.com/48?text=?"
                      }
                      className="w-10 h-10 rounded-[10px] object-cover"
                    />
                  </Link>

                  <div className="flex flex-col">
                    <p className="text-sm md:text-base font-medium">
                      <Link to="#">{name}</Link>
                    </p>

                    <p className="text-xs md:text-sm font-normal text-text-dark-secondary">
                      {course.position}{" "}
                      {course.company && (
                        <>
                          di{" "}
                          <span className="font-bold!">{course.company}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <p className="hidden md:block text-text-dark-secondary text-sm md:text-base! lg:text-lg truncate-8">
                  Berkarier di bidang HR selama lebih dari 3 tahun. Saat ini
                  bekerja sebagai Senior Talent Acquisition Specialist di Wings
                  Group Indonesia (Sayap Mas Utama) selama hampir 1 tahun.
                </p>
                {/* <RatingStars rating={stars} reviews={reviews} /> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Card */}
      <section className="mx-auto max-w-7xl my-8">
        <div className="max-w-full relative flex flex-col gap-4">
          <h3 className="text-2xl! md:text-[32px]! font-semibold leading-tight">
            Video Pembelajaran Terkait Lainnya
          </h3>
          <p className="text-sm md:text-base! font-medium text-text-dark-secondary leading-tight tracking-[0.2px]">
            Ekspansi Pengetahuan Anda dengan Rekomendasi Spesial Kami!
          </p>
        </div>

        {/* Menu Card */}
        {relatedCourses.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:gap-6">
            <AnimatePresence>
              {relatedCourses.map((course) => (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <CardCourse key={course.id} course={course} limit={3} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <p className="text-center text-text-dark-secondary text-lg font-medium animate-pulse">
            Memuat data...
          </p>
        )}
        {/* End Menu Card */}
      </section>
      {/* End Section Card */}
    </>
  );
}
