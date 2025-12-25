import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";


export default function FooterAccordion({
  title,
  links,
  isOpen,
  onToggle,
}) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col gap-2 md:gap-[15px]!">
      {/* Title */}
      <button
        onClick={() => !isDesktop && onToggle()}
        className="w-full flex justify-between items-center text-other-body-medium-h1 text-text-dark-primary group"
      >
        {title}
        {!isDesktop && (
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <ChevronRight className="size-5" />
          </motion.div>
        )}
      </button>

      {/* Links */}
      {isDesktop ? (
        <ul className="flex flex-col text-other-body-medium-h3 gap-[13px] text-text-dark-secondary">
          {links.map((link, index) => (
            <li key={index}>
              <Link
                to={link.to}
                className="hover:text-text-dark-primary transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.ul
              key="accordion-content"
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="flex flex-col text-other-body-medium-h3 gap-[13px] text-text-dark-secondary overflow-hidden"
            >
              {links.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    className="hover:text-text-dark-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
