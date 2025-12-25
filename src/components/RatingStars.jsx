import { FaStar } from "react-icons/fa";


/**
 * Komponen RatingStars
 * @param {number} rating - Nilai rating (contoh: 4.3)
 * @param {number} reviews - Jumlah ulasan (opsional)
 * @param {string} size - Ukuran ikon (default: w-4 h-4)
 */

export default function RatingStars({
  rating = 0,
  reviews,
  size = "w-4 h-4 md:w-5 md:h-5",
  emptyStarColor = "text-text-dark-disabled",
  textColor = "text-text-dark-secondary",
}) {
  const totalStars = 5;

  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center">
        {Array.from({ length: totalStars }).map((_, i) => {
          const fillPercentage = Math.min(Math.max(rating - i, 0), 1) * 100;

          return (
            <span key={i} className={`relative inline-block ${size}`}>
              {/* Star dasar abu-abu */}
              <FaStar className={`absolute inset-0 ${emptyStarColor}`} />

              {/* Overlay kuning sesuai persen isi */}
              <span
                className="absolute top-0 left-0 h-full overflow-hidden"
                style={{ width: `${fillPercentage}%` }}
              >
                <FaStar className="text-warning-default" />
              </span>
            </span>
          );
        })}
      </span>

      {reviews !== undefined && (
        <span
          className={`font-dm font-medium text-xs md:text-sm! leading-[1.4] tracking-[0.2px] underline ${textColor}`}
        >
          {rating} ({reviews})
        </span>
      )}
    </div>
  );
}
