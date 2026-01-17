import { Link } from "react-router-dom";

import { getFinalPrice } from "../utils/price";
import RatingStars from "./RatingStars";

export default function CardCourse({ course }) {
  if (!course) return null;

  const {
    title = "Judul Tidak Diketahui",
    slug,
    category,
    thumbnail,
    description = "",
    instructor = {},
    price = null,
    rating = {},
  } = course;

  const { name, avatar, position, company } = instructor ?? {};
  const { stars = 0, reviews = 0 } = rating ?? {};

  // hasil harga dari utils
  const { hasDiscount, formatted } = getFinalPrice(price);

  return (
    <div
      className="group h-auto md:h-[426px] rounded-[10px] bg-other-primarybg border border-other-border p-2.5 md:p-5! flex flex-col gap-2 md:gap-4! transition duration-300 ease-in-out transform hover:shadow-lg"
      data-category={category}
    >
      {/* Content */}
      <div className="flex flex-col gap-2.5">
        <div className="flex md:flex-col! gap-2.5">
          {/* Thumbnail */}
          <img
            src={thumbnail}
            alt={title}
            className="w-[82px] h-[82px] md:w-auto! md:h-[193px]! rounded-[10px] object-cover transition duration-500 group-hover:scale-105 sm:h-72!"
          />
          <div className="flex flex-col flex-1 gap-1.5 md:gap-2!">
            {/* Title & Description */}
            <div className="flex flex-col gap-0 md:gap-2!">
              <Link
                to={
                  slug
                    ? `/product/${slug.toLowerCase().replace(/\s+/g, "-")}`
                    : "#"
                }
              >
                <h6 className="font-pop font-semibold text-base md:text-lg! leading-[1.2] tracking-normal text-text-dark-primary">
                  {title}
                </h6>
              </Link>

              <p className="hidden md:block font-dm font-medium text-base leading-[1.4] tracking-[0.2px] text-text-dark-secondary truncate-2">
                {description}
              </p>
            </div>

            {/* Instructor */}
            <div className="flex items-start gap-2.5">
              <Link to="#" className="block shrink-0">
                <img
                  alt={name}
                  src={avatar || "https://via.placeholder.com/48?text=?"}
                  className="w-10 h-10 rounded-[10px] object-cover"
                />
              </Link>

              <div className="flex flex-col">
                <p className="font-dm font-medium text-sm md:text-base! leading-[1.4] tracking-[0.2px] text-text-dark-primary">
                  <Link to="#">{name}</Link>
                </p>

                <p className="font-dm font-normal text-xs md:text-sm! leading-[1.4] tracking-[0.2px] text-text-dark-secondary">
                  {position}{" "}
                  {company && (
                    <>
                      di <span className="font-bold!">{company}</span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rating & Price */}
        <div className="flex items-center justify-between">
          <RatingStars rating={stars} reviews={reviews} />

          <div className="flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="font-pop font-normal text-xs md:text-sm! text-main-tertiary leading-[1.4] tracking-[0.2px] line-through">
                  {formatted.original}
                </span>
                <h4 className="font-pop font-semibold text-xl md:text-2xl! text-main-primary leading-[1.2] tracking-normal">
                  {formatted.final}
                </h4>
              </>
            ) : (
              <span className="font-pop font-semibold text-xl md:text-2xl! text-main-primary leading-[1.2] tracking-normal">
                {formatted.final}
              </span>
            )}
          </div>
        </div>
      </div>
      {/* Content */}
    </div>
  );
}
