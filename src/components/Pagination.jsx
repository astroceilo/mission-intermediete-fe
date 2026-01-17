import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPaginationRange = (current, total) => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let last;

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta)
      ) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (last) {
        if (i - last === 2) {
          rangeWithDots.push(last + 1);
        } else if (i - last !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      last = i;
    }

    return rangeWithDots;
  };

  const handleChange = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center md:justify-end! mt-6"
    >
      <ul className="inline-flex items-center gap-1.5 text-sm font-semibold">
        {/* Prev Button */}
        <li>
          <button
            onClick={() => handleChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center justify-center w-10 h-10 rounded-sm transition ${
              currentPage === 1
                ? "bg-other-basebg text-text-dark-disabled cursor-not-allowed"
                : "bg-other-basebg text-text-dark-primary hover:bg-other-secondarybg cursor-pointer"
            }`}
          >
            <ChevronLeft size={18} />
          </button>
        </li>

        {/* Dynamic Page Numbers */}
        {getPaginationRange(currentPage, totalPages).map((page, i) => (
          <li key={i}>
            {page === "..." ? (
              <span className="flex items-center justify-center w-10 h-10 text-text-dark-secondary">
                ...
              </span>
            ) : (
              <button
                onClick={() => handleChange(page)}
                className={`flex items-center justify-center w-10 h-10 rounded-sm transition ${
                  currentPage === page
                    ? "bg-main-secondary text-white cursor-pointer"
                    : "text-text-dark-secondary hover:bg-main-secondary-400 hover:text-white cursor-pointer"
                }`}
              >
                {page}
              </button>
            )}
          </li>
        ))}

        {/* Next Button */}
        <li>
          <button
            onClick={() => handleChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center w-10 h-10 rounded-sm transition ${
              currentPage === totalPages
                ? "bg-other-basebg text-text-dark-disabled cursor-not-allowed"
                : "bg-other-basebg text-text-dark-primary hover:bg-other-secondarybg cursor-pointer"
            }`}
          >
            <ChevronRight size={18} />
          </button>
        </li>
      </ul>
    </nav>
  );
}
