export function normalizeProduct(product, users = []) {
  const instructor = users.find((u) => String(u.id) === String(product.instructorId)) ?? null;

  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    category: product.category,
    thumbnail: product.thumbnail,
    description: product.description,

    instructor: instructor
      ? {
          name: instructor.fullname,
          avatar: instructor.avatar,
          position: instructor.position,
          company: instructor.company,
        }
      : null,

    price: {
      original: Number(product.price) || 0,
      discounted:
        product.discount && Number(product.discount) > 0
          ? Number(product.discount)
          : null,
    },

    rating: {
      stars: Number(product.ratingValue) || 0,
      reviews: Number(product.ratingCount) || 0,
    },
  };
}
