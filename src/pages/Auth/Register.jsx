import { parsePhoneNumberFromString } from "libphonenumber-js";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

import { validateRegisterForm } from "../../utils/validations/validateRegisterForm";
import GenderDropdown from "../../components/Dropdown/GenderDropdown";
import PhoneInputCustom from "../../components/PhoneInputCustom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

export default function Register() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    gender: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    fullname: "",
    email: "",
    gender: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [payload, setPayload] = useState(null);
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) navigate("/");
  }, [navigate]);

  // handle general for input
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };

    setForm(updatedForm);

    const errorMsg = validateRegisterForm(name, value, updatedForm);

    const updatedErrors = { ...errors, [name]: errorMsg };

    // cek if some field change, for validate confirmpassword
    if (name === "password" && form.confirmPassword) {
      updatedErrors.confirmPassword = validateRegisterForm(
        "confirmPassword",
        form.confirmPassword,
        updatedForm
      );
    }
    if (name === "confirmPassword" && form.password) {
      updatedErrors.confirmPassword = validateRegisterForm(
        "confirmPassword",
        value,
        updatedForm
      );
    }

    setErrors(updatedErrors);
  };

  // for componen custom (gender, phone)
  const handleCustomChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    const errorMsg = validateRegisterForm(name, value, {
      ...form,
      [name]: value,
    });
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  // helper: validate all field now (sinkron)
  const validateAll = () => {
    const newErrors = {
      fullname: "",
      email: "",
      gender: "",
      phone: "",
      password: "",
      confirmPassword: "",
    };
    // validate any field w/ helper
    Object.entries(form).forEach(([key, val]) => {
      newErrors[key] = validateRegisterForm(key, val, form) || "";
    });

    setErrors(newErrors);
    // return true if all empty (valid)
    return !Object.values(newErrors).some(
      (msg) =>
        msg && (typeof msg === "string" ? msg.length > 0 : msg.length > 0)
    );
  };

  // this value send to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateAll();
    if (!isValid) {
      toast.error("Masih ada data yang belum valid. Periksa kembali input.");
      return;
    }

    const parsed = parsePhoneNumberFromString(form.phone || "");
    if (!parsed || !parsed.isValid()) {
      toast.error("Nomor telepon tidak valid!");
      return;
    }

    try {
      // cek email
      const checkEmail = await api.get("/users");

      const isExist = checkEmail.data.some(
        (u) => u.email === form.email.trim()
      );

      if (isExist) {
        toast.warning("Email sudah terdaftar");
        return;
      }

      // register
      const res = await api.post("/users", {
        fullname: form.fullname,
        email: form.email,
        gender: form.gender,
        phone: parsed.number,
        password: form.password,
        avatar: null,
        role: "student",
      });

      toast.success("Pendaftaran berhasil! 🎉", { autoClose: 2000 });

      login(res.data);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      toast.error(err, "Terjadi kesalahan server. Coba lagi.");
      // console.error(err);

      // console.log("STATUS:", err.response?.status);
      // console.log("URL:", err.config?.url);
      // console.log("PARAMS:", err.config?.params);
      // console.log("RESPONSE:", err.response?.data);
    }

    // setPayload(data);
  };

  return (
    // <div className="min-h-screen flex items-center justify-center px-4 md:px-0">
    <div className="w-full md:w-[590px]! flex flex-col rounded-sm border border-other-border p-5 md:p-9! gap-5 md:gap-9! bg-text-light-primary shadow-md">
      {/* Title */}
      <div className="flex flex-col items-center gap-2.5">
        <h3 className="font-pop font-semibold text-2xl md:text-[32px]! leading-[1.1] tracking-normal text-text-dark-primary">
          Pendaftaran Akun
        </h3>
        <p className="font-dm font-normal text-sm md:text-base! leading-[1.4] tracking-[0.2px] text-text-dark-secondary">
          Yuk, daftarkan akunmu sekarang juga!
        </p>
      </div>

      <div className="flex flex-col gap-4 md:gap-6!">
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
          <div className="flex flex-col gap-3 md:gap-4!">
            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="fullname"
                className="block font-dm font-normal text-sm md:text-base! leading-[1.4] tracking-[0.2px] text-text-dark-secondary"
              >
                Nama Lengkap <span className="text-error-default">*</span>
              </label>
              <input
                type="text"
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
                placeholder="Masukkan Nama Lengkap"
                className={`w-full font-dm font-normal text-sm md:text-base! leading-[1.4] tracking-[0.2px] border rounded-md px-3 py-2 focus:ring-2 focus:outline-none transition ${
                  errors.fullname
                    ? "border-red-500 focus:ring-red-400"
                    : "border-other-border focus:ring-main-primary-400"
                }
                ${
                  form.fullname === ""
                    ? "placeholder:text-text-dark-disabled text-text-dark-disabled"
                    : "text-text-dark-primary"
                }`}
                required
              />
              {/* Error Message */}
              {errors.fullname && (
                <span className="text-red-500 text-sm">{errors.fullname}</span>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="block font-dm font-normal text-sm md:text-base! leading-[1.4] tracking-[0.2px] text-text-dark-secondary"
              >
                E-Mail <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Masukkan email"
                className={`w-full font-dm font-normal text-sm md:text-base! leading-[1.4] tracking-[0.2px] border rounded-md px-3 py-2 focus:ring-2 focus:outline-none transition ${
                  errors.email
                    ? "border-red-500 focus:ring-red-400"
                    : "border-other-border focus:ring-main-primary-400"
                }
                ${
                  form.email === ""
                    ? "placeholder:text-text-dark-disabled text-text-dark-disabled"
                    : "text-text-dark-primary"
                }
                `}
                required
              />
              {/* Error Message */}
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email}</span>
              )}
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="gender"
                className="block font-dm font-normal text-sm md:text-base! leading-[1.4] tracking-[0.2px] text-text-dark-secondary"
              >
                Jenis Kelamin <span className="text-red-500">*</span>
              </label>

              <GenderDropdown
                value={form.gender}
                onChange={(val) => handleCustomChange("gender", val)}
                errors={typeof errors.gender === "string" ? errors.gender : ""}
              />
            </div>

            {/* Number Phone */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="phone"
                className="block font-dm font-normal text-sm md:text-base! leading-[1.4] tracking-[0.2px] text-text-dark-secondary"
              >
                No. Hp <span className="text-red-500">*</span>
              </label>

              <PhoneInputCustom
                value={form.phone}
                onChange={(val) => handleCustomChange("phone", val)}
                errors={typeof errors.phone === "string" ? errors.phone : ""}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                className="block font-dm font-normal text-sm md:text-base! leading-[1.4] tracking-[0.2px] text-text-dark-secondary"
              >
                Kata Sandi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  // onChange={handlePasswordChange}
                  onChange={handleChange}
                  placeholder="Masukkan kata sandi"
                  className={`w-full font-dm font-normal text-sm md:text-base! leading-[1.4] tracking-[0.2px] border rounded-md px-3 py-2 focus:ring-2 focus:outline-none transition ${
                    errors.password
                      ? "border-red-500 focus:ring-red-400"
                      : "border-other-border focus:ring-main-primary-400"
                  }
                  ${
                    form.password === ""
                      ? "placeholder:text-text-dark-disabled text-text-dark-disabled"
                      : "text-text-dark-primary"
                  }`}
                  required
                />

                {/* Tombol toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-2 flex items-center justify-center p-1.5 transition cursor-pointer"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={showPassword ? "eye-off" : "eye"}
                      initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      {showPassword ? (
                        <Eye className="w-6 h-6 text-text-dark-secondary" />
                      ) : (
                        <EyeOff className="w-6 h-6 text-text-dark-disabled" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </button>
              </div>
              {/* Error Message */}
              {errors.password &&
                (Array.isArray(errors.password) ? (
                  <ul className="text-red-500 text-sm list-disc list-inside">
                    Password must meet the following requirements:
                    {errors.password.map((msg, idx) => (
                      <li key={idx}>{msg}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-red-500 text-sm">
                    {errors.password}
                  </span>
                ))}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="confirmPassword"
                className="block font-dm font-normal text-sm md:text-base! leading-[1.4] tracking-[0.2px] text-text-dark-secondary"
              >
                Konfirmasi Kata Sandi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Konfirmasi kata sandi"
                  className={`w-full font-dm font-normal text-sm md:text-base! leading-[1.4] tracking-[0.2px] border rounded-md px-3 py-2 focus:ring-2 focus:outline-none transition ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-400"
                      : "border-other-border focus:ring-main-primary-400"
                  }
                  ${
                    form.confirmPassword === ""
                      ? "placeholder:text-text-dark-disabled text-text-dark-disabled"
                      : "text-text-dark-primary"
                  }`}
                  required
                />

                {/* Tombol toggle */}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-2 flex items-center justify-center p-1.5 transition cursor-pointer"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={showConfirmPassword ? "eye-off" : "eye"}
                      initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      {showConfirmPassword ? (
                        <Eye className="w-6 h-6 text-text-dark-secondary" />
                      ) : (
                        <EyeOff className="w-6 h-6 text-text-dark-disabled" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </button>
              </div>
              {/* Error Message */}
              {errors.confirmPassword && (
                <span className="text-red-500 text-sm">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <div className="text-right">
              <Link
                to="#"
                className="font-dm font-medium text-sm md:text-base! leading-[1.4] tracking-[0.2px] text-text-dark-secondary hover:text-text-dark-primary"
              >
                Lupa Password?
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Button Login */}
            <Link
              to="/login"
              className="w-full rounded-[10px] text-center bg-main-primary hover:bg-transparent py-2.5 px-[26px] font-dm font-bold text-sm md:text-base! leading-[1.4] tracking-[0.2px] text-text-light-primary hover:text-main-primary border border-main-primary transition cursor-pointer"
            >
              Masuk
            </Link>

            {/* Button Register */}
            <button
              type="submit"
              className="w-full rounded-[10px] text-center bg-main-primary-100 hover:bg-transparent py-2.5 px-[26px] font-dm font-bold text-sm md:text-base! leading-[1.4] tracking-[0.2px] text-main-primary hover:text-main-primary border border-transparent hover:border-main-primary transition cursor-pointer"
            >
              Daftar
            </button>
          </div>

          {/* {payload && (
              <pre className="mt-4 text-xs text-left bg-gray-100 p-2 rounded">
                {JSON.stringify(payload, null, 2)}
              </pre>
            )} */}
        </form>

        {/* Divider */}
        <div className="flex items-center gap-2.5">
          <hr className="grow border-other-border border-t-2" />
          <span className="font-dm font-normal text-sm md:text-base! leading-[1.4] tracking-[0.2px] text-text-dark-secondary">
            atau
          </span>
          <hr className="grow border-other-border border-t-2" />
        </div>

        {/* Google Login */}
        <button className="w-full flex items-center justify-center rounded-[10px] border border-other-border bg-text-light-primary px-2 py-2.5 gap-2 font-dm font-bold text-sm md:text-base! text-text-dark-secondary hover:text-text-dark-primary transition cursor-pointer">
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Masuk dengan Google
        </button>
      </div>
    </div>
    // </div>
  );
}
