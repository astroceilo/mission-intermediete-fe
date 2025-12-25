import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import HeaderHomeLogout from "./Parts/HeaderHomeLogout";
import HeaderHomeLogin from "./Parts/HeaderHomeLogin";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/images/logo.png";

export default function Header() {
  const { isLoggedIn, logout } = useAuth();

  const [scrolled, setScrolled] = useState(false);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isAuthPage = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout(); // hapus isLoggedIn + update context

    toast.info("Logout berhasil", { autoClose: 1000 });

    setTimeout(() => navigate("/"), 1000);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b border-other-border bg-white backdrop-blur-md transition-all 
      ${scrolled ? "bg-white/70 shadow-[0_2px_10px_rgba(0,0,0,0.06)]" : ""}`}
    >
      <div className="h-20 max-w-[1440px] mx-auto flex items-center justify-between md:gap-9 px-5 md:px-10! lg:px-[120px]! py-4 md:py-3.5! lg:py-3!">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="sr-only">Home</span>
          <img
            src={logo}
            className="w-[152px] h-[42px] md:w-[194.5px]! md:h-12! lg:w-[237px]! lg:h-14! object-contain"
            alt="Videobelajar Logo"
          />
        </Link>

        {(() => {
          if (isAuthPage) return null; // login/register
          if (!isLoggedIn) return <HeaderHomeLogout />; // home / course sebelum login
          return <HeaderHomeLogin handleLogout={handleLogout} />;
        })()}
      </div>
    </header>
  );
}
