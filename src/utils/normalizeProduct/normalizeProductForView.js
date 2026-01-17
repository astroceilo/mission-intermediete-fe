export function normalizeProductForView(product, users = []) {
  const instructor =
    users.find((u) => String(u.id) === String(product.instructorId)) ?? null;

  const price = Number(product.price) || 0;
  const discount = Number(product.discount) || 0;

  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    category: product.category,
    thumbnail: product.thumbnail,
    description: product.description,
    createdAt: product.createdAt,

    instructor: instructor
      ? {
          id: instructor.id,
          name: instructor.fullname,
          avatar: instructor.avatar ?? null,
          position: instructor.position,
          company: instructor.company,
        }
      : null,

    price: {
      original: price,
      discount: discount,
      final: discount > 0 ? price - discount : price,
    },

    rating: {
      stars: Number(product.ratingValue) || 0,
      reviews: Number(product.ratingCount) || 0,
    },
  };
}
