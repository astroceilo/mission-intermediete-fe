import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink } from "react-router-dom";
import { useRef, useState } from "react";
import { Menu, X } from "lucide-react";

import useClickOutsideMulti from "../../../hooks/useClickOutsideMulti";
import { generalMenuItems } from "../HeaderMenuItems";


export default function HeaderHomeLogout() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const menuRef = useRef(null);

  useClickOutsideMulti([menuRef], () => setMenuOpen(false));

  return (
    <>
      <div className="hidden md:flex items-center gap-4">
        {/* Navigation links */}
        <nav className="flex items-center gap-9">
          <ul className="flex flex-col p-4 md:p-0 mt-4 border border-other-border rounded-[10px] bg-other-basebg md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-white">
            {generalMenuItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className="block py-2 px-3 text-text-dark-secondary hover:text-text-dark-primary text-other-body-medium-h3 transition-colors duration-300 ease-in-out"
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex md:gap-4">
          <Link
            to="/login"
            className="text-white hover:text-main-primary bg-main-primary hover:bg-white border border-main-primary focus:ring focus:ring-main-primary shadow-xs text-other-body-medium-h1 rounded-[10px] px-[26px] py-2.5 focus:outline-none transition-colors duration-300 ease-in-out"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-main-primary hover:text-white bg-white hover:bg-main-primary border border-main-primary focus:ring focus:ring-main-primary shadow-xs text-other-body-medium-h1 rounded-[10px] px-[26px] py-2.5 focus:outline-none transition-colors duration-300 ease-in-out"
          >
            Register
          </Link>
        </div>
      </div>

      <div ref={menuRef} className="md:hidden">
        {/* Mobile menu toggle button */}
        <button
          className="overflow-hidden p-2 rounded focus:outline-none"
          onClick={toggleMenu}
        >
          <span className="sr-only">Open main menu</span>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Nav */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="absolute md:hidden w-full left-0 right-0 bg-white shadow-lg z-20 overflow-hidden"
            >
              <nav className="flex flex-col">
                {generalMenuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block w-full px-4 py-3 border border-other-border text-other-body-medium-h3 text-text-dark-secondary hover:text-text-dark-primary transition-colors duration-300 ease-in-out"
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="flex flex-col items-center gap-4 px-4 py-3">
                  <Link
                    to="/login"
                    className="w-full text-white hover:text-main-primary bg-main-primary hover:bg-white border border-main-primary text-other-body-medium-h1 rounded-[10px] px-4 py-2 text-center transition-colors duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="w-full text-main-primary hover:text-white bg-white hover:bg-main-primary border border-main-primary text-other-body-medium-h1 rounded-[10px] px-4 py-2 text-center transition-colors duration-300"
                  >
                    Register
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
