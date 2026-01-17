import { SLUG_REGEX } from "../regex/slug";


export const validateSlug = (slug) => {
  if (!slug) return "Slug wajib diisi";
  if (slug.length < 5) return "Slug minimal 5 karakter";
  if (slug.length > 80) return "Slug terlalu panjang";
  if (!SLUG_REGEX.test(slug))
    return "Slug hanya boleh huruf kecil, angka, dan tanda -";
  return "";
};
