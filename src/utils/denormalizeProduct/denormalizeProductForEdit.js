export function denormalizeProductForEdit(course) {
  if (!course) return null;

  return {
    title: course.title ?? "",
    slug: course.slug ?? "",
    category: course.category ?? "",
    thumbnail: course.thumbnail ?? "",
    description: course.description ?? "",

    price: course.price?.original?.toString() ?? "",
    discount: course.price?.discount?.toString() ?? "",

    instructorId: course.instructor?.id
      ? course.instructor.id.toString()
      : "",

    ratingValue: course.rating?.stars?.toString() ?? "0",
    ratingCount: course.rating?.reviews?.toString() ?? "0",
  };
}
