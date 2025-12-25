import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { useRef, useState } from "react";

import { generalMenuItems, profileMenuItems } from "../HeaderMenuItems";
import useClickOutsideMulti from "../../../hooks/useClickOutsideMulti";
import HeaderProfile from "./HeaderProfile";


export default function HeaderHomeLogin({ handleLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const allMenuItems = [...generalMenuItems, ...profileMenuItems];

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
          <HeaderProfile handleLogout={handleLogout} />
        </nav>
      </div>

      <div ref={menuRef} className="relative md:hidden">
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
                {allMenuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block w-full px-4 py-3 border border-other-border text-other-body-medium-h3 text-text-dark-secondary hover:text-text-dark-primary transition-colors duration-300 ease-in-out"
                  >
                    {item.name}
                  </Link>
                ))}

                <motion.button
                  type="button"
                  whileHover={{
                    backgroundColor: "rgba(255, 240, 240, 1)",
                    scale: 1.02,
                  }}
                  transition={{ duration: 0.15 }}
                  className="flex w-full items-center gap-[5px] px-4 py-3 font-medium text-base text-main-tertiary-400 cursor-pointer"
                  role="menuitem"
                  onClick={handleLogout}
                >
                  Keluar
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
