import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { validateCreateProductForm } from "../../../utils/validationsProduct/validateCreateProductForm";
import { normalizeProductForCreate } from "../../../utils/normalizeProduct/normalizeProductForCreate";
import CategoryDropdown from "../../../components/Dropdown/CategoryDropdown";
import { getFinalPrice, formatPriceFull } from "../../../utils/price";
import { useAuth } from "../../../context/AuthContext";
import { slugify } from "../../../utils/slugify";
import { api } from "../../../services/api";

export default function UpdateProducts() {
  // useNavigate and useAuth state
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  // form state schema
  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "",
    thumbnail: null,
    description: "",
    price: "",
    discount: "",
    instructorId: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    slug: "",
    category: "",
    thumbnail: "",
    description: "",
    price: "",
    discount: "",
    instructorId: "",
  });

  // other state
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [priceInfo, setPriceInfo] = useState({
    original: 0,
    discount: 0,
    final: 0,
    formatted: { original: "0", discount: "0", final: "0" },
  });

  // initialize instructorId when user is logged in
  useEffect(() => {
    if (isLoggedIn && user?.id) {
      setForm((prev) => ({
        ...prev,
        instructorId: String(user.id),
      }));
    }
  }, [isLoggedIn, user]);

  // update price info when price or discount changes
  useEffect(() => {
    const updatedPriceInfo = getFinalPrice(
      {
        original: Number(form.price) || 0,
        discount: Number(form.discount) || 0,
        final: (Number(form.price) || 0) - (Number(form.discount) || 0),
      },
      formatPriceFull
    );
    setPriceInfo(updatedPriceInfo);
  }, [form.price, form.discount]);

  // cleanup preview
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // handle change input
  const handleChange = (eOrName, value) => {
    // custom component
    if (typeof eOrName === "string") {
      setForm((prev) => ({ ...prev, [eOrName]: value }));

      const errorMsg = validateCreateProductForm(eOrName, value, {
        ...form,
        [eOrName]: value,
      });

      setErrors((prev) => ({ ...prev, [eOrName]: errorMsg }));
      return;
    }

    // normal input
    const { name, type, files, value: inputValue } = eOrName.target;

    // slug
    if (name === "slug") {
      setIsSlugManual(true);

      const sanitized = slugify(inputValue);
      if (sanitized !== inputValue) {
        setForm((prev) => ({ ...prev, slug: sanitized }));
      }
    }

    // khusus file input
    if (type === "file") {
      const file = files[0];

      if (!file) return;

      // validasi type
      const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          thumbnail: "Thumbnail harus berupa gambar (PNG, JPG, WEBP)",
        }));
        return;
      }

      // validasi size (contoh max 2MB)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          thumbnail: "Ukuran gambar maksimal 2MB",
        }));
        return;
      }

      // preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      setForm((prev) => ({
        ...prev,
        thumbnail: file,
      }));

      setErrors((prev) => ({ ...prev, thumbnail: "" }));
      return;
    }

    const updatedForm = {
      ...form,
      [name]: inputValue,
      ...(name === "title" &&
        !isSlugManual && {
          slug: slugify(inputValue),
        }),
    };

    setForm(updatedForm);

    const errorMsg = validateCreateProductForm(name, inputValue, {
      ...form,
      [name]: inputValue,
    });

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  // validate all field
  const validateAll = () => {
    const newErrors = {};

    Object.entries(form).forEach(([key, val]) => {
      newErrors[key] = validateCreateProductForm(key, val, form) || "";
    });

    setErrors(newErrors);

    return !Object.values(newErrors).some((msg) => msg && msg.length > 0);
  };

  // handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateAll();
    if (!isValid) {
      toast.error("Masih ada data yang belum valid 😵");
      return;
    }

    setLoading(true);

    try {
      const payload = normalizeProductForCreate({
        ...form,
        // thumbnail: "[FILE]", //dummy placeholder
        thumbnail: "",
      });

      delete payload.thumbnail;

      console.group("UPDATE PRODUCT DEBUG");
      console.log("FORM RAW:", form);
      console.log("PAYLOAD NORMALIZED:", payload);
      console.groupEnd();

      await api.post("/products", {
        ...payload,
        updatedAt: new Date().toISOString(),
      });

      toast.success(
        "Produk berhasil diupdate 🚀, cek Console atau lihat Products (kecuali Thumbnail)",
        { autoClose: 2000 }
      );

      setTimeout(() => {
        navigate("/update-products");
      }, 2000);
    } catch (err) {
      console.error("Update product failed:", err);
      toast.error("Gagal mengupdate produk 😭");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Section Create Products */}
      <section className="relative w-full flex flex-col gap-6 md:gap-8!">
        {/* Title */}
        <div className="w-fit flex flex-col gap-2.5">
          <h3 className="font-pop font-semibold text-2xl md:text-[32px]! leading-[1.1] tracking-[0] text-text-dark-primary">
            Update Product {form.title}
          </h3>
        </div>
        {/* End Title */}

        <div className="flex flex-col gap-4 md:gap-6!">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 text-left"
          >
            <div className="flex flex-col gap-3 md:gap-4!">
              {/* Title */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="title"
                  className="block font-dm font-normal text-sm md:text-base! leading-[1.4] tracking-[0.2px] text-text-dark-secondary"
                >
                  Nama Produk <span className="text-error-default">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Masukkan Nama Produk"
                  className={`w-full font-dm font-normal text-sm md:text-base! leading-[1.4] tracking-[0.2px] border rounded-md px-3 py-2 focus:ring-2 focus:outline-none transition ${
                    errors.title
                      ? "border-red-500 focus:ring-red-400"
                      : "border-other-border focus:ring-main-primary-400"
                  }${
                    form.title === ""
                      ? "placeholder:text-text-dark-disabled text-text-dark-disabled"
                      : "text-text-dark-primary"
                  }`}
                  required
                />
                {/* Error Message */}
                {errors.title && (
                  <span className="text-red-500 text-sm">{errors.title}</span>
                )}
              </div>

              {/* Slug */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="slug"
                  className="block font-dm font-normal text-sm md:text-base! leading-[1.4] tracking-[0.2px] text-text-dark-secondary"
                >
                  Slug Produk <span className="text-error-default">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="Masukkan Slug Produk"
                    className={`w-full pr-28 font-dm font-normal text-sm md:text-base! leading-[1.4] tracking-[0.2px] border rounded-md px-3 py-2 focus:ring-2 focus:outline-none transition ${
                      errors.slug
                        ? "border-red-500 focus:ring-red-400"
                        : "border-other-border focus:ring-main-primary-400"
                    }${
                      form.title === ""
                        ? "placeholder:text-text-dark-disabled text-text-dark-disabled"
                        : "text-text-dark-primary"
                    }`}
                    required
                  />

                  {isSlugManual && (
                    <button
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({
                          ...prev,
                          slug: slugify(prev.title),
                        }));
                        setIsSlugManual(false);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-md bg-main-primary-100 text-main-primary hover:bg-main-primary hover:text-white transition cursor-pointer"
                    >
                      Reset slug
                    </button>
                  )}
                </div>
                {/* Error Message */}
                {errors.slug && (
                  <span className="text-red-500 text-sm">{errors.slug}</span>
                )}
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="category"
                  className="block font-dm font-normal text-sm md:text-base! leading-[1.4] tracking-[0.2px] text-text-dark-secondary"
                >
                  Kategori <span className="text-red-500">*</span>
                </label>

                <CategoryDropdown
                  value={form.category}
                  onChange={(val) => handleChange("category", val)}
                  errors={
                    typeof errors.category === "string" ? errors.category : ""
                  }
                />
              </div>

              {/* Thumbnail */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="file_input"
                  className="block font-dm font-normal text-sm md:text-base! leading-[1.4] tracking-[0.2px] text-text-dark-secondary"
                >
                  Upload thumbnail <span className="text-red-500">*</span>
                </label>

                {/* Preview */}
                {preview && (
                  <div className="mb-2">
                    <img
                      src={preview}
                      alt="Preview thumbnail"
                      className="w-40 h-40 object-cover rounded-md border border-other-border"
                    />
                  </div>
                )}

                <input
                  type="file"
                  name="thumbnail"
                  // value={form.thumbnail}
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleChange}
                  className={`w-full font-dm font-normal text-sm md:text-base! leading-[1.4] tracking-[0.2px] border rounded-md px-3 py-2 focus:ring-2 focus:outline-none transition ${
                    errors.thumbnail
                      ? "border-red-500 focus:ring-red-400"
                      : "border-other-border focus:ring-main-primary-400"
                  }`}
                  // required
                />
                {/* Error Message */}
                {errors.thumbnail && (
                  <span className="text-red-500 text-sm">
                    {errors.thumbnail}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="description"
                  className="block font-dm font-normal text-sm md:text-base! leading-[1.4] tracking-[0.2px] text-text-dark-secondary"
                >
                  Deskripsi <span className="text-red-500">*</span>
                </label>
                <textarea
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Masukkan Deskripsi"
                  className={`w-full font-dm font-normal text-sm md:text-base! leading-[1.4] tracking-[0.2px] border rounded-md px-3 py-2 focus:ring-2 focus:outline-none transition ${
                    errors.description
                      ? "border-red-500 focus:ring-red-400"
                      : "border-other-border focus:ring-main-primary-400"
                  }${
                    form.description === ""
                      ? "placeholder:text-text-dark-disabled text-text-dark-disabled"
                      : "text-text-dark-primary"
                  }
                        `}
                  required
                />
                {/* Error Message */}
                {errors.description && (
                  <span className="text-red-500 text-sm">
                    {errors.description}
                  </span>
                )}
              </div>

              <div className="flex gap-4">
                {/* Price */}
                <div className="w-full flex flex-col gap-1">
                  <label
                    htmlFor="price"
                    className="block font-dm font-normal text-sm md:text-base! leading-[1.4] tracking-[0.2px] text-text-dark-secondary"
                  >
                    Harga Awal <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="Masukkan harga"
                      className={`w-full font-dm font-normal text-sm md:text-base! leading-[1.4] tracking-[0.2px] border rounded-md px-3 py-2 focus:ring-2 focus:outline-none transition ${
                        errors.price
                          ? "border-red-500 focus:ring-red-400"
                          : "border-other-border focus:ring-main-primary-400"
                      }${
                        form.price === ""
                          ? "placeholder:text-text-dark-disabled text-text-dark-disabled"
                          : "text-text-dark-primary"
                      }`}
                      required
                    />
                  </div>
                  {/* Error Message */}
                  {errors.price && (
                    <span className="text-red-500 text-sm">{errors.price}</span>
                  )}
                </div>

                {/* Discount */}
                <div className="w-full flex flex-col gap-1">
                  <label
                    htmlFor="discount"
                    className="block font-dm font-normal text-sm md:text-base! leading-[1.4] tracking-[0.2px] text-text-dark-secondary"
                  >
                    Harga Diskon
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="discount"
                      value={form.discount}
                      onChange={handleChange}
                      placeholder="Masukkan harga diskon"
                      className={`w-full font-dm font-normal text-sm md:text-base! leading-[1.4] tracking-[0.2px] border rounded-md px-3 py-2 focus:ring-2 focus:outline-none transition ${
                        errors.discount
                          ? "border-red-500 focus:ring-red-400"
                          : "border-other-border focus:ring-main-primary-400"
                      }${
                        form.discount === ""
                          ? "placeholder:text-text-dark-disabled text-text-dark-disabled"
                          : "text-text-dark-primary"
                      }`}
                    />
                  </div>
                  {/* Error Message */}
                  {errors.discount && (
                    <span className="text-red-500 text-sm">
                      {errors.discount}
                    </span>
                  )}
                </div>
              </div>

              {/* Final Price */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="priceInfo"
                  className="block font-dm font-normal text-sm md:text-base! leading-[1.4] tracking-[0.2px] text-text-dark-secondary"
                >
                  Harga Akhir <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="priceInfo"
                    value={priceInfo.formatted.final}
                    placeholder="Masukkan harga"
                    className="w-full font-dm font-normal text-sm md:text-base! leading-[1.4] tracking-[0.2px] border border-other-border rounded-md px-3 py-2 placeholder:text-text-dark-disabled text-text-dark-disabled"
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {/* Button Create Products */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-[10px] text-center bg-main-primary hover:bg-transparent py-2.5 px-[26px] font-dm font-bold text-sm md:text-base! leading-[1.4] tracking-[0.2px] text-text-light-primary hover:text-main-primary border border-main-primary transition cursor-pointer"
              >
                {loading ? "Saving..." : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      </section>
      {/* End Section Card */}
    </>
  );
}
