import { validateSlug } from "../validators/validateSlug";


export const validateCreateProductForm = (name, value, form) => {
  switch (name) {
    case "title":
      if (!value) return "Nama produk wajib diisi";
      if (value.length < 5) return "Nama produk minimal 5 karakter";
      return "";

    case "slug":
      return validateSlug(value);

    case "category":
      if (!value) return "Kategori wajib dipilih";
      return "";

    case "thumbnail":
      if (!value) return "Thumbnail wajib diupload";
      if (!(value instanceof File))
        return "File thumbnail tidak valid";
      if (!value.type.startsWith("image/"))
        return "Thumbnail harus berupa gambar";
      if (value.size > 2 * 1024 * 1024)
        return "Ukuran thumbnail maksimal 2MB";
      return "";

    case "description":
      if (!value) return "Deskripsi wajib diisi";
      if (value.length < 10)
        return "Deskripsi minimal 10 karakter";
      return "";

    case "price":
      if (value === "") return "Harga wajib diisi";
      if (+value <= 0) return "Harga harus lebih dari 0";
      return "";

    case "discount":
      if (value === "") return "";
      if (+value < 0) return "Diskon tidak boleh negatif";
      if (+value >= +form.price)
        return "Diskon tidak boleh ≥ harga";
      return "";

    default:
      return "";
  }
};
