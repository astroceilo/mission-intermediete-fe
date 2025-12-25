import { AnimatePresence, motion } from "framer-motion";
import { LogOut, UserRound } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

import useClickOutsideMulti from "../../../hooks/useClickOutsideMulti";
import { useAuth } from "../../../context/AuthContext";
import { profileMenuItems } from "../HeaderMenuItems";


export default function HeaderProfile({ handleLogout }) {
  const { user } = useAuth();
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const profileRef = useRef(null);

  const toggleProfile = () => setOpen((prev) => !prev);

  useClickOutsideMulti([profileRef], () => setOpen(false));

  return (
    <div ref={profileRef} className="relative w-10 h-10">
      <button
        onClick={toggleProfile}
        className="overflow-hidden rounded-md cursor-pointer"
      >
        <span className="sr-only">Profile menu</span>
        {error ? (
          <div className="flex items-center justify-center size-11 hover:bg-gray-100 rounded-[10px]">
            <UserRound className="w-6 h-6 text-gray-500" />
          </div>
        ) : (
          <img
            src={user?.photo || "/assets/images/profile/default.png"}
            onError={() => setError(true)}
            alt={user?.fullName || "User"}
            className="size-11 object-cover rounded-[10px]"
          />
        )}
      </button>

      {/* Menu Profile Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="profile-menu"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 z-10 mt-1 w-[200px] origin-top-right"
            role="menu"
          >
            <div
              className="rounded-md border border-other-border bg-white overflow-hidden"
              style={{
                boxShadow:
                  "0px 0px 1px 0px rgba(62, 67, 74, 0.31), 0px 18px 28px 0px rgba(62, 67, 74, 0.15)",
              }}
            >
              {/* item menu */}
              {profileMenuItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{
                    backgroundColor: "rgba(247,248,249,1)",
                    scale: 1.02,
                  }}
                  transition={{ duration: 0.15 }}
                >
                  <Link
                    to={item.href}
                    className="block w-full font-dm font-medium text-base leading-[1.4] tracking-[0.2px] border-b border-other-border px-4 py-3 text-text-dark-secondary hover:text-text-dark-primary"
                    role="menuitem"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              <motion.button
                type="button"
                whileHover={{
                  backgroundColor: "rgba(255, 240, 240, 1)",
                  scale: 1.02,
                }}
                transition={{ duration: 0.15 }}
                className="flex w-full font-dm font-medium text-base leading-[1.4] tracking-[0.2px] items-center gap-[5px] px-4 py-3 text-main-tertiary-400 cursor-pointer"
                role="menuitem"
                onClick={handleLogout}
              >
                Keluar
                <LogOut className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* End Menu Profile Dropdown */}
    </div>
  );
}
