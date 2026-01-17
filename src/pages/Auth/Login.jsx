import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

import { validateLoginForm } from "../../utils/validations/validateLoginForm";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) navigate("/");
  }, [navigate]);

  // handle umum untuk input biasa
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    const errorMsg = validateLoginForm(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  // value yang dikirim ke backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.get("/users");
      const users = res.data;
      if (!users.length) {
        toast.error("Belum ada user terdaftar di sistem");
        return;
      }

      const foundUser = users.find(
        (u) => u.email.toLowerCase() === form.email.toLowerCase()
      );

      if (!foundUser) {
        toast.warning("Email belum terdaftar");
        return;
      }

      if (foundUser.password !== form.password) {
        toast.error("Password salah");
        return;
      }

      toast.success("Login berhasil 🎉", {
        autoClose: 2000,
      });
      login(foundUser);
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      toast.error("Gagal konek ke server");
      console.error(err);
    }
  };

  return (
    // <div className="min-h-screen flex items-center justify-center px-4 md:px-0">
    <div className="w-full md:w-[590px]! flex flex-col rounded-sm border border-other-border p-5 md:p-9! gap-5 md:gap-9! bg-text-light-primary shadow-md">
      {/* Title */}
      <div className="flex flex-col items-center gap-2.5">
        <h3 className="font-pop font-semibold text-2xl md:text-[32px]! leading-[1.1] tracking-normal text-text-dark-primary">
          Masuk ke Akun
        </h3>
        <p className="font-dm font-normal text-sm md:text-base! leading-[1.4] tracking-[0.2px] text-text-dark-secondary">
          Yuk, lanjutin belajarmu di videobelajar.
        </p>
      </div>

      <div className="flex flex-col gap-5 md:gap-6!">
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
          <div className="flex flex-col gap-3 md:gap-4!">
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
                  }
                  `}
                  required
                />

                {/* Tombol toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
              {errors.password && (
                <p className="text-red-500">{errors.password}</p>
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
            <button
              type="submit"
              className="w-full rounded-[10px] text-center bg-main-primary hover:bg-transparent py-2.5 px-[26px] font-dm font-bold text-sm md:text-base! leading-[1.4] tracking-[0.2px] text-text-light-primary hover:text-main-primary border border-main-primary transition cursor-pointer"
            >
              Masuk
            </button>

            {/* Button Register */}
            <Link
              to="/register"
              className="w-full rounded-[10px] text-center bg-main-primary-100 hover:bg-transparent py-2.5 px-[26px] font-dm font-bold text-sm md:text-base! leading-[1.4] tracking-[0.2px] text-main-primary hover:text-main-primary border border-transparent hover:border-main-primary transition cursor-pointer"
            >
              Daftar
            </Link>
          </div>
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
