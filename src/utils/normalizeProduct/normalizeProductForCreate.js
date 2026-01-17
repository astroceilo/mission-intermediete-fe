export function normalizeProductForCreate(form) {
  return {
    title: form.title,
    slug: form.slug,
    category: form.category,
    thumbnail: form.thumbnail,
    description: form.description,

    price: Number(form.price),
    discount: Number(form.discount) || 0,

    instructorId: form.instructorId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
